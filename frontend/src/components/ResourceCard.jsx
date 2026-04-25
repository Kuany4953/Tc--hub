import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, StarIcon } from './Icons';

const CATEGORY_LABELS = {
  tutoring: 'Tutoring', office_hours: 'Office Hours',
  club: 'Club', event: 'Event', service: 'Service', other: 'Other'
};

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: 'var(--gold)' }}>
      {[1,2,3,4,5].map(i => (
        <StarIcon key={i} size={13} filled={i <= full} className="icon" style={{ opacity: i <= full ? 1 : 0.35 }} />
      ))}
    </span>
  );
}

export default function ResourceCard({ resource }) {
  return (
    <Link to={`/resources/${resource.id}`} style={{ display: 'block', height: '100%' }}>
      <div className="card card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <span className={`badge badge-${resource.category}`}>
            {CATEGORY_LABELS[resource.category]}
          </span>
          {resource.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Stars rating={resource.avgRating} />
              <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>
                ({resource.reviewCount})
              </span>
            </div>
          )}
        </div>

        <h3 style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 8,
          lineHeight: 1.3,
          fontFamily: 'var(--serif)',
        }}>
          {resource.title}
        </h3>

        <p style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: 16,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {resource.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
          {resource.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
              <MapPinIcon className="icon" style={{ color: 'var(--text-faint)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resource.location}</span>
            </div>
          )}
          {resource.schedule && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
              <ClockIcon className="icon" style={{ color: 'var(--text-faint)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resource.schedule}</span>
            </div>
          )}
        </div>

        {resource.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            {resource.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{
                fontSize: 11,
                padding: '3px 9px',
                borderRadius: 999,
                background: 'var(--bg-2)',
                color: 'var(--text-muted)',
                fontWeight: 500,
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
