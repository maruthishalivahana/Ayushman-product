'use client';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', color: '#d1d5db', padding: '3rem 0' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          {/* Column 1 - About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#f97316',
                borderRadius: '50%'
              }}></div>
              <div>
                <p style={{ fontWeight: '600', color: 'white', margin: '0 0 0.25rem 0' }}>
                  National Health Authority
                </p>
                <p style={{ fontSize: '0.75rem', margin: 0 }}>
                  Ministry of Health & Family Welfare
                </p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem', margin: 0 }}>
              The National Health Authority (NHA) is responsible for implementing India&apos;s flagship public health insurance scheme, PM-JAY.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1rem' }}>🔒</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1rem' }}>✉️</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1rem' }}>📋</a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'white', marginBottom: '1rem', margin: 0 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>PM-JAY Portal</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Anti-Fraud Guidelines</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Grievance Portal</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>NHA Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3 - Compliance */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'white', marginBottom: '1rem', margin: 0 }}>Compliance</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cyber Security</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Disclaimer</a></li>
              <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Data Privacy</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 style={{ fontWeight: '600', color: 'white', marginBottom: '1rem', margin: 0 }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📞</span>
                <span>14555 / 1800-111-565</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✉️</span>
                <span>helpdesk-nha@nic.in</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📍</span>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem' }}>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
            © 2024 National Health Authority. All Rights Reserved. Managed by National Informatics Centre (NIC).
          </p>
        </div>
      </div>
    </footer>
  );
}
