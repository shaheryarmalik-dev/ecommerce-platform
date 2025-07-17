import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= value ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function ReviewForm({ initial, onSave, onCancel, loading }: { initial: Review; onSave: (form: Review) => void; onCancel: () => void; loading: boolean }) {
  const [rating, setRating] = useState(initial.rating);
  const [comment, setComment] = useState(initial.comment || "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    setError("");
    onSave({ ...initial, rating, comment });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              className={`w-8 h-8 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(i)}
              aria-label={`Set rating to ${i}`}
            >
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="input min-h-[80px]"
          placeholder="Write your review..."
        />
      </div>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow transition disabled:opacity-60" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold shadow transition" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
}

type Review = {
  id: string;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name?: string };
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ review: Review } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function fetchReviews() {
    setLoading(true);
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reviews.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  function handleEdit(review: Review) {
    setModal({ review });
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    fetch(`/api/reviews/${deleteId}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setSuccess("Review deleted.");
        setDeleteId(null);
        fetchReviews();
      })
      .catch(() => setError("Failed to delete review."))
      .finally(() => setDeleting(false));
  }

  function handleSave(form: Review) {
    if (!modal) return;
    setSaving(true);
    setError("");
    setSuccess("");
    fetch(`/api/reviews/${modal.review.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setSuccess("Review updated.");
          setModal(null);
          fetchReviews();
        }
      })
      .catch(() => setError("Failed to update review."))
      .finally(() => setSaving(false));
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-blue-700 mb-4">Your Reviews & Ratings</h3>
      {loading ? (
        <div>Loading reviews...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
      ) : reviews.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L4.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          <div className="text-lg">You haven't left any reviews yet.</div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="grid gap-4">
            {reviews.map(r => (
              <motion.div
                key={r.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl shadow bg-white border border-gray-100 flex gap-4 items-center"
              >
                {r.product?.imageUrl && (
                  <Image src={r.product.imageUrl} alt={r.product.name} width={64} height={64} className="w-16 h-16 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-blue-700">{r.product?.name}</div>
                  <StarRating value={r.rating} />
                  <div className="text-gray-700 text-sm mt-1">{r.comment}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(r.createdAt)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(r.id)} disabled={deleting}>Delete</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
      {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mt-2">{success}</div>}
      {/* Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-2 animate-fadeIn flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-blue-700">Edit Review</h4>
              <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" onClick={() => setModal(null)} aria-label="Close">&times;</button>
            </div>
            <ReviewForm initial={modal.review} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
          </motion.div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-2 animate-fadeIn flex flex-col items-center"
          >
            <h4 className="text-xl font-bold text-red-700 mb-4">Delete Review</h4>
            <p className="mb-6 text-gray-700 text-center">Are you sure you want to delete this review?</p>
            <div className="flex gap-4">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold shadow transition"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold shadow transition"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <style jsx>{`
        .input {
          @apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </div>
  );
} 