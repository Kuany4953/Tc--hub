import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/resources');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6, textAlign: 'center' }}>Welcome back</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 28 }}>
          Sign in to your Trinity Hub account
        </p>
        <form onSubmit={handleSubmit} className="card">
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@trincoll.edu" required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" required />
          </div>
          {error && <div className="error-msg" style={{ marginBottom: 14 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', marginTop: 16 }}>
          New to Trinity Hub? <Link to="/register" style={{ color: 'var(--accent)' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', major: '', year: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/resources');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const field = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6, textAlign: 'center' }}>Join Trinity Hub</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 28 }}>
          Use your @trincoll.edu email to get started
        </p>
        <form onSubmit={handleSubmit} className="card">
          {[
            { key: 'name', label: 'Full name', type: 'text', placeholder: 'Kuany Kuany' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@trincoll.edu' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
            { key: 'major', label: 'Major (optional)', type: 'text', placeholder: 'Computer Science' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} {...field(f.key)} required={!f.label.includes('optional')} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>Class year (optional)</label>
            <select {...field('year')}>
              <option value="">Select year</option>
              {['2025','2026','2027','2028','Faculty','Staff'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {error && <div className="error-msg" style={{ marginBottom: 14 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif', marginTop: 16 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
