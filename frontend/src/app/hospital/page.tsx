"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function HospitalDetails() {
  const hospitalData = {
    name: "City General Medical Center",
    location: "1200 Healthcare Way, Central City, NY 10001",
    district: "Metropolitan District",
    code: "HSP-092634",
    riskScore: 92,
    riskLevel: "HIGH RISK",
    riskTrend: "+18%",
    totalClaims: 14208,
    avgClaimValue: 3840,
    detectedOutliers: 1982,
    potentialRecovery: 1240000,
  };

  const surgeryData = [
    { name: "CARDIAC SURGERY", target: 452, percentage: 85, avg: "280% VS AVG" },
    { name: "ORTHOPEDICS", target: 218, percentage: 50, avg: "112% VS AVG" },
    { name: "NEUROLOGY", target: 156, percentage: 35, avg: "95% VS AVG" },
  ];

  const suspiciousClaims = [
    {
      claimId: "#CLM-883921",
      patientId: "P-1120",
      procedureCode: "CPT 33633",
      value: "$24,500",
      flag: "Up-coding",
      variant: "destructive",
    },
    {
      claimId: "#CLM-883945",
      patientId: "P-4491",
      procedureCode: "CPT 27139",
      value: "$18,200",
      flag: "Duplicate",
      variant: "secondary",
    },
    {
      claimId: "#CLM-884012",
      patientId: "P-5022",
      procedureCode: "CPT 53214",
      value: "$310",
      flag: "Unbundling",
      variant: "outline",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Ayushman</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-xl">🔔</button>
            <Link href="/dashboard">
              <Button className="bg-indigo-700 hover:bg-indigo-800">Admin Portal</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <p className="text-xs sm:text-sm text-gray-600">
            <Link href="/dashboard" className="text-indigo-700 hover:text-indigo-900 transition-colors">
              Institutions
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-indigo-700 font-semibold">Hospital Detail</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hospital Header Card */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Hospital Image */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl">🏥</span>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center sm:text-left">
                  {hospitalData.name}
                </h1>
                <div className="space-y-2 text-gray-600 mb-4 text-center sm:text-left">
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <span>🆔</span> {hospitalData.code} | {hospitalData.district}
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <span>📍</span> {hospitalData.location}
                  </p>
                </div>

                {/* Risk Score */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">RISK SCORE</p>
                    <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                      <span className="text-4xl sm:text-5xl font-bold text-red-600">{hospitalData.riskScore}</span>
                      <span className="text-gray-600 text-base sm:text-lg">/100</span>
                    </div>
                  </div>
                  <div className="flex-grow w-full sm:w-auto">
                    <Progress value={hospitalData.riskScore} className="h-3" />
                  </div>
                  <div className="text-center">
                    <Badge variant="destructive" className="px-3 py-1 text-xs sm:text-sm">
                      🔴 {hospitalData.riskLevel}
                    </Badge>
                    <p className="text-red-600 font-bold text-xs sm:text-sm mt-1">{hospitalData.riskTrend}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Audit Intelligence */}
        <Card className="border-l-4 border-l-indigo-700 mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center text-white font-bold flex-shrink-0">
                🤖
              </div>
              <CardTitle className="text-lg">AI Audit Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm sm:text-base text-gray-700">
            <p>
              <span className="text-red-600 font-bold">280% higher cardiac surgery claims</span> than district average. 
              Statistical pattern analysis suggests possible <span className="font-bold">up-coding</span> and systematic 
              unbundling of services across 14% of submitted claims in Q3.
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">Total Claims (C3)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900">
                {hospitalData.totalClaims.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">Average Claim Value</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900">
                ${hospitalData.avgClaimValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">Detected Outliers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-4xl font-bold text-red-600">
                {hospitalData.detectedOutliers.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">Potential Recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">
                ${(hospitalData.potentialRecovery / 1000000).toFixed(2)}M
              </p>
            </CardContent>
          </Card>
        </div>

        {/* District Comparison Chart */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl">District Comparison: Surgery Volume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {surgeryData.map((surgery, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-sm sm:text-base text-gray-900">{surgery.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{surgery.avg}</p>
                </div>
                <Progress value={surgery.percentage} className="h-3" />
                <p className="text-right text-xs sm:text-sm text-gray-600 mt-1">{surgery.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Suspicious Claims */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-2xl">Recent Suspicious Claim Samples</CardTitle>
            <Button variant="outline" className="text-indigo-700 hover:text-indigo-900 text-xs sm:text-sm">
              Export Full List →
            </Button>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {suspiciousClaims.map((claim, idx) => (
                <Card key={idx} className="border">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Claim ID:</span>
                        <span className="font-mono">{claim.claimId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Patient ID:</span>
                        <span>{claim.patientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Code:</span>
                        <span>{claim.procedureCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Value:</span>
                        <span className="font-bold">{claim.value}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant={claim.variant}>{claim.flag}</Badge>
                        <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-900">
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-gray-300">
                  <tr className="text-left text-gray-700 font-bold">
                    <th className="pb-3 px-2">CLAIM ID</th>
                    <th className="pb-3 px-2">PATIENT ID</th>
                    <th className="pb-3 px-2">PROCEDURE CODE</th>
                    <th className="pb-3 px-2">VALUE</th>
                    <th className="pb-3 px-2">FLAG REASON</th>
                    <th className="pb-3 px-2">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {suspiciousClaims.map((claim, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-2 font-mono text-gray-900">{claim.claimId}</td>
                      <td className="py-4 px-2 text-gray-900">{claim.patientId}</td>
                      <td className="py-4 px-2 text-gray-900">{claim.procedureCode}</td>
                      <td className="py-4 px-2 font-bold text-gray-900">{claim.value}</td>
                      <td className="py-4 px-2">
                        <Badge variant={claim.variant}>{claim.flag}</Badge>
                      </td>
                      <td className="py-4 px-2">
                        <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-900">
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-xs sm:text-sm py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <p>Secure HIPAA Compliant Audit Environment</p>
          </div>
          <p className="text-gray-400">© 2026 Ayushman. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
