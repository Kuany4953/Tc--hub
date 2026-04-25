import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';
import {
  SearchIcon, ArrowRightIcon, BookOpenIcon, BuildingIcon,
  UsersIcon, SparklesIcon, WrenchIcon, CalendarIcon,
} from '../components/Icons';

const CATEGORIES = [
  { key: 'tutoring',     label: 'Tutoring',     Icon: BookOpenIcon, color: '#0a4129', bg: '#e6f1ea' },
  { key: 'office_hours', label: 'Office Hours', Icon: BuildingIcon, color: '#1a3f7a', bg: '#e7eef9' },
  { key: 'club',         label: 'Clubs',        Icon: UsersIcon,    color: '#5d1675', bg: '#f1e7f6' },
  { key: 'event',        label: 'Events',       Icon: CalendarIcon, color: '#7a3f0d', bg: '#fbeede' },
  { key: 'service',      label: 'Services',     Icon: WrenchIcon,   color: '#6a4f0d', bg: '#faf2d6' },
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
      <section style={{
        background: `
          radial-gradient(circle at 15% 0%, rgba(15,86,56,0.08), transparent 55%),
          radial-gradient(circle at 85% 100%, rgba(184,134,11,0.06), transparent 55%),
          var(--surface)
        `,
        borderBottom: '1px solid var(--border)',
        padding: '5.5rem 1.5rem 5rem',
      }}>
        <div className="page-container" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <div className="hero-mark" style={{ marginBottom: 28 }}>T</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: 600,
            padding: '5px 14px',
            borderRadius: 999,
            marginBottom: 22,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <SparklesIcon size={13} className="icon" />
            Trinity College — Hartford, CT
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6.5vw, 68px)',
            lineHeight: 1.05,
            marginBottom: 22,
            letterSpacing: '-0.025em',
            fontWeight: 700,
          }}>
            Trinity Hub
            <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.55em', marginTop: 14, letterSpacing: '-0.01em' }}>
              Every campus resource, in one place.
            </span>
          </h1>

          <p style={{
            fontSize: 17,
            color: 'var(--text-muted)',
            marginBottom: 38,
            lineHeight: 1.65,
            maxWidth: 560,
            margin: '0 auto 38px',
          }}>
            Find tutoring, office hours, clubs, events, and student services —
            contributed and rated by students like you.
          </p>

          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: 8,
            maxWidth: 560,
            margin: '0 auto',
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 14,
            padding: 6,
            boxShadow: '0 8px 24px -8px rgba(15, 25, 30, 0.12)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              flex: 1, paddingLeft: 14, color: 'var(--text-faint)',
            }}>
              <SearchIcon size={18} className="icon" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resources, e.g. math tutoring, pre-law..."
                style={{ border: 'none', boxShadow: 'none', padding: '12px 0', background: 'transparent', fontSize: 15 }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '11px 22px' }}>Search</button>
          </form>
        </div>
      </section>

      <div className="page-container" style={{ padding: '4rem 1.5rem 5rem' }}>
        {/* Categories */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
            <h2 style={{ fontSize: 26, fontWeight: 600 }}>Browse by category</h2>
            <span className="kbd-label">5 categories</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
          }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/resources?category=${cat.key}`}>
                <div className="card card-hover" style={{
                  padding: '20px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: cat.bg, color: cat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <cat.Icon size={22} className="icon" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{cat.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>Browse →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Resources */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <h2 style={{ fontSize: 26, fontWeight: 600 }}>Recently added</h2>
            <Link to="/resources" style={{
              fontSize: 14,
              color: 'var(--accent)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              View all <ArrowRightIcon size={14} className="icon" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {recent.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </section>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--text-faint)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text-muted)' }}>Trinity Hub</div>
          <div>Built for the Trinity College community</div>
        </div>
      </footer>
    </div>
  );
}
