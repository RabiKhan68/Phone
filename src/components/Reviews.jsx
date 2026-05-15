import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./Reviews.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLECTION   = "reviews";
const MAX_RATING   = 5;
const MAX_BODY_LEN = 1000;

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest first"   },
  { value: "oldest",  label: "Oldest first"   },
  { value: "highest", label: "Highest rating" },
  { value: "lowest",  label: "Lowest rating"  },
];

const CATEGORY_FILTERS = ["All", "Flagship", "Mid-range", "Budget", "Foldable"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Normalise phone name so "samsung galaxy s23" and "Samsung Galaxy S23" match
const normalise = (str) => str?.trim().toLowerCase() ?? "";

const formatDate = (ts) => {
  if (!ts) return "";
  // Firestore Timestamp → JS Date
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const avgRating = (reviews) => {
  if (!reviews.length) return 0;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
};

const sortReviews = (reviews, sort) => {
  const copy = [...reviews];
  switch (sort) {
    case "oldest":  return copy.sort((a, b) => {
      const ad = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const bd = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return ad - bd;
    });
    case "highest": return copy.sort((a, b) => b.rating - a.rating);
    case "lowest":  return copy.sort((a, b) => a.rating - b.rating);
    default:        return copy.sort((a, b) => {
      const ad = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const bd = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return bd - ad;
    });
  }
};

const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value, onChange, readOnly = false, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      className={`stars stars--${size}${readOnly ? " stars--readonly" : ""}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value} out of ${MAX_RATING}`}
    >
      {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className={`star${star <= active ? " star--on" : ""}`}
          onClick={readOnly ? undefined : () => onChange(star)}
          onMouseEnter={readOnly ? undefined : () => setHovered(star)}
          onMouseLeave={readOnly ? undefined : () => setHovered(0)}
          aria-label={readOnly ? undefined : `Rate ${star} star${star > 1 ? "s" : ""}`}
          tabIndex={readOnly ? -1 : 0}
          disabled={readOnly}
        >
          <i className="ti ti-star-filled" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rating-bar-row">
      <span className="rating-bar-label">{label}</span>
      <div className="rating-bar-track" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar-count">{count}</span>
    </div>
  );
}

function ReviewCard({ review, onDelete, onLike }) {
  return (
    <article className="review-card" aria-label={`Review by ${review.author}`}>
      <div className="review-card-header">
        <div className="review-avatar" aria-hidden="true">{getInitials(review.author)}</div>
        <div className="review-meta">
          <span className="review-author">{review.author}</span>
          <span className="review-phone-tag">{review.phoneName}</span>
          {review.category && (
            <span className="review-category-tag">{review.category}</span>
          )}
        </div>
        <div className="review-header-right">
          <StarRating value={review.rating} readOnly size="sm" />
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {review.title && (
        <h3 className="review-title">"{review.title}"</h3>
      )}

      <p className="review-body">{review.body}</p>

      <div className="review-card-footer">
        <button
          className={`review-like-btn${review.liked ? " review-like-btn--active" : ""}`}
          onClick={() => onLike(review.id)}
          aria-label={review.liked ? "Unlike review" : "Like review"}
          aria-pressed={review.liked}
        >
          <i className="ti ti-thumb-up" aria-hidden="true" />
          <span>{review.likes ?? 0}</span>
        </button>

        <button
          className="review-delete-btn"
          onClick={() => onDelete(review.id)}
          aria-label="Delete review"
        >
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function ReviewForm({ onSubmit, onCancel, loading }) {
  const [author,    setAuthor]    = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [category,  setCategory]  = useState("");
  const [title,     setTitle]     = useState("");
  const [body,      setBody]      = useState("");
  const [rating,    setRating]    = useState(0);
  const [error,     setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const authorRef = useRef(null);

  useEffect(() => { authorRef.current?.focus(); }, []);

  const isValid = author.trim() && phoneName.trim() && body.trim() && rating > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) {
      setError("Please fill in your name, phone model, rating, and review.");
      return;
    }
    setError("");
    onSubmit({
      author:       author.trim(),
      phoneName:    phoneName.trim(),
      phoneNameKey: normalise(phoneName), // stored for exact filtering
      category:     category || null,
      title:        title.trim(),
      body:         body.trim(),
      rating,
      likes:        0,
      createdAt:    serverTimestamp(),    // Firestore server time — same timezone for everyone
    });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <div className="review-form-header">
        <i className="ti ti-edit review-form-icon" aria-hidden="true" />
        <h2 className="review-form-title">Write a Review</h2>
      </div>

      {error && (
        <p className="review-form-error" role="alert">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="review-form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="rf-author">Your name *</label>
          <input
            ref={authorRef}
            id="rf-author"
            className={`form-input${submitted && !author.trim() ? " form-input--error" : ""}`}
            type="text"
            placeholder="e.g. Rabi Khan"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={60}
            required
            aria-required="true"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="rf-phone">Phone model *</label>
          <input
            id="rf-phone"
            className={`form-input${submitted && !phoneName.trim() ? " form-input--error" : ""}`}
            type="text"
            placeholder="e.g. Samsung Galaxy S23"
            value={phoneName}
            onChange={(e) => setPhoneName(e.target.value)}
            maxLength={80}
            required
            aria-required="true"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="rf-category">Category</label>
          <div className="form-select-wrap">
            <select
              id="rf-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category…</option>
              {CATEGORY_FILTERS.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <i className="ti ti-chevron-down form-select-arrow" aria-hidden="true" />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="rf-title">Review title</label>
          <input
            id="rf-title"
            className="form-input"
            type="text"
            placeholder="e.g. Best camera phone of 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      <div className="form-field form-field--full">
        <label className="form-label" htmlFor="rf-body">Your review *</label>
        <textarea
          id="rf-body"
          className={`form-textarea${submitted && !body.trim() ? " form-input--error" : ""}`}
          placeholder="Share your experience with this phone…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={MAX_BODY_LEN}
          required
          aria-required="true"
        />
        <span className="form-char-count">{body.length} / {MAX_BODY_LEN}</span>
      </div>

      <div className="form-field form-field--full">
        <label className="form-label">Your rating *</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="review-form-actions">
        <button
          type="button"
          className="form-btn form-btn--ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="form-btn form-btn--primary"
          disabled={loading || (submitted && !isValid)}
        >
          <i className={`ti ${loading ? "ti-loader" : "ti-check"}`} aria-hidden="true" />
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Reviews({ showToast }) {
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);   // initial Firestore load
  const [submitting,setSubmitting]= useState(false);  // form submit in progress
  const [showForm,  setShowForm]  = useState(false);
  const [sort,      setSort]      = useState("newest");
  const [filter,    setFilter]    = useState("All");
  const [search,    setSearch]    = useState("");

  // ── Real-time Firestore listener ─────────────────────────────────────────
  // Loads ALL reviews once; filtering by phone is done client-side via search.
  // This means a person from India and a person from USA see the exact same data.
  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setReviews(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setLoading(false);
      },
      (err) => {
        console.error("Firestore read error:", err);
        setLoading(false);
      }
    );

    return () => unsub(); // cleanup listener on unmount
  }, []);

  // ── Write a review ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (review) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, COLLECTION), review);
      setShowForm(false);
      showToast?.("Review submitted!", "success");
    } catch (err) {
      console.error("Failed to submit review:", err);
      showToast?.("Failed to submit. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }, [showToast]);

  // ── Delete a review ───────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
      showToast?.("Review deleted.", "error");
    } catch (err) {
      console.error("Failed to delete review:", err);
      showToast?.("Failed to delete. Try again.", "error");
    }
  }, [showToast]);

  // ── Like / unlike ─────────────────────────────────────────────────────────
  const handleLike = useCallback(async (id) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        liked: !review.liked,
        likes: review.liked ? (review.likes ?? 1) - 1 : (review.likes ?? 0) + 1,
      });
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  }, [reviews]);

  // ── Derived: search filters by phone name ─────────────────────────────────
  // When a user types "Samsung Galaxy S23", only S23 reviews appear.
  // The `phoneNameKey` field (normalised lowercase) makes matching reliable.
  const filtered = useMemo(() => {
    const base = reviews.filter((r) => {
      const matchCat    = filter === "All" || r.category === filter;
      const lowerSearch = search.toLowerCase();
      const matchSearch = !search ||
        normalise(r.phoneName).includes(lowerSearch) ||
        normalise(r.author).includes(lowerSearch)    ||
        normalise(r.body).includes(lowerSearch);
      return matchCat && matchSearch;
    });
    return sortReviews(base, sort);
  }, [reviews, filter, search, sort]);

  // Stats are computed from filtered results so they reflect the current phone search
  const avg   = useMemo(() => avgRating(filtered), [filtered]);
  const total = filtered.length;

  const distrib = useMemo(() =>
    Array.from({ length: MAX_RATING }, (_, i) => {
      const star = MAX_RATING - i;
      return { star, count: filtered.filter((r) => r.rating === star).length };
    }),
  [filtered]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="reviews-page">

      {/* Page header */}
      <div className="rv-header">
        <div className="rv-header-left">
          <i className="ti ti-message-star rv-header-icon" aria-hidden="true" />
          <div>
            <h1 className="rv-title">User Reviews</h1>
            <p className="rv-subtitle">Global opinions — search a phone to filter</p>
          </div>
        </div>
        <button
          className="rv-write-btn"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <i className={`ti ${showForm ? "ti-x" : "ti-edit"}`} aria-hidden="true" />
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ReviewForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          loading={submitting}
        />
      )}

      {/* Loading state */}
      {loading && (
        <div className="rv-empty">
          <i className="ti ti-loader rv-empty-icon" aria-hidden="true" />
          <p className="rv-empty-text">Loading reviews…</p>
        </div>
      )}

      {/* Summary panel — only shown when filtered to a phone */}
      {!loading && total > 0 && (
        <div className="rv-summary">
          <div className="rv-summary-score">
            <span className="rv-avg">{avg}</span>
            <StarRating value={Math.round(avg)} readOnly size="md" />
            <span className="rv-total">{total} review{total !== 1 ? "s" : ""}</span>
          </div>
          <div className="rv-summary-bars">
            {distrib.map(({ star, count }) => (
              <RatingBar key={star} label={`${star}★`} count={count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      {!loading && (
        <div className="rv-controls">
          <div className="rv-filter-pills" role="group" aria-label="Filter by category">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                className={`rv-pill${filter === cat ? " rv-pill--active" : ""}`}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="rv-controls-right">
            {/* Search — type a phone name to see only those reviews */}
            <div className="rv-search-box">
              <i className="ti ti-search rv-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="rv-search-input"
                placeholder="Search by phone, author, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search reviews"
              />
              {search && (
                <button
                  className="rv-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="rv-sort-wrap">
              <select
                className="rv-sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort reviews"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <i className="ti ti-chevron-down rv-sort-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {/* Review list */}
      {!loading && (
        filtered.length === 0 ? (
          <div className="rv-empty">
            <i className="ti ti-message-off rv-empty-icon" aria-hidden="true" />
            <p className="rv-empty-text">
              {reviews.length === 0
                ? "No reviews yet — be the first to write one!"
                : "No reviews match your search."}
            </p>
          </div>
        ) : (
          <div className="rv-list" aria-label="Review list">
            {filtered.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDelete}
                onLike={handleLike}
              />
            ))}
          </div>
        )
      )}

    </div>
  );
}