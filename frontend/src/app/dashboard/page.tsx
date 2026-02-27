"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function Dashboard() {
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
                  <Button variant="outline">Browse Files</Button>
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
