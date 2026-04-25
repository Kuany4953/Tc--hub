import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ResourceCard from '../components/ResourceCard';
import { SearchIcon } from '../components/Icons';

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'tutoring', label: 'Tutoring' },
  { key: 'office_hours', label: 'Office Hours' },
  { key: 'club', label: 'Clubs' },
  { key: 'event', label: 'Events' },
  { key: 'service', label: 'Services' },
  { key: 'other', label: 'Other' },
];

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api.get(`/resources?${params}`)
      .then(res => { setResources(res.data.resources); setTotal(res.data.total); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('search', searchInput.trim());
  };

  return (
    <div className="page-container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 38, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.025em' }}>Campus Resources</h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
          {total} resource{total !== 1 ? 's' : ''} from across Trinity College
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 22, maxWidth: 560 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flex: 1,
          background: 'var(--surface)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius)', padding: '0 14px',
          color: 'var(--text-faint)',
        }}>
          <SearchIcon size={17} className="icon" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name, description, or tag..."
            style={{ border: 'none', boxShadow: 'none', padding: '11px 0', background: 'transparent' }}
          />
        </div>
        <button type="submit" className="btn-secondary">Search</button>
        {search && (
          <button type="button" className="btn-ghost" onClick={() => { setSearchInput(''); setParam('search', ''); }}>
            Clear
          </button>
        )}
      </form>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setParam('category', cat.key)}
            style={{
              padding: '7px 16px', borderRadius: 999, fontSize: 13.5, fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              background: category === cat.key ? 'var(--accent)' : 'var(--surface)',
              color: category === cat.key ? 'white' : 'var(--text-muted)',
              borderColor: category === cat.key ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.15s',
            }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-faint)' }}>Loading…</div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No resources found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 14 }}>Try a different search or clear your filters.</p>
          <button className="btn-secondary" onClick={() => { setSearchInput(''); setSearchParams({}); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setParam('page', p)}
              style={{
                width: 38, height: 38, borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                border: '1px solid',
                background: page === p ? 'var(--accent)' : 'var(--surface)',
                color: page === p ? 'white' : 'var(--text)',
                borderColor: page === p ? 'var(--accent)' : 'var(--border)',
                cursor: 'pointer',
              }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
