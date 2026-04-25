import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export function SubmitResource() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', schedule: '', contact: '', website: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const tags = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      const res = await api.post('/resources', { ...form, tags });
      navigate(`/resources/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    } finally { setLoading(false); }
  };

  const field = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div className="page-container" style={{ padding: '2rem 1.5rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>Add a resource</h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'sans-serif', marginBottom: 24 }}>
        Share a campus resource with the Trinity community.
      </p>
      <form onSubmit={handleSubmit} className="card">
        {[
          { key: 'title', label: 'Title *', placeholder: 'e.g. CS Peer Tutoring — Data Structures' },
          { key: 'location', label: 'Location', placeholder: 'e.g. Engineering Building 112' },
          { key: 'schedule', label: 'Schedule', placeholder: 'e.g. Mon/Wed 6–9pm' },
          { key: 'contact', label: 'Contact', placeholder: 'e.g. cs@trincoll.edu' },
          { key: 'website', label: 'Website', placeholder: 'https://...' },
          { key: 'tags', label: 'Tags (comma-separated)', placeholder: 'cs, tutoring, free, data structures' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input placeholder={f.placeholder} {...field(f.key)} required={f.label.includes('*')} />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>Category *</label>
          <select {...field('category')} required>
            <option value="">Select a category</option>
            {[['tutoring','Tutoring'],['office_hours','Office Hours'],['club','Club'],['event','Event'],['service','Service'],['other','Other']].map(([v,l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>Description *</label>
          <textarea {...field('description')} placeholder="Describe the resource — what it offers, who it's for, and how to access it..." rows={4} required style={{ resize: 'vertical' }} />
        </div>

        {error && <div className="error-msg" style={{ marginBottom: 14 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit resource'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
