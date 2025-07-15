import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptyAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  isDefault: false,
};

function AddressForm({ initial, onSave, onCancel, loading }: any) {
  const [form, setForm] = useState(initial || emptyAddress);
  const [error, setError] = useState("");

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.fullName || !form.line1 || !form.city || !form.state || !form.postalCode || !form.country) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input name="line1" value={form.line1} onChange={handleChange} placeholder="Address Line 1" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input name="line2" value={form.line2} onChange={handleChange} placeholder="Address Line 2" className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
          <input name="state" value={form.state} onChange={handleChange} placeholder="State/Province" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="input" />
        </div>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
          <span className="text-sm">Set as default address</span>
        </label>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2 rounded font-semibold shadow transition disabled:opacity-60" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <button type="button" className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-6 py-2 rounded font-semibold text-gray-700 transition" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit", address?: any } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function fetchAddresses() {
    setLoading(true);
    fetch("/api/addresses")
      .then(res => res.json())
      .then(data => {
        setAddresses(data.addresses || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load addresses.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  function handleAdd() {
    setModal({ mode: "add" });
  }

  function handleEdit(address: any) {
    setModal({ mode: "edit", address });
  }

  function handleDelete(address: any) {
    if (!window.confirm("Delete this address?")) return;
    setSaving(true);
    fetch(`/api/addresses/${address.id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setSuccess("Address deleted.");
        fetchAddresses();
      })
      .catch(() => setError("Failed to delete address."))
      .finally(() => setSaving(false));
  }

  function handleSave(form: any) {
    setSaving(true);
    setError("");
    setSuccess("");
    const method = modal?.mode === "edit" ? "PUT" : "POST";
    const url = modal?.mode === "edit" ? `/api/addresses/${modal.address.id}` : "/api/addresses";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setSuccess("Address saved.");
          setModal(null);
          fetchAddresses();
        }
      })
      .catch(() => setError("Failed to save address."))
      .finally(() => setSaving(false));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-700">Your Addresses</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition" onClick={handleAdd}>Add Address</button>
      </div>
      {loading ? (
        <div>Loading addresses...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
      ) : addresses.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
          <div className="text-lg">You haven't added any addresses yet.</div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="grid gap-4">
            {addresses.map(addr => (
              <motion.div
                key={addr.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl shadow bg-white border ${addr.isDefault ? "border-blue-500" : "border-gray-100"} flex flex-col gap-2`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-blue-700">{addr.fullName}</div>
                  {addr.isDefault && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>}
                </div>
                <div className="text-gray-700 text-sm">
                  {addr.line1}{addr.line2 && ", " + addr.line2}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                </div>
                {addr.phone && <div className="text-gray-500 text-xs">Phone: {addr.phone}</div>}
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(addr)}>Edit</button>
                  <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(addr)} disabled={saving}>Delete</button>
                  {!addr.isDefault && (
                    <button className="text-gray-600 hover:underline text-sm" onClick={() => handleSave({ ...addr, isDefault: true })} disabled={saving}>Set as Default</button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
      {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mt-2">{success}</div>}
      {/* Modal for add/edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 mx-2 animate-fadeIn flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-blue-700">{modal.mode === "add" ? "Add Address" : "Edit Address"}</h4>
              <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" onClick={() => setModal(null)} aria-label="Close">&times;</button>
            </div>
            <AddressForm initial={modal.address} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
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