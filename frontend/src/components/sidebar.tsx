"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Building2, AlertTriangle, FileText, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "Claims Analysis", href: "/claims-analysis" },
    { icon: Building2, label: "Hospital Risk", href: "/hospital" },
    { icon: AlertTriangle, label: "Fraud Alerts", href: "/fraud-alerts" },
    { icon: FileText, label: "Reports", href: "/reports/PRV-89201" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => pathname.startsWith(href.split('/').slice(0, 2).join('/'));

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-700 text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static lg:translate-x-0 w-64 h-screen bg-indigo-900 text-white flex flex-col transition-transform duration-200 z-40 lg:z-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-indigo-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-900 font-bold text-lg">F</span>
            </div>
            <div>
              <p className="font-bold text-sm">FRAUD INTELLIGENCE</p>
              <p className="text-xs text-indigo-300">Healthcare Fraud AI</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const active = isActive(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-indigo-800 space-y-3">
          <div className="px-4 py-3 bg-indigo-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                DK
              </div>
              <div>
                <p className="text-sm font-semibold">Dr. Rajesh Kumar</p>
                <p className="text-xs text-indigo-300">System Administrator</p>
              </div>
            </div>
          </div>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
