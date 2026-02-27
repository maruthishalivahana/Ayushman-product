import Image from 'next/image';
import image from '../../public/AyushmanBharatimage.jpg';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Ayushman</h1>
              <p className="text-xs text-gray-600">Healthcare Intelligence</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-700 transition">Dashboard</Link>
            <Link href="/reports/PRV-89201" className="text-gray-700 hover:text-indigo-700 transition">Reports</Link>
            <a href="#policy" className="text-gray-700 hover:text-indigo-700 transition">Policy</a>
            <a href="#support" className="text-gray-700 hover:text-indigo-700 transition">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div>
              <div className="inline-block bg-blue-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                🎯 GOVERNMENT PORTAL
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                AI-Powered Healthcare <span className="text-indigo-700">Intelligence</span> System
              </h1>
              <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                Leveraging advanced machine learning to protect public healthcare funds. Real-time monitoring, anomaly detection, and investigative intelligence for Ayushman.
              </p>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-gray-900 mb-2">Predictive Analysis</h3>
                  <p className="text-gray-600 text-sm">Detecting fraud before they occur</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-gray-900 mb-2">Real-time Audits</h3>
                  <p className="text-gray-600 text-sm">Instant fraud verification system</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/dashboard">
                <button className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-800 transition shadow-lg">
                  Go to Dashboard →
                </button>
              </Link>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Image src={image} alt="Ayushman Bharat" className="w-auto h-auto object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Healthcare Security?</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare providers protecting public funds with AI-powered fraud detection
            </p>
            <Link href="/dashboard">
              <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">
                Access Admin Portal
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Ayushman</h3>
              <p className="text-gray-400">
                Empowering healthcare systems with AI-driven fraud detection and prevention.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#policy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#security" className="hover:text-white transition">Security</a></li>
                <li><a href="#docs" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <p className="text-gray-400">📧 support@ayushman.gov</p>
              <p className="text-gray-400">📍 New Delhi, India</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Ayushman Healthcare Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
