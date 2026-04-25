import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Stars({ rating, interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ fontSize: interactive ? 24 : 15, cursor: interactive ? 'pointer' : 'default', letterSpacing: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{ color: i <= (interactive ? (hovered || rating) : rating) ? '#d4a017' : '#ddd' }}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onSelect?.(i)}
        >★</span>
      ))}
    </span>
  );
}

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
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-faint)', fontFamily: 'sans-serif' }}>Loading...</div>
  );

  const CATEGORY_LABELS = { tutoring: 'Tutoring', office_hours: 'Office Hours', club: 'Club', event: 'Event', service: 'Service', other: 'Other' };
  const hasReviewed = reviews.some(r => r.userId === user?.id);

  return (
    <div className="page-container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span className={`badge badge-${resource.category}`}>{CATEGORY_LABELS[resource.category]}</span>
          <button onClick={toggleBookmark} style={{
            fontSize: 20, cursor: 'pointer', background: 'none', border: 'none',
            color: bookmarked ? '#d4a017' : 'var(--text-faint)',
          }} title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
            {bookmarked ? '★' : '☆'}
          </button>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 12 }}>{resource.title}</h1>

        {resource.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Stars rating={resource.avgRating} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>
              {resource.avgRating} ({resource.reviewCount} review{resource.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 20 }}>
          {resource.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {resource.location && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginBottom: 3 }}>LOCATION</div>
              <div style={{ fontSize: 13, fontFamily: 'sans-serif' }}>{resource.location}</div>
            </div>
          )}
          {resource.schedule && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginBottom: 3 }}>SCHEDULE</div>
              <div style={{ fontSize: 13, fontFamily: 'sans-serif' }}>{resource.schedule}</div>
            </div>
          )}
          {resource.contact && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginBottom: 3 }}>CONTACT</div>
              <div style={{ fontSize: 13, fontFamily: 'sans-serif' }}>{resource.contact}</div>
            </div>
          )}
          {resource.website && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginBottom: 3 }}>WEBSITE</div>
              <a href={resource.website} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, fontFamily: 'sans-serif', color: 'var(--accent)' }}>
                Visit →
              </a>
            </div>
          )}
        </div>

        {resource.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {resource.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 999,
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontFamily: 'sans-serif'
              }}>{tag}</span>
            ))}
          </div>
        )}

        {resource.author && (
          <div style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            Added by {resource.author.name}
          </div>
        )}
      </div>

      {/* Reviews */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {user && !hasReviewed && (
          <form onSubmit={submitReview} className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, fontFamily: 'sans-serif' }}>Write a review</h3>
            <div style={{ marginBottom: 12 }}>
              <Stars rating={rating} interactive onSelect={setRating} />
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={3} style={{ marginBottom: 10, resize: 'vertical' }} />
            {error && <div className="error-msg" style={{ marginBottom: 10 }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-faint)', fontSize: 14, fontFamily: 'sans-serif' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(review => (
              <div key={review.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 500, fontFamily: 'sans-serif', color: 'var(--accent)',
                    }}>
                      {review.reviewer?.name?.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 500 }}>{review.reviewer?.name}</span>
                    <Stars rating={review.rating} />
                  </div>
                  {(user?.id === review.userId || user?.role === 'admin') && (
                    <button onClick={() => deleteReview(review.id)}
                      style={{ fontSize: 12, color: 'var(--text-faint)', cursor: 'pointer', background: 'none', border: 'none' }}>
                      Delete
                    </button>
                  )}
                </div>
                {review.comment && <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{review.comment}</p>}
                <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'sans-serif', marginTop: 6 }}>
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
