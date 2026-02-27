"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, Edit2, Pen, Hand, Search, Share } from "lucide-react";
import Link from "next/link";

type FraudAnalysisResult = {
  success: boolean;
  cleaned_data: {
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
  };
  fraud_result: {
    is_fraudulent: boolean;
    prediction: "TRUE" | "FALSE";
    risk_score: number;
    probability: number;
  };
};

export default function RiskAssessmentReport({ params }: { params: { id: string } }) {
  const resourceId = params.id;
  const [latestResult, setLatestResult] = useState<FraudAnalysisResult | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("latestFraudAnalysis");
      if (!raw) return;
      const parsed = JSON.parse(raw) as FraudAnalysisResult;
      if (parsed?.fraud_result) {
        setLatestResult(parsed);
      }
    } catch {
      setLatestResult(null);
    }
  }, []);
  
  const hospitalData = {
    name: "City General Medical Center",
    providerId: "PRV-89201",
    location: "New Delhi, India",
    accreditation: "NABH Gold Standard",
    reportDate: "October 24, 2023 | 14:22 IST",
    hospitalId: "NHA-8829-X",
    documentId: "2023-PPT-NHA-08829",
  };

  const riskScore = 88;
  const riskMetrics = [
    { label: "BILLING ANOMALIES", value: "827/900", color: "bg-red-600" },
    { label: "CLAIM VELOCITY", value: "74/900", color: "bg-orange-500" },
    { label: "PROVIDER CREDIBILITY", value: "55/500", color: "bg-yellow-500" },
  ];

  const evidences = [
    {
      icon: "🔴",
      title: "Duplicate claims identified for 14 unique beneficiaries within the same 24-hour cycle.",
      severity: "critical",
    },
    {
      icon: "🔴",
      title: "Inconsistent billing for high-value surgical equipment that exceeds the hospital's registered bed capacity.",
      severity: "critical",
    },
    {
      icon: "⚠️",
      title: "Sudden 400% surge in outpatient claims without any corresponding public health event or season-related surge.",
      severity: "warning",
    },
    {
      icon: "⚠️",
      title: "Tele-consultation logs show 250 calls handled by a single physician in a single 8-hour window.",
      severity: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-40 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm bg-blue-600">
              NHA
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">National Health Authority</p>
              <p className="text-xs text-gray-500">GOVERNMENT OF INDIA</p>
            </div>
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 text-sm">
              <Share2 className="w-4 h-4" />
              Share with NHA
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-sm">
              <Download className="w-4 h-4" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Report Title Section */}
        <div className="mb-12">
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 mb-4 text-xs font-bold">
            🚨 HIGH RISK FLAGGED
          </Badge>
          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Risk Assessment Report</h1>
              <p className="text-sm text-gray-600">Official verification for Hospital ID: {hospitalData.hospitalId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 font-semibold">REPORT GENERATED ON</p>
              <p className="text-sm font-semibold text-gray-900">{hospitalData.reportDate}</p>
            </div>
          </div>
        </div>

        {/* Hospital Details */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-bold">
                ☑
              </div>
              <CardTitle className="text-lg">Hospital Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Hospital Name</p>
                <p className="text-sm font-semibold text-gray-900">{hospitalData.name}</p>
                <p className="text-xs text-gray-600 mt-3">Provider ID</p>
                <p className="text-sm font-semibold text-gray-900">{hospitalData.providerId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Location</p>
                <p className="text-sm font-semibold text-gray-900">{hospitalData.location}</p>
                <p className="text-xs text-gray-600 mt-3">Accreditation</p>
                <p className="text-sm font-semibold text-gray-900">{hospitalData.accreditation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {latestResult && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-bold">
                  ☑
                </div>
                <CardTitle className="text-lg">Latest Upload Result</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Prediction</p>
                  <p className={`font-bold ${latestResult.fraud_result.is_fraudulent ? "text-red-600" : "text-green-600"}`}>
                    {latestResult.fraud_result.prediction}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Risk Score</p>
                  <p className="font-bold text-gray-900">{latestResult.fraud_result.risk_score}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Patient ID</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Patient_ID || "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Claim Amount</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Claim_Amount ?? "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Provider ID</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Provider_ID || "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Hospital ID</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Hospital_ID || "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Diagnosis</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Diagnosis_Code || "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">Procedure</p>
                  <p className="font-semibold text-gray-900">{latestResult.cleaned_data.Procedure_Code || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Score Summary */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-bold">
                ☑
              </div>
              <CardTitle className="text-lg">Risk Score Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-start gap-12">
              {/* Risk Score Circle */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full border-8 border-red-500 flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-red-600">{riskScore}</p>
                    <p className="text-xs text-gray-600 font-semibold mt-1">CRITICAL</p>
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="flex-grow space-y-6 w-full">
                {riskMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-700">{metric.label}</label>
                      <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${metric.color} h-2.5 rounded-full`} style={{ width: "90%" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Explanation */}
        <Card className="mb-8 bg-blue-50 border border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-bold">
                ≡
              </div>
              <CardTitle className="text-lg text-indigo-900">Model Explanation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "The Predictive Integrity Model flagged this provider due to a statistically significant deviation in claim submission patterns. Over the last 30 days, 85% of claims were filed between 1 AM and 4 AM, which correlates with historical fraud patterns of automated claim generation. Additionally, the 'Diagnosis-Treatment' ratio for cardiology exceeds the regional mean by 4.3 standard deviations."
            </p>
          </CardContent>
        </Card>

        {/* Evidence Summary */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-bold">
                ☑
              </div>
              <CardTitle className="text-lg">Evidence Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {evidences.map((evidence, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">{evidence.icon}</span>
                <p className="text-sm text-gray-700">{evidence.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Action */}
        <Card className="bg-gray-900 text-white border-0 shadow-sm mb-12">
          <CardHeader className="pb-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <CardTitle className="text-lg text-white">Recommended Action</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-300 mb-6">
              Based on the risk profile and historical integrity data, the following protocol is mandatory:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6">
                  IMMEDIATE SUSPENSION
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-800 text-white font-bold text-sm px-6">
                  ON-SITE AUDIT
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-6">
                  LEGAL INQUIRY
                </Button>
              </div>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8">
                Initiate Enforcement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-600 space-y-2">
          <p>CONFIDENTIAL - NHA INTERNAL USE ONLY</p>
          <p className="text-right print:text-center">DOCUMENT REF: 2023-PPT-NHA-{hospitalData.documentId}</p>
        </div>
      </main>

      {/* Bottom Right Floating Toolbar */}
      <div className="fixed bottom-8 right-8 flex gap-2 bg-gray-900 rounded-full p-3 shadow-lg">
        <button onClick={() => alert("Edit mode enabled")} title="Edit" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition">
          <Edit2 className="w-5 h-5" />
        </button>
        <button onClick={() => alert("Annotation mode")} title="Annotate" className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition">
          <Pen className="w-5 h-5" />
        </button>
        <button onClick={() => alert("Sign document")} title="Sign" className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition">
          <Hand className="w-5 h-5" />
        </button>
        <button onClick={() => alert("Search enabled")} title="Search" className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition">
          <Search className="w-5 h-5" />
        </button>
        <button onClick={() => alert("Share dialog opened")} title="Share" className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition">
          <Share className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
