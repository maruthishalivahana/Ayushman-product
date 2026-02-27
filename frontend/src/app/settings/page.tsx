"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";

export default function Settings() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
              Settings
            </h1>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Settings */}
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue="Dr. Rajesh Kumar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="rajesh.kumar@nha.gov.in"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Department</label>
                  <input
                    type="text"
                    defaultValue="Fraud Prevention & Investigation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure application behavior and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">Auto-refresh Data</label>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">Enable Notifications</label>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">Dark Mode</label>
                  <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Manage security and data privacy options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full">
                  View Activity Log
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Save Changes
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
