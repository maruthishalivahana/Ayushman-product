# Ayushman Product - Healthcare Fraud Detection

End-to-end system for healthcare claim fraud analysis:

- **Frontend (Next.js)** uploads claim documents (PDF/image)
- **Backend (Express + TypeScript)** extracts and cleans claim data
- **ML module (Python + Scikit-learn + XGBoost)** predicts fraud (`TRUE/FALSE`) and risk score

---

## Project Structure

```text
Ayushman-product/
├─ backend/     # Express API (document parsing, LLM cleaning, ML bridge)
├─ frontend/    # Next.js UI + API proxy route
└─ machine/     # Model training + prediction scripts
```

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind, Recharts
- **Backend:** Node.js, Express, TypeScript, Multer, MongoDB (Mongoose), pdf-parse, tesseract.js
- **ML:** Python 3.12, pandas, scikit-learn, xgboost, joblib

---

## Data Flow

1. User uploads PDF/JPG/PNG from Dashboard.
2. Frontend sends file to `POST /api/claims/process-model` (Next.js API route).
3. Frontend API route proxies to backend `POST /api/claims/process-model`.
4. Backend:
   - validates file signature
   - extracts text (PDF/OCR)
   - calls LLM for structured cleaning
   - builds ML features
   - calls Python predictor
5. Backend returns:
   - cleaned claim fields
   - model input features
   - fraud prediction + probability + risk score
6. Frontend displays result in Dashboard and Reports page.

---

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+ (tested with 3.12)
- MongoDB running locally (`mongodb://localhost:27017`)

---

## Environment Variables

### Backend (`backend/.env`)

Create from `backend/.env.example`:

```env
PORT=5000
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
OPENROUTER_FALLBACK_MODEL=google/gemini-2.0-flash-001
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
MAX_PROMPT_CHARS=50000
MONGO_URI=mongodb://localhost:27017/healthcare_claims
PYTHON_BIN=python
ML_PREDICT_SCRIPT_PATH=../machine/predict_api.py
```

### Frontend (`frontend/.env.local`)

```env
BACKEND_API_BASE_URL=http://localhost:5000
```

---

## Installation

### 1) Backend

```bash
cd backend
npm install
```

### 2) Frontend

```bash
cd frontend
npm install
```

### 3) Python ML dependencies

```bash
cd machine
python -m pip install -r requirements.txt
```

---

## Run the Project

### Start Backend (port 5000)

```bash
cd backend
npm start
```

> `npm start` runs `prestart` build automatically.

### Start Frontend (port 3000)

```bash
cd frontend
npm run dev
```

Open: `http://localhost:3000/dashboard`

---

## API Endpoints

Base backend URL: `http://localhost:5000`

- `POST /api/claims/process` - full processing + DB + CSV
- `POST /api/claims/process-model` - processing + fraud prediction response
- `POST /api/claims/validate-pdf` - validate uploaded file
- `POST /api/claims/validate-and-parse` - validation + extracted text preview
- `GET /api/claims` - list saved claims

### Process-model request

- Content type: `multipart/form-data`
- File field name: `pdf`
- Supported: PDF, JPG, JPEG, PNG, BMP, TIFF, WEBP

### Process-model response (shape)

```json
{
  "success": true,
  "cleaned_data": { "Patient_ID": "...", "Claim_Amount": 45000 },
  "model_input": {
    "Claim_Amount": 45000,
    "Patient_Age": 45,
    "Number_of_Procedures": 2,
    "Length_of_Stay_Days": 5,
    "Deductible_Amount": 500,
    "CoPay_Amount": 100,
    "Provider_Patient_Distance_Miles": 12.5,
    "Claim_Submitted_Late": 0
  },
  "fraud_result": {
    "is_fraudulent": false,
    "prediction": "FALSE",
    "risk_score": 4.82,
    "probability": 0.0482
  }
}
```

---

## ML Module

### Train model

```bash
cd machine
python fraud_detection.py
```

Outputs:

- `fraud_model.pkl` (best model auto-selected)
- Console metrics: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix
- Feature importance report

### Prediction bridge script

- `machine/predict_api.py` reads JSON from stdin and returns:

```json
{ "prediction": "TRUE|FALSE", "probability": 0.0 }
```

---

## Frontend Integration Notes

- Upload UI is on Dashboard page.
- Latest analysis result is displayed on:
  - Dashboard upload section
  - Report page (`/reports/[id]`) from stored latest analysis payload

---

## Troubleshooting

### 1) `Cannot POST /api/claims/process-model`

- Ensure you call frontend proxy on **3000** OR backend directly on **5000**.
- Frontend route: `http://localhost:3000/api/claims/process-model`
- Backend route: `http://localhost:5000/api/claims/process-model`

### 2) `EADDRINUSE: address already in use :::5000`

Another process is already using port 5000.

Windows:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### 3) Next.js lock error (`.next/dev/lock`)

- Stop all running `next dev` terminals
- Delete lock file and restart frontend

### 4) `Request must be multipart/form-data`

Send file upload as `form-data` with key exactly: `pdf`.

### 5) Python model not found / cannot run

- Train model first (`python fraud_detection.py`)
- Verify `PYTHON_BIN` and `ML_PREDICT_SCRIPT_PATH` in backend `.env`

---

## Current Status

- Frontend build: ✅
- Backend build: ✅
- Upload route wiring (frontend -> backend): ✅
- ML scoring integration: ✅
- Report page integration: ✅

---

## Security Note

If any real API keys are present in local `.env`, rotate them and keep secrets out of source control.
