import { Link } from 'react-router-dom';

const CATEGORY_LABELS = {
  tutoring: 'Tutoring', office_hours: 'Office Hours',
  club: 'Club', event: 'Event', service: 'Service', other: 'Other'
};

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= full ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

export default function ResourceCard({ resource }) {
  return (
    <Link to={`/resources/${resource.id}`} style={{ display: 'block' }}>
      <div className="card" style={{
        height: '100%', transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <span className={`badge badge-${resource.category}`}>
            {CATEGORY_LABELS[resource.category]}
          </span>
          {resource.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Stars rating={resource.avgRating} />
              <span style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'sans-serif' }}>
                ({resource.reviewCount})
              </span>
            </div>
          )}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
          {resource.title}
        </h3>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {resource.description}
        </p>

        {resource.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-faint)', fontFamily: 'sans-serif' }}>
            <span>📍</span><span>{resource.location}</span>
          </div>
        )}

        {resource.schedule && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginTop: 4 }}>
            <span>🕐</span><span>{resource.schedule}</span>
          </div>
        )}

        {resource.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {resource.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: 'var(--bg)', color: 'var(--text-muted)',
                border: '1px solid var(--border)', fontFamily: 'sans-serif'
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
