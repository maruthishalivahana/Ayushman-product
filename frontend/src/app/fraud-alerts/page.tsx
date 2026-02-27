"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";

export default function FraudAlerts() {
  const alerts = [
    {
      id: 1,
      title: "Suspicious Claim Pattern",
      description: "Multiple high-value claims from the same provider detected",
      severity: "high",
      caseId: "PRV-89201",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Provider Anomaly",
      description: "Unusual billing patterns compared to historical average",
      severity: "medium",
      caseId: "PRV-89202",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      title: "Duplicate Claim Alert",
      description: "Potential duplicate claims identified within 24-hour window",
      severity: "high",
      caseId: "PRV-89203",
      timestamp: "1 day ago",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Fraud Alerts
              </h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">245</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>High Priority</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">67</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Review</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">42</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-bold text-gray-900">{alert.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{alert.description}</p>
                            <p className="text-gray-500 text-xs mt-2">{alert.timestamp}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Link href={`/${alert.caseId}`}>
                          <Button variant="outline" size="sm">
                            Investigate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
