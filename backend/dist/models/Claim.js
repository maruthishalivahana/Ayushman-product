"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ClaimSchema = new mongoose_1.Schema({
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
    Other_Fraud_Related_Fields: { type: mongoose_1.Schema.Types.Mixed, default: null },
    processedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Claim', ClaimSchema);
