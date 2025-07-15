import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "tr", label: "Turkish" },
  { value: "ko", label: "Korean" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "sv", label: "Swedish" },
  { value: "no", label: "Norwegian" },
  { value: "da", label: "Danish" },
  { value: "fi", label: "Finnish" },
  { value: "el", label: "Greek" },
];
const THEMES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function AccountSettings() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("system");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/account/settings")
      .then(res => res.json())
      .then(data => {
        setNotifyEmail(data.notifyEmail ?? true);
        setNotifySMS(data.notifySMS ?? false);
        setLanguage(data.language ?? "en");
        setTheme(data.theme ?? "system");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load settings.");
        setLoading(false);
      });
  }, []);

  function handleSave(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    fetch("/api/account/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifyEmail, notifySMS, language, theme }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setSuccess("Settings updated.");
      })
      .catch(() => setError("Failed to update settings."))
      .finally(() => setSaving(false));
  }

  function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    fetch("/api/account/delete", { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowDelete(false);
          signOut({ callbackUrl: "/" });
        } else {
          setDeleteError(data.error || "Failed to delete account.");
        }
      })
      .catch(() => setDeleteError("Failed to delete account."))
      .finally(() => setDeleting(false));
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-md mx-auto">
      <div>
        <h3 className="text-lg font-bold text-blue-700 mb-2">Notification Preferences</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={e => setNotifyEmail(e.target.checked)}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifySMS}
                onChange={e => setNotifySMS(e.target.checked)}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700">SMS notifications</span>
            </label>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-blue-700 mb-2">Preferences</h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-gray-700">Language</span>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="input"
              disabled={loading}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-700">Theme</span>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="input"
              disabled={loading}
            >
              {THEMES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow transition disabled:opacity-60"
        disabled={loading || saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      <div className="pt-8 border-t mt-8">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold shadow transition"
          onClick={() => setShowDelete(true)}
          disabled={loading || deleting}
        >
          Delete Account
        </button>
      </div>
      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-2 animate-fadeIn flex flex-col items-center">
            <h4 className="text-xl font-bold text-red-700 mb-4">Delete Account</h4>
            <p className="mb-6 text-gray-700 text-center">Are you sure you want to delete your account? This action cannot be undone.</p>
            {deleteError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-4">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold shadow transition"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold shadow transition"
                onClick={() => setShowDelete(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
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
    </form>
  );
} 