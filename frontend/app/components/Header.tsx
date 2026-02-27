'use client';

export default function Header() {
  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🛡️
            </div>
            <div>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                NHA Fraud Intelligence
              </p>
              <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: 0 }}>
                NATIONAL HEALTH AUTHORITY
              </p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Reports</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Policy</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Support</a>
          </nav>
          <button style={{ fontSize: '1.25rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
