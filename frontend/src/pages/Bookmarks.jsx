import { useState, useEffect } from 'react';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';

export function Bookmarks() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks').then(res => setResources(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4 }}>Saved resources</h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'sans-serif', marginBottom: 24 }}>
        {resources.length} saved resource{resources.length !== 1 ? 's' : ''}
      </p>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-faint)', fontFamily: 'sans-serif' }}>Loading...</div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>No saved resources yet.</p>
          <p style={{ fontSize: 13, color: 'var(--text-faint)', fontFamily: 'sans-serif' }}>
            Tap the ☆ on any resource to save it here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
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
    <div className="page-container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 20 }}>Admin dashboard</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[['Total users', stats.userCount], ['Resources', stats.resourceCount]].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <div style={{ fontSize: 28, fontWeight: 500 }}>{val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'sans-serif', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['stats', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 18px', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif',
            cursor: 'pointer', border: '1px solid',
            background: tab === t ? 'var(--accent)' : 'var(--surface)',
            color: tab === t ? 'white' : 'var(--text)',
            borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'sans-serif' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Major', 'Year', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '10px 14px' }}>{u.name}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{u.major || '—'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{u.year || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 999,
                      background: u.role === 'admin' ? 'var(--accent-light)' : 'var(--bg)',
                      color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)',
                      border: '1px solid', borderColor: u.role === 'admin' ? 'var(--accent)' : 'var(--border)',
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-faint)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
