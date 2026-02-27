import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {
    extractTextFromDocument,
    extractStructuredDataWithLLM,
    cleanAndValidateData,
    convertToCSV,
    inspectUploadedFile,
    buildFraudModelInstances
} from '../services/extractionService';
import { predictFraud } from '../services/mlService';
import Claim from '../models/Claim';

export const validatePdfUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const report = inspectUploadedFile(req.file.path, req.file.originalname, req.file.mimetype);

        return res.status(200).json({
            ok: report.is_pdf || report.is_image,
            ...report,
            advice: report.is_pdf || report.is_image
                ? 'Document looks valid for extraction.'
                : 'Please upload a valid PDF or image document.'
        });
    } catch (error: any) {
        return res.status(500).json({
            error: error?.message || 'Failed to validate PDF file'
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const validateAndParsePdf = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const report = inspectUploadedFile(req.file.path, req.file.originalname, req.file.mimetype);
        if (!report.is_pdf && !report.is_image) {
            return res.status(400).json({
                ok: false,
                stage: 'validate_document',
                ...report,
                error: 'Unsupported file type. Upload PDF or image.'
            });
        }

        const extractedText = await extractTextFromDocument(req.file.path, req.file.originalname, req.file.mimetype);

        return res.status(200).json({
            ok: true,
            stage: 'parse_document',
            ...report,
            characters_extracted: extractedText.length,
            extracted_preview: extractedText.slice(0, 1200)
        });
    } catch (error: any) {
        return res.status(502).json({
            ok: false,
            stage: 'parse_document',
            error: error?.message || 'Failed to parse document'
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const processClaim = async (req: Request, res: Response) => {
    let stage = 'initial';
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No PDF file uploaded" });
        }

        // Step 1: Extract Text
        stage = 'extract_text';
        console.log("Extracting text from document in backend...");
        const rawText = await extractTextFromDocument(req.file.path, req.file.originalname, req.file.mimetype);

        if (!rawText || rawText.trim().length === 0) {
            return res.status(400).json({ error: "Empty or unreadable PDF" });
        }

        // Step 2 & 3: Get Structured JSON from LLM
        stage = 'llm_extraction';
        console.log("Sending extracted text to LLM...");
        const llmJson = await extractStructuredDataWithLLM(rawText);

        // Step 4: Clean and Validate
        stage = 'clean_validate';
        console.log("Cleaning data...");
        const cleanData = cleanAndValidateData(llmJson);

        stage = 'build_instances';
        const mlPayload = buildFraudModelInstances(cleanData, llmJson);

        // Step 5: Save to MongoDB
        stage = 'save_mongodb';
        console.log("Saving to MongoDB...");
        const newClaim = new Claim(cleanData);
        await newClaim.save();

        // Step 6: Save to CSV (for ML Pipeline)
        stage = 'save_csv';
        console.log("Saving to CSV...");
        const csvPath = path.join(__dirname, '../../../processed_claim.csv');
        await convertToCSV(cleanData, csvPath);

        // Cleanup uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            message: "Claim processed successfully",
            data: newClaim,
            fraud_model_payload: mlPayload
        });

    } catch (error: any) {
        const message = error?.message || 'Internal server error';
        console.error(`Error processing claim at stage ${stage}:`, message);

        const isExternalFailure =
            message.includes('PDF extraction error') ||
            message.includes('Unsupported file type') ||
            message.includes('OpenRouter API error') ||
            message.includes('Gemini API error') ||
            message.includes('Uploaded file is not a valid PDF');

        res.status(isExternalFailure ? 502 : 500).json({
            error: message,
            stage
        });

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const processClaimForModel = async (req: Request, res: Response) => {
    let stage = 'initial';
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No document uploaded' });
        }

        stage = 'extract_text';
        const rawText = await extractTextFromDocument(req.file.path, req.file.originalname, req.file.mimetype);
        if (!rawText.trim()) {
            return res.status(400).json({ error: 'Empty or unreadable document', stage });
        }

        stage = 'llm_extraction';
        const llmJson = await extractStructuredDataWithLLM(rawText);

        stage = 'clean_validate';
        const cleanData = cleanAndValidateData(llmJson);

        stage = 'build_instances';
        const mlPayload = buildFraudModelInstances(cleanData, llmJson);

        stage = 'predict_fraud';
        const prediction = await predictFraud(mlPayload.instances[0]);
        const riskScore = Number((prediction.probability * 100).toFixed(2));

        return res.status(200).json({
            success: true,
            cleaned_data: cleanData,
            model_input: mlPayload.instances[0],
            fraud_result: {
                is_fraudulent: prediction.prediction === 'TRUE',
                prediction: prediction.prediction,
                risk_score: riskScore,
                probability: prediction.probability
            }
        });
    } catch (error: any) {
        return res.status(502).json({
            error: error?.message || 'Failed to process document for model payload',
            stage
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const getAllClaims = async (req: Request, res: Response) => {
    try {
        const claims = await Claim.find().sort({ processedAt: -1 });
        res.json({ success: true, count: claims.length, data: claims });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}
