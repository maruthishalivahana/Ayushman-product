"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CaseDetails({ params }: { params: { id: string } }) {
    const caseId = params.id;
    
    const caseInfo = {
        id: caseId,
        riskLevel: "High",
        status: "Pending Review",
        createdDate: "2024-02-20",
        lastUpdated: "2024-02-28",
        assignedTo: "Dr. Rajesh Kumar",
        priority: "Critical",
        evidenceCount: 4,
        claimsAffected: 1982,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            A
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Ayushman</h1>
                    </Link>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Case Header */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Case #{caseId}</h1>
                    <p className="text-gray-600 text-lg mb-6">Healthcare Fraud Investigation Details</p>
                    <div className="flex gap-3 flex-wrap">
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-2">
                            🔍 Under Investigation
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
                            📋 Case Type: Anomaly Detection
                        </Badge>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Case Information */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Information</h2>
                        <div className="space-y-3">
                            {/* Case ID */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</p>
                                            <p className="text-lg font-bold text-gray-900 font-mono mt-1">{caseInfo.id}</p>
                                        </div>
                                        <span className="text-2xl">📋</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Risk Level */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                                                <p className="text-lg font-bold text-red-600">{caseInfo.riskLevel}</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl">🔴</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Priority */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</p>
                                            <Badge className="mt-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm font-bold">
                                                ⚡ {caseInfo.priority}
                                            </Badge>
                                        </div>
                                        <span className="text-2xl">🚨</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                                            <p className="text-lg font-bold text-yellow-600 mt-2">⏳ {caseInfo.status}</p>
                                        </div>
                                        <span className="text-2xl">📌</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assigned To */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-2">{caseInfo.assignedTo}</p>
                                        </div>
                                        <span className="text-2xl">👤</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="pt-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-2">{caseInfo.createdDate}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="pt-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-2">{caseInfo.lastUpdated}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Evidence & Claims */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card className="border-0 shadow-sm bg-blue-50">
                                    <CardContent className="pt-4">
                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Evidence</p>
                                        <p className="text-2xl font-bold text-blue-900 mt-2">{caseInfo.evidenceCount}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm bg-orange-50">
                                    <CardContent className="pt-4">
                                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Claims</p>
                                        <p className="text-2xl font-bold text-orange-900 mt-2">{caseInfo.claimsAffected}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detected Anomalies */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detected Anomalies</h2>
                        <div className="space-y-4">
                            <Card className="border-l-4 border-l-red-600 shadow-sm">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Unusual Claim Pattern</h3>
                                    <p className="text-gray-600 text-sm">Multiple high-value claims in short timeframe</p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-500 shadow-sm">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Provider Irregularity</h3>
                                    <p className="text-gray-600 text-sm">Claims frequency exceeds statistical norm</p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-yellow-500 shadow-sm">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Service Code Mismatch</h3>
                                    <p className="text-gray-600 text-sm">Inconsistency in documented vs billed services</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* AI Analysis Report */}
                <Card className="bg-blue-50 border-0 shadow-sm mb-8">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-indigo-900">AI Analysis Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            The predictive analysis model has flagged this case with a <span className="font-semibold text-indigo-700">93% confidence level</span> for potential fraudulent activity.
                        </p>
                        <div className="border-t border-blue-200 pt-4">
                            <p className="text-gray-700 text-sm">
                                <span className="font-semibold text-gray-900">Recommendation:</span> Further investigation recommended. Cross-reference with beneficiary records and provider documentation.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-start">
                    <Link href={`/reports/${caseId}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 w-full sm:w-auto">
                            Review Full Report
                        </Button>
                    </Link>
                    <Button variant="outline" className="text-gray-700 hover:bg-gray-100 font-semibold px-6 py-2.5">
                        Add Note
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 font-semibold px-6 py-2.5 border-red-200">
                        Flag for Action
                    </Button>
                </div>
            </main>
        </div>
    );
}