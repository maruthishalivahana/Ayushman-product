'use client';

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(to bottom right, #dbeafe, #f0f9ff)',
      padding: '5rem 0'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              width: 'fit-content'
            }}>
              <span style={{ fontSize: '1rem' }}>🔒</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>OFFICIAL GOVERNMENT PORTAL</span>
            </div>

            {/* Main Title */}
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#111827', lineHeight: '1.2', margin: 0 }}>
              AI-Powered
              <br />
              <span style={{ color: '#2563eb' }}>Healthcare Fraud</span>
              <br />
              <span style={{ color: '#2563eb' }}>Intelligence</span> System
            </h1>

            {/* Description */}
            <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: '1.6', margin: 0 }}>
              Leveraging advanced machine learning to protect public healthcare funds. Real-time monitoring, anomaly detection, and investigative intelligence for Ayushman Bharat.
            </p>

            {/* Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '2rem' }}>
              {/* Card 1 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #2563eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    📊
                  </div>
                  <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>Predictive Analysis</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                  Detecting frauds before they escalate
                </p>
              </div>

              {/* Card 2 */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #2563eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    🔍
                  </div>
                  <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>Real-Time Audits</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                  Continuous claim verification system
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div style={{ paddingTop: '1rem' }}>
              <button style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
                Get Started →
              </button>
            </div>
          </div>

          {/* Right Side - Decorative */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, #bfdbfe, #dbeafe)',
              borderRadius: '1.5rem',
              opacity: 0.5
            }}></div>
            <div style={{
              position: 'relative',
              height: '24rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏥</div>
                <p style={{ color: '#4b5563', fontWeight: '600', margin: 0 }}>
                  Protecting India&apos;s Healthcare
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
