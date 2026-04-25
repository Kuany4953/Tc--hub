import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const active = (path) => ({
    fontWeight: pathname === path ? '500' : '400',
    color: pathname === path ? 'var(--text)' : 'var(--text-muted)',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  });

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 500, fontFamily: 'sans-serif' }}>T</span>
          </div>
          <span style={{ fontWeight: 500, fontSize: 15 }}>Trinity Hub</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/resources" style={active('/resources')}>Resources</Link>
          {user && <Link to="/bookmarks" style={active('/bookmarks')}>Saved</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={active('/admin')}>Admin</Link>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/submit">
                <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>+ Add Resource</button>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--accent-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500, fontFamily: 'sans-serif',
                  color: 'var(--accent)',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button className="btn-ghost" onClick={handleLogout} style={{ fontSize: 13 }}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-ghost">Sign in</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Join</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
