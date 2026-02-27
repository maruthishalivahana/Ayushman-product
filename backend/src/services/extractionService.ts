import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

export type FraudModelInstance = {
    Claim_Amount: number;
    Patient_Age: number;
    Number_of_Procedures: number;
    Length_of_Stay_Days: number;
    Deductible_Amount: number;
    CoPay_Amount: number;
    Provider_Patient_Distance_Miles: number;
    Claim_Submitted_Late: number;
};

const FEATURE_PRIORS: FraudModelInstance = {
    Claim_Amount: 45000,
    Patient_Age: 45,
    Number_of_Procedures: 2,
    Length_of_Stay_Days: 5,
    Deductible_Amount: 500,
    CoPay_Amount: 100,
    Provider_Patient_Distance_Miles: 12.5,
    Claim_Submitted_Late: 0
};

const FEATURE_KEYS = Object.keys(FEATURE_PRIORS) as Array<keyof FraudModelInstance>;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const toNumberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(String(value).replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
};

const toIntOrNull = (value: unknown): number | null => {
    const parsed = toNumberOrNull(value);
    if (parsed === null) return null;
    return Math.trunc(parsed);
};

const toStringOrNull = (value: unknown): string | null => {
    if (value === null || value === undefined) return null;
    const text = String(value).trim();
    return text.length ? text : null;
};

const toISODateOrNull = (value: unknown): string | null => {
    const text = toStringOrNull(value);
    if (!text) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
};

const extractJsonFromText = (raw: string): Record<string, any> => {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
        const direct = JSON.parse(cleaned);
        if (direct && typeof direct === 'object' && !Array.isArray(direct)) return direct;
    } catch {
        // continue
    }

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
        const slice = cleaned.slice(start, end + 1);
        const parsed = JSON.parse(slice);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    }

    throw new Error('Model returned invalid JSON object');
};

export const inspectUploadedFile = (filePath: string, originalName?: string, mimeType?: string) => {
    const stat = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath);
    const headerProbe = buffer.subarray(0, 2048).toString('latin1');
    const magic = buffer.subarray(0, 16);

    const isJpeg = magic.length >= 3 && magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
    const isPng = magic.length >= 8
        && magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47
        && magic[4] === 0x0d && magic[5] === 0x0a && magic[6] === 0x1a && magic[7] === 0x0a;
    const isBmp = magic.length >= 2 && magic[0] === 0x42 && magic[1] === 0x4d;
    const isWebp = magic.length >= 12
        && magic[0] === 0x52 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x46
        && magic[8] === 0x57 && magic[9] === 0x45 && magic[10] === 0x42 && magic[11] === 0x50;
    const isTiff = magic.length >= 4
        && ((magic[0] === 0x49 && magic[1] === 0x49 && magic[2] === 0x2a && magic[3] === 0x00)
            || (magic[0] === 0x4d && magic[1] === 0x4d && magic[2] === 0x00 && magic[3] === 0x2a));
    const hasImageSignature = isJpeg || isPng || isBmp || isWebp || isTiff;

    const ext = path.extname(originalName || '').toLowerCase();
    const isPdf = headerProbe.includes('%PDF') || ext === '.pdf' || mimeType === 'application/pdf';
    const isImageMime = typeof mimeType === 'string' && mimeType.startsWith('image/');
    const isImageExt = ['.png', '.jpg', '.jpeg', '.bmp', '.tif', '.tiff', '.webp'].includes(ext);
    const isImage = hasImageSignature || (isImageMime && isImageExt);

    return {
        file_size_bytes: stat.size,
        header_preview: headerProbe.slice(0, 120),
        has_pdf_signature: headerProbe.includes('%PDF'),
        has_image_signature: hasImageSignature,
        is_pdf: isPdf,
        is_image: isImage,
        extension: ext || null,
        mime_type: mimeType || null
    };
};

const extractTextFromImage = async (filePath: string): Promise<string> => {
    const ocrResult = await Tesseract.recognize(filePath, 'eng');
    const text = String(ocrResult?.data?.text || '').trim();
    if (!text) {
        throw new Error('Image OCR extracted empty text');
    }
    return text;
};

export const extractTextFromDocument = async (
    filePath: string,
    originalName?: string,
    mimeType?: string
): Promise<string> => {
    const inspection = inspectUploadedFile(filePath, originalName, mimeType);

    if (inspection.is_pdf) {
        const pdfBuffer = fs.readFileSync(filePath);
        const parsed = await pdfParse(pdfBuffer);
        const text = typeof parsed?.text === 'string' ? parsed.text.trim() : '';
        if (!text) {
            throw new Error('PDF parsed but text is empty');
        }
        return text;
    }

    if (inspection.is_image) {
        return extractTextFromImage(filePath);
    }

    throw new Error('Unsupported file type. Please upload a PDF or image.');
};

