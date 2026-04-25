import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftIcon, MapPinIcon, ClockIcon, MailIcon, LinkIcon,
  BookmarkIcon, StarIcon,
} from '../components/Icons';

function Stars({ rating, interactive = false, onSelect, size = 16 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: 'inline-flex', gap: 2, color: 'var(--gold)', cursor: interactive ? 'pointer' : 'default' }}>
      {[1,2,3,4,5].map(i => {
        const active = i <= (interactive ? (hovered || rating) : Math.round(rating));
        return (
          <span key={i}
            onMouseEnter={() => interactive && setHovered(i)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onSelect?.(i)}
            style={{ display: 'inline-flex' }}
          >
            <StarIcon size={size} filled={active} className="icon" style={{ opacity: active ? 1 : 0.35 }} />
          </span>
        );
      })}
    </span>
  );
}

const CATEGORY_LABELS = { tutoring: 'Tutoring', office_hours: 'Office Hours', club: 'Club', event: 'Event', service: 'Service', other: 'Other' };

export default function ResourceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/resources/${id}`).then(res => setResource(res.data));
    api.get(`/reviews/${id}`).then(res => setReviews(res.data));
    if (user) {
      api.get(`/bookmarks/status/${id}`).then(res => setBookmarked(res.data.bookmarked));
    }
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user) return navigate('/login');
    if (bookmarked) { await api.delete(`/bookmarks/${id}`); setBookmarked(false); }
    else { await api.post(`/bookmarks/${id}`); setBookmarked(true); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Please select a rating');
    setSubmitting(true); setError('');
    try {
      const res = await api.post(`/reviews/${id}`, { rating, comment });
      setReviews(prev => [res.data, ...prev]);
      setRating(0); setComment('');
      const updated = await api.get(`/resources/${id}`);
      setResource(updated.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  const deleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    const updated = await api.get(`/resources/${id}`);
    setResource(updated.data);
  };

  if (!resource) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-faint)' }}>Loading…</div>
  );

  const hasReviewed = reviews.some(r => r.userId === user?.id);

  const InfoBlock = ({ label, children, IconComp }) => (
    <div style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {IconComp && (
        <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>
          <IconComp size={18} className="icon" />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div className="kbd-label" style={{ marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', wordBreak: 'break-word' }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: 880 }}>
      <button className="btn-ghost" onClick={() => navigate(-1)}
        style={{ marginBottom: 22, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px' }}>
        <ArrowLeftIcon size={15} className="icon" /> Back
      </button>

      <div className="card" style={{ marginBottom: 28, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 16 }}>
          <span className={`badge badge-${resource.category}`}>{CATEGORY_LABELS[resource.category]}</span>
          <button onClick={toggleBookmark}
            className={bookmarked ? 'btn-primary' : 'btn-secondary'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', fontSize: 13,
            }}
            title={bookmarked ? 'Saved — click to remove' : 'Save this resource'}>
            <BookmarkIcon size={15} className="icon" filled={bookmarked} />
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 14, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          {resource.title}
        </h1>

        {resource.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Stars rating={resource.avgRating} size={17} />
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              {Number(resource.avgRating).toFixed(1)} · {resource.reviewCount} review{resource.reviewCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 26 }}>
          {resource.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {resource.location && <InfoBlock label="Location" IconComp={MapPinIcon}>{resource.location}</InfoBlock>}
          {resource.schedule && <InfoBlock label="Schedule" IconComp={ClockIcon}>{resource.schedule}</InfoBlock>}
          {resource.contact && <InfoBlock label="Contact" IconComp={MailIcon}>{resource.contact}</InfoBlock>}
          {resource.website && (
            <InfoBlock label="Website" IconComp={LinkIcon}>
              <a href={resource.website} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(15,86,56,0.25)' }}>
                Visit site
              </a>
            </InfoBlock>
          )}
        </div>

        {resource.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 22 }}>
            {resource.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 12, padding: '4px 11px', borderRadius: 999,
                background: 'var(--bg-2)', color: 'var(--text-muted)',
                fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {resource.author && (
          <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            Added by <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{resource.author.name}</span>
          </div>
        )}
      </div>

      {/* Reviews */}
      <section>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18 }}>
          Reviews{reviews.length > 0 && <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}> · {reviews.length}</span>}
        </h2>

        {user && !hasReviewed && (
          <form onSubmit={submitReview} className="card" style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Share your experience</h3>
            <div style={{ marginBottom: 14 }}>
              <Stars rating={rating} interactive onSelect={setRating} size={26} />
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="What did you think? (optional)"
              rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
            {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-faint)' }}>
            No reviews yet — be the first.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map(review => (
              <div key={review.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                      border: '1px solid rgba(15,86,56,0.15)',
                    }}>
                      {review.reviewer?.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{review.reviewer?.name}</div>
                      <Stars rating={review.rating} size={13} />
                    </div>
                  </div>
                  {(user?.id === review.userId || user?.role === 'admin') && (
                    <button onClick={() => deleteReview(review.id)}
                      style={{ fontSize: 12, color: 'var(--text-faint)', cursor: 'pointer', background: 'none', border: 'none' }}>
                      Delete
                    </button>
                  )}
                </div>
                {review.comment && <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 6 }}>{review.comment}</p>}
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 10 }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
