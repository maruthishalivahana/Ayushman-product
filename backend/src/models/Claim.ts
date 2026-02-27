import mongoose, { Document, Schema } from 'mongoose';

export interface IClaim extends Document {
    Patient_ID: string | null;
    Provider_ID: string | null;
    Hospital_ID: string | null;
    Claim_Amount: number | null;
    Diagnosis_Code: string | null;
    Procedure_Code: string | null;
    Admission_Date: string | null;
    Discharge_Date: string | null;
    Length_of_Stay: number | null;
    Admission_Type: string | null;
    Deductible: number | null;
    CoPay: number | null;
    Insurance_Plan: string | null;
    Other_Fraud_Related_Fields: Record<string, unknown> | null;
    processedAt: Date;
}

const ClaimSchema: Schema = new Schema({
    Patient_ID: { type: String, default: null },
    Provider_ID: { type: String, default: null },
    Hospital_ID: { type: String, default: null },
    Claim_Amount: { type: Number, default: null },
    Diagnosis_Code: { type: String, default: null },
    Procedure_Code: { type: String, default: null },
    Admission_Date: { type: String, default: null },
    Discharge_Date: { type: String, default: null },
    Length_of_Stay: { type: Number, default: null },
    Admission_Type: { type: String, default: null },
    Deductible: { type: Number, default: null },
    CoPay: { type: Number, default: null },
    Insurance_Plan: { type: String, default: null },
    Other_Fraud_Related_Fields: { type: Schema.Types.Mixed, default: null },
    processedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IClaim>('Claim', ClaimSchema);