export const extractStructuredDataWithLLM = async (rawText: string): Promise<Record<string, any>> => {
    if (!rawText?.trim()) {
        throw new Error('raw_text is empty');
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!openRouterApiKey && !geminiApiKey) {
        throw new Error('Set GEMINI_API_KEY or OPENROUTER_API_KEY');
    }

    const openRouterPrimary = process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct';
    const openRouterFallback = process.env.OPENROUTER_FALLBACK_MODEL || 'google/gemini-2.0-flash-001';
    const openRouterModels = Array.from(new Set([openRouterPrimary, openRouterFallback]));
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    const maxPromptChars = Number(process.env.MAX_PROMPT_CHARS || 50000);
    const textForPrompt = rawText.slice(0, maxPromptChars);

    const prompt = `You are a senior healthcare data engineer and data preprocessing expert specializing in medical claim normalization and fraud detection pipelines.

Your task is to extract, clean, normalize, and complete structured healthcare claim data from the provided unstructured medical claim report text.

You must return ONLY valid JSON matching the exact schema below.

Schema:
{
"Patient_ID": string,
"Provider_ID": string,
"Hospital_ID": string,
"Claim_Amount": number,
"Diagnosis_Code": string,
"Procedure_Code": string,
"Admission_Date": string,
"Discharge_Date": string,
"Length_of_Stay": number,
"Admission_Type": string,
"Deductible": number,
"CoPay": number
}

STRICT REQUIREMENTS:

DATA EXTRACTION:

* Extract values accurately from the text.
* Normalize field names to match the schema exactly.

DATA CLEANING:

* Remove currency symbols (₹, $, etc.)
* Remove commas from numbers
* Convert numeric values to proper number format
* Convert dates to YYYY-MM-DD format
* Trim whitespace
* Ensure proper data types

DATA COMPLETION (CRITICAL REQUIREMENT):
If any field is missing, unclear, or not explicitly present in the input, you MUST intelligently infer and fill the field using the most realistic and probabilistically correct value based on:

* Context from the document
* Medical claim standards
* Logical relationships between fields
* Healthcare domain knowledge
* Typical hospital claim patterns

Examples of intelligent inference:

* Length_of_Stay = Discharge_Date − Admission_Date
* Deductible = typically 0–2000 depending on claim amount
* CoPay = typically 5–20% of Claim_Amount
* Admission_Type = Emergency, Urgent, or Elective based on diagnosis and procedure
* Provider_ID and Hospital_ID inferred from hospital name or code
* Procedure_Code inferred from diagnosis if missing

DO NOT leave fields empty unless absolutely impossible to infer.

If inference is required, generate the most realistic value.

CONSISTENCY REQUIREMENTS:

* Length_of_Stay must equal difference between Admission_Date and Discharge_Date
* CoPay must not exceed Claim_Amount
* Deductible must not exceed Claim_Amount
* All numeric fields must be valid numbers (not strings)

OUTPUT REQUIREMENTS:

* Return ONLY valid JSON
* Do NOT include explanations
* Do NOT include markdown
* Do NOT include comments
* Do NOT include extra text

OUTPUT FORMAT EXAMPLE:
{
"Patient_ID": "P12345",
"Provider_ID": "PR6789",
"Hospital_ID": "H4321",
"Claim_Amount": 45000,
"Diagnosis_Code": "A09",
"Procedure_Code": "80053",
"Admission_Date": "2026-01-10",
"Discharge_Date": "2026-01-15",
"Length_of_Stay": 5,
"Admission_Type": "Emergency",
"Deductible": 500,
"CoPay": 100
}

INPUT TEXT:
${textForPrompt}`;

    const modelErrors: string[] = [];

    if (geminiApiKey) {
        try {
            const geminiResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
                {
                    systemInstruction: {
                        parts: [{ text: 'You extract structured fraud-model-ready medical claim data as strict JSON.' }]
                    },
                    contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nDocument Text:\n${textForPrompt}` }] }],
                    generationConfig: { temperature: 0.1 }
                },
                { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }
            );

            const geminiContent = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof geminiContent === 'string' && geminiContent.trim()) {
                try {
                    return extractJsonFromText(geminiContent);
                } catch {
                    modelErrors.push(`gemini-direct(${geminiModel}): returned non-JSON output`);
                }
            } else {
                modelErrors.push(`gemini-direct(${geminiModel}): missing message content`);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                modelErrors.push(`gemini-direct(${geminiModel}): ${JSON.stringify(error.response?.data || error.message)}`);
            } else {
                modelErrors.push(`gemini-direct(${geminiModel}): ${(error as Error).message}`);
            }
        }
    }

    if (!openRouterApiKey) {
        throw new Error(`Gemini API error: ${modelErrors.join(' | ')}`);
    }

    for (const model of openRouterModels) {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model,
                    messages: [
                        { role: 'system', content: 'You extract structured fraud-model-ready medical claim data as strict JSON.' },
                        { role: 'user', content: `${prompt}\n\nDocument Text:\n${textForPrompt}` }
                    ],
                    temperature: 0.1
                },
                {
                    headers: {
                        Authorization: `Bearer ${openRouterApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000
                }
            );

            const contentRaw = response.data?.choices?.[0]?.message?.content;
            if (!contentRaw || typeof contentRaw !== 'string') {
                modelErrors.push(`${model}: missing message content`);
                continue;
            }

            try {
                return extractJsonFromText(contentRaw);
            } catch {
                modelErrors.push(`${model}: returned non-JSON output`);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                modelErrors.push(`${model}: ${JSON.stringify(error.response?.data || error.message)}`);
            } else {
                modelErrors.push(`${model}: ${(error as Error).message}`);
            }
        }
    }

    throw new Error(`OpenRouter API error (all models failed): ${modelErrors.join(' | ')}`);
};

