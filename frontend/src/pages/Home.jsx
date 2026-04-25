import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';

const CATEGORIES = [
  { key: 'tutoring', label: 'Tutoring', icon: '📚' },
  { key: 'office_hours', label: 'Office Hours', icon: '🏫' },
  { key: 'club', label: 'Clubs', icon: '🤝' },
  { key: 'event', label: 'Events', icon: '🎉' },
  { key: 'service', label: 'Services', icon: '🛠️' },
];

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/resources?limit=6').then(res => setRecent(res.data.resources));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/resources?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '4rem 1.5rem 3rem',
      }}>
        <div className="page-container" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'var(--accent-light)',
            color: 'var(--accent)', fontSize: 12, fontFamily: 'sans-serif',
            fontWeight: 500, padding: '4px 14px', borderRadius: 999, marginBottom: 20,
          }}>
            Trinity College — Hartford, CT
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: 1.25, marginBottom: 16 }}>
            Every campus resource,<br />in one place
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
            Find tutoring, office hours, clubs, events, and student services
            at Trinity College — contributed and rated by students like you.
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources, e.g. math tutoring, pre-law..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
          </form>
        </div>
      </div>

      <div className="page-container" style={{ padding: '3rem 1.5rem' }}>
        {/* Categories */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Browse by category</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/resources?category=${cat.key}`}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '14px 22px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'sans-serif', fontSize: 14,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
                >
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Resources */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>Recently added</h2>
            <Link to="/resources" style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'sans-serif' }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {recent.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
