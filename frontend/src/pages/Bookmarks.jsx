import { useState, useEffect } from 'react';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';
import { BookmarkIcon } from '../components/Icons';

export function Bookmarks() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks').then(res => setResources(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>Saved resources</h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
          {resources.length} saved resource{resources.length !== 1 ? 's' : ''}
        </p>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-faint)' }}>Loading…</div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--bg-2)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-faint)', marginBottom: 16,
          }}>
            <BookmarkIcon size={26} className="icon" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No saved resources yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Use the <strong>Save</strong> button on any resource to add it here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {resources.map(r => r && <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}

export function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="page-container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 24, letterSpacing: '-0.02em' }}>Admin dashboard</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
          {[['Total users', stats.userCount], ['Total resources', stats.resourceCount]].map(([label, val]) => (
            <div key={label} className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <div className="kbd-label" style={{ marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--serif)', letterSpacing: '-0.02em' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 22, borderBottom: '1px solid var(--border)' }}>
        {['stats', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 16px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
            color: tab === t ? 'var(--text)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Major', 'Year', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.major || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.year || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 600,
                      background: u.role === 'admin' ? 'var(--accent-light)' : 'var(--bg-2)',
                      color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-faint)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="card">
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Trinity Hub currently hosts <strong style={{ color: 'var(--text)' }}>{stats.resourceCount}</strong> resources contributed by <strong style={{ color: 'var(--text)' }}>{stats.userCount}</strong> members of the Trinity College community.
          </p>
        </div>
      )}
    </div>
  );
}
