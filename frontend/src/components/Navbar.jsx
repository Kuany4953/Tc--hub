import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const linkStyle = (path) => ({
    fontWeight: pathname === path ? 600 : 500,
    color: pathname === path ? 'var(--text)' : 'var(--text-muted)',
    fontSize: 14,
    padding: '8px 4px',
    position: 'relative',
    transition: 'color 0.15s',
  });

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: 'saturate(180%) blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="page-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px -4px rgba(15, 86, 56, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <span style={{
              color: 'white',
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: 26,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>T</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}>Trinity Hub</span>
            <span style={{
              fontSize: 11,
              color: 'var(--text-faint)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 4,
            }}>Hartford, CT</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/resources" style={linkStyle('/resources')}>Resources</Link>
          {user && <Link to="/bookmarks" style={linkStyle('/bookmarks')}>Saved</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <Link to="/submit">
                <button className="btn-primary" style={{ padding: '9px 16px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <PlusIcon size={15} className="icon" />
                  Add resource
                </button>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 6, borderLeft: '1px solid var(--border)' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--accent-light)',
                  border: '1px solid rgba(15,86,56,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  color: 'var(--accent)',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button className="btn-ghost" onClick={handleLogout} style={{ fontSize: 13.5 }}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-ghost" style={{ fontSize: 14 }}>Sign in</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13.5 }}>Join Trinity Hub</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
