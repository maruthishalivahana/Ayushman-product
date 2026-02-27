import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NHA Fraud Intelligence System",
  description: "AI-Powered Healthcare Fraud Intelligence System for Ayushman Bharat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
