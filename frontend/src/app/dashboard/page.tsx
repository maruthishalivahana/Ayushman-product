"use client";

import { ChangeEvent, useRef, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar";

type ProcessModelResponse = {
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
  model_input: {
    Claim_Amount: number;
    Patient_Age: number;
    Number_of_Procedures: number;
    Length_of_Stay_Days: number;
    Deductible_Amount: number;
    CoPay_Amount: number;
    Provider_Patient_Distance_Miles: number;
    Claim_Submitted_Late: number;
  };
  fraud_result: {
    is_fraudulent: boolean;
    prediction: "TRUE" | "FALSE";
    risk_score: number;
    probability: number;
  };
  error?: string;
};

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessModelResponse | null>(null);

  // Metrics data
  const metricsData = [
    { label: "TOTAL CLAIMS ANALYZED", value: "1.2M", change: "+12%", positive: true },
    { label: "TOTAL HOSPITALS", value: "45k", change: "-2%", positive: false },
    { label: "FRAUD ALERTS", value: "245", change: "+8%", positive: false },
    { label: "AVG. RISK SCORE", value: "64%", change: "Stable", positive: false },
    { label: "HIGH RISK HOSPITALS", value: "3.2%", change: "-0.5%", positive: true },
  ];

  // Chart data - Claims by Procedure Type
  const claimsByProcedure = [
    { name: "Dialysis", value: 320 },
    { name: "Oncology", value: 240 },
    { name: "Cardiac", value: 180 },
    { name: "Ortho", value: 110 },
    { name: "Gynae", value: 85 },
  ];

  // Chart data - Claim Spike Trends
  const claimTrendData = [
    { month: "Jan", claims: 280, alerts: 45 },
    { month: "Feb", claims: 320, alerts: 52 },
    { month: "Mar", claims: 380, alerts: 48 },
    { month: "Apr", claims: 420, alerts: 65 },
    { month: "May", claims: 480, alerts: 72 },
    { month: "Jun", claims: 520, alerts: 58 },
  ];

  // Risk Distribution data
  const riskDistribution = [
    { name: "Safe (Low Risk)", value: 50, color: "#10b981" },
    { name: "Under Monitoring", value: 35, color: "#f59e0b" },
    { name: "High Alert", value: 15, color: "#ef4444" },
  ];

  // Recent uploads
  const recentUploads = [
    { name: "Claim_UP_882.pdf", date: "2 days ago", status: "VERIFIED" },
    { name: "Audit_Report_U2.jpg", date: "3 days ago", status: "ANOMALY DETECTED" },
    { name: "Rec_Bihar_302.pdf", date: "5 days ago", status: "VERIFIED" },
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a PDF or image file first.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await fetch("/api/claims/process-model", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ProcessModelResponse;

      if (!response.ok) {
        setUploadError(data?.error || "Upload failed while processing claim.");
        return;
      }

      setResult(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("latestFraudAnalysis", JSON.stringify(data));
      }
    } catch (error: any) {
      setUploadError(error?.message || "Unexpected upload error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search claims or hospitals..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Claims</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metricsData.map((metric, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{metric.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <Badge variant={metric.positive ? "secondary" : "outline"} className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Claims by Procedure Type */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Claims by Procedure Type</CardTitle>
                <Button variant="outline" size="sm" className="text-indigo-600">
                  View Detail
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={claimsByProcedure}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 text-sm w-full">
                  {riskDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claim Spike Trends */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Claim Spike Trends (6 Months)</CardTitle>
              <CardDescription>Historical trends with alert patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={claimTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="claims"
                    stroke="#4f46e5"
                    dot={{ fill: "#4f46e5" }}
                    name="Claims"
                  />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    dot={{ fill: "#ef4444" }}
                    name="Alerts"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-600 mt-4">
                * Significant alert spike detected in April due to reported audits in Uttar Pradesh.
              </p>
            </CardContent>
          </Card>

          {/* Upload and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Claim Documents</CardTitle>
                <CardDescription className="text-xs">SUPPORTED: PDF, JPG, PNG</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">Drag & Drop files here</p>
                  <p className="text-sm text-gray-600 mb-4">or click to browse from your computer</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? "Processing..." : "Analyze Claim"}
                    </Button>
                  </div>
                  {selectedFile && <p className="text-xs text-gray-600 mt-3">Selected: {selectedFile.name}</p>}
                  {uploadError && <p className="text-sm text-red-600 mt-3">{uploadError}</p>}
                </div>

                {/* Recent Uploads */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-3">RECENT UPLOADS</h3>
                  {recentUploads.map((upload, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{upload.name}</p>
                        <p className="text-xs text-gray-600">{upload.date}</p>
                      </div>
                      <Badge variant={upload.status === "VERIFIED" ? "secondary" : "destructive"}>
                        {upload.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {result?.fraud_result && (
                  <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">LATEST ANALYSIS RESULT</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Fraud Flag</p>
                        <p className={`font-bold ${result.fraud_result.is_fraudulent ? "text-red-600" : "text-green-600"}`}>
                          {result.fraud_result.prediction}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Risk Score</p>
                        <p className="font-bold text-gray-900">{result.fraud_result.risk_score}%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Patient ID</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Patient_ID || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Provider ID</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Provider_ID || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Hospital ID</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Hospital_ID || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Claim Amount</p>
                        <p className="font-semibold text-gray-900">
                          {typeof result.cleaned_data?.Claim_Amount === "number"
                            ? result.cleaned_data.Claim_Amount.toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Diagnosis Code</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Diagnosis_Code || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Procedure Code</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Procedure_Code || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Admission Date</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Admission_Date || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Discharge Date</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Discharge_Date || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Length of Stay</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Length_of_Stay ?? "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Admission Type</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Admission_Type || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">Deductible</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.Deductible ?? "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">CoPay</p>
                        <p className="font-semibold text-gray-900">{result.cleaned_data?.CoPay ?? "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md sm:col-span-2">
                        <p className="text-xs text-gray-600 mb-1">Model Features Used</p>
                        <p className="font-semibold text-gray-900">
                          Claim_Amount: {result.model_input.Claim_Amount}, Patient_Age: {result.model_input.Patient_Age}, Number_of_Procedures: {result.model_input.Number_of_Procedures}, Length_of_Stay_Days: {result.model_input.Length_of_Stay_Days}, Deductible_Amount: {result.model_input.Deductible_Amount}, CoPay_Amount: {result.model_input.CoPay_Amount}, Provider_Patient_Distance_Miles: {result.model_input.Provider_Patient_Distance_Miles}, Claim_Submitted_Late: {result.model_input.Claim_Submitted_Late}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/fraud-alerts">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    View High Risk Cases
                  </Button>
                </a>
                <a href="/reports/PRV-89201">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Fraud Report
                  </Button>
                </a>
                <a href="/hospital">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Trend Analysis
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