export const cleanAndValidateData = (jsonData: any) => {
    const cleanedClaim = {
        Patient_ID: toStringOrNull(jsonData.Patient_ID),
        Provider_ID: toStringOrNull(jsonData.Provider_ID),
        Hospital_ID: toStringOrNull(jsonData.Hospital_ID),
        Claim_Amount: toNumberOrNull(jsonData.Claim_Amount),
        Diagnosis_Code: toStringOrNull(jsonData.Diagnosis_Code),
        Procedure_Code: toStringOrNull(jsonData.Procedure_Code),
        Admission_Date: toISODateOrNull(jsonData.Admission_Date),
        Discharge_Date: toISODateOrNull(jsonData.Discharge_Date),
        Length_of_Stay: toIntOrNull(jsonData.Length_of_Stay_Days ?? jsonData.Length_of_Stay),
        Admission_Type: toStringOrNull(jsonData.Admission_Type),
        Deductible: toNumberOrNull(jsonData.Deductible_Amount ?? jsonData.Deductible),
        CoPay: toNumberOrNull(jsonData.CoPay_Amount ?? jsonData.CoPay),
        Insurance_Plan: toStringOrNull(jsonData.Insurance_Plan)
    };

    const knownKeys = new Set([
        'Patient_ID', 'Provider_ID', 'Hospital_ID', 'Claim_Amount', 'Diagnosis_Code', 'Procedure_Code',
        'Admission_Date', 'Discharge_Date', 'Length_of_Stay', 'Length_of_Stay_Days',
        'Admission_Type', 'Deductible', 'Deductible_Amount', 'CoPay', 'CoPay_Amount',
        'Insurance_Plan', 'Patient_Age', 'Number_of_Procedures', 'Provider_Patient_Distance_Miles',
        'Claim_Submitted_Late'
    ]);

    const otherFields: Record<string, unknown> = {};
    Object.entries(jsonData || {}).forEach(([key, value]) => {
        if (!knownKeys.has(key)) {
            otherFields[key] = value;
        }
    });

    return {
        ...cleanedClaim,
        Other_Fraud_Related_Fields: Object.keys(otherFields).length ? otherFields : null
    };
};

const deriveLengthOfStay = (claim: any): number | null => {
    const direct = toIntOrNull(claim.Length_of_Stay);
    if (direct !== null && direct > 0) return direct;

    if (claim.Admission_Date && claim.Discharge_Date) {
        const admission = new Date(claim.Admission_Date);
        const discharge = new Date(claim.Discharge_Date);
        if (!Number.isNaN(admission.getTime()) && !Number.isNaN(discharge.getTime())) {
            const diff = Math.ceil((discharge.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) return diff;
        }
    }

    return null;
};

const inferProbabilisticFallback = (field: keyof FraudModelInstance, current: Partial<FraudModelInstance>, claim: any): number => {
    const claimAmount = current.Claim_Amount ?? FEATURE_PRIORS.Claim_Amount;

    switch (field) {
        case 'Claim_Amount':
            return FEATURE_PRIORS.Claim_Amount;
        case 'Patient_Age':
            return clamp(Math.round(30 + (claimAmount / 100000) * 25), 18, 90);
        case 'Number_of_Procedures':
            return clamp(Math.round(claimAmount / 25000), 1, 8);
        case 'Length_of_Stay_Days':
            return clamp(Math.round(claimAmount / 15000), 1, 30);
        case 'Deductible_Amount':
            return clamp(Math.round(claimAmount * 0.01), 100, 5000);
        case 'CoPay_Amount':
            return clamp(Math.round(claimAmount * 0.002), 20, 1000);
        case 'Provider_Patient_Distance_Miles':
            return clamp(Number((5 + (claimAmount / 100000) * 20).toFixed(1)), 1, 100);
        case 'Claim_Submitted_Late': {
            const admissionType = String(claim.Admission_Type || '').toLowerCase();
            if (admissionType.includes('emergency')) return 0;
            return claimAmount > 60000 ? 1 : 0;
        }
        default:
            return FEATURE_PRIORS[field];
    }
};

export const buildFraudModelInstances = (cleanClaimData: any, llmData: any): { instances: FraudModelInstance[] } => {
    const proceduresRaw = toStringOrNull(llmData?.Procedure_Code || cleanClaimData?.Procedure_Code);
    const estimatedProcedureCount = proceduresRaw
        ? proceduresRaw.split(/[;,|/]/).map((item) => item.trim()).filter(Boolean).length
        : null;

    const mapped: Partial<FraudModelInstance> = {
        Claim_Amount: toNumberOrNull(llmData?.Claim_Amount ?? cleanClaimData?.Claim_Amount) ?? undefined,
        Patient_Age: toIntOrNull(llmData?.Patient_Age) ?? undefined,
        Number_of_Procedures: toIntOrNull(llmData?.Number_of_Procedures) ?? estimatedProcedureCount ?? undefined,
        Length_of_Stay_Days: toIntOrNull(llmData?.Length_of_Stay_Days) ?? deriveLengthOfStay(cleanClaimData) ?? undefined,
        Deductible_Amount: toNumberOrNull(llmData?.Deductible_Amount ?? cleanClaimData?.Deductible) ?? undefined,
        CoPay_Amount: toNumberOrNull(llmData?.CoPay_Amount ?? cleanClaimData?.CoPay) ?? undefined,
        Provider_Patient_Distance_Miles: toNumberOrNull(llmData?.Provider_Patient_Distance_Miles) ?? undefined,
        Claim_Submitted_Late: toIntOrNull(llmData?.Claim_Submitted_Late) ?? undefined
    };

    const resolved: FraudModelInstance = { ...FEATURE_PRIORS };

    FEATURE_KEYS.forEach((key) => {
        const value = mapped[key];
        if (value !== undefined && value !== null && Number.isFinite(value)) {
            if (key === 'Claim_Submitted_Late') {
                resolved[key] = value >= 1 ? 1 : 0;
                return;
            }
            resolved[key] = value;
            return;
        }

        resolved[key] = inferProbabilisticFallback(key, { ...resolved, ...mapped }, cleanClaimData);
    });

    resolved.Patient_Age = clamp(Math.round(resolved.Patient_Age), 18, 100);
    resolved.Number_of_Procedures = clamp(Math.round(resolved.Number_of_Procedures), 1, 15);
    resolved.Length_of_Stay_Days = clamp(Math.round(resolved.Length_of_Stay_Days), 1, 60);
    resolved.Deductible_Amount = clamp(Number(resolved.Deductible_Amount.toFixed(2)), 0, 20000);
    resolved.CoPay_Amount = clamp(Number(resolved.CoPay_Amount.toFixed(2)), 0, 10000);
    resolved.Provider_Patient_Distance_Miles = clamp(Number(resolved.Provider_Patient_Distance_Miles.toFixed(2)), 0, 500);
    resolved.Claim_Submitted_Late = resolved.Claim_Submitted_Late >= 1 ? 1 : 0;
    resolved.Claim_Amount = Number(resolved.Claim_Amount.toFixed(2));

    return { instances: [resolved] };
};

export const convertToCSV = async (data: any, outputPath: string) => {
    const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: [
            { id: 'Patient_ID', title: 'Patient_ID' },
            { id: 'Provider_ID', title: 'Provider_ID' },
            { id: 'Hospital_ID', title: 'Hospital_ID' },
            { id: 'Claim_Amount', title: 'Claim_Amount' },
            { id: 'Diagnosis_Code', title: 'Diagnosis_Code' },
            { id: 'Procedure_Code', title: 'Procedure_Code' },
            { id: 'Admission_Date', title: 'Admission_Date' },
            { id: 'Discharge_Date', title: 'Discharge_Date' },
            { id: 'Length_of_Stay', title: 'Length_of_Stay' },
            { id: 'Admission_Type', title: 'Admission_Type' },
            { id: 'Deductible', title: 'Deductible' },
            { id: 'CoPay', title: 'CoPay' },
            { id: 'Insurance_Plan', title: 'Insurance_Plan' },
            { id: 'Other_Fraud_Related_Fields', title: 'Other_Fraud_Related_Fields' }
        ],
        append: fs.existsSync(outputPath)
    });

    await csvWriter.writeRecords([
        {
            ...data,
            Other_Fraud_Related_Fields: data?.Other_Fraud_Related_Fields
                ? JSON.stringify(data.Other_Fraud_Related_Fields)
                : null
        }
    ]);
};
