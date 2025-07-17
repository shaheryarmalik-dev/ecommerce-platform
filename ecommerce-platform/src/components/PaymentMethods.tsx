import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptyCard: PaymentFormType = {
  type: "card",
  cardBrand: "",
  cardLast4: "",
  cardExpMonth: undefined,
  cardExpYear: undefined,
  paypalEmail: "",
  isDefault: false,
};
const emptyPaypal: PaymentFormType = {
  type: "paypal",
  cardBrand: "",
  cardLast4: "",
  cardExpMonth: undefined,
  cardExpYear: undefined,
  paypalEmail: "",
  isDefault: false,
};

type PaymentFormType = {
  type: "card" | "paypal";
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  paypalEmail?: string;
  isDefault: boolean;
};

type PaymentFormProps = {
  initial: typeof emptyCard | typeof emptyPaypal;
  onSave: (data: typeof emptyCard | typeof emptyPaypal) => void;
  onCancel: () => void;
  loading: boolean;
};

function PaymentForm({ initial, onSave, onCancel, loading }: PaymentFormProps) {
  const [form, setForm] = useState<PaymentFormType>(initial || emptyCard);
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : (name === "cardExpMonth" || name === "cardExpYear" ? Number(value) : value) }));
  }

  function handleTypeChange(e: ChangeEvent<HTMLInputElement>) {
    const type = e.target.value;
    setForm(type === "card" ? { ...emptyCard, isDefault: form.isDefault } : { ...emptyPaypal, isDefault: form.isDefault });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.type === "card") {
      if (!form.cardBrand || !form.cardLast4 || !form.cardExpMonth || !form.cardExpYear) {
        setError("Please fill in all card fields.");
        return;
      }
    } else if (form.type === "paypal") {
      if (!form.paypalEmail) {
        setError("Please enter your PayPal email.");
        return;
      }
    }
    setError("");
    onSave({
      ...form,
      cardExpMonth: form.cardExpMonth ? Number(form.cardExpMonth) : undefined,
      cardExpYear: form.cardExpYear ? Number(form.cardExpYear) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2">
          <input type="radio" name="type" value="card" checked={form.type === "card"} onChange={handleTypeChange} />
          Card
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="type" value="paypal" checked={form.type === "paypal"} onChange={handleTypeChange} />
          PayPal
        </label>
      </div>
      {form.type === "card" && (
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Brand</label>
            <input name="cardBrand" value={form.cardBrand} onChange={handleChange} placeholder="Visa, Mastercard..." className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits</label>
            <input name="cardLast4" value={form.cardLast4} onChange={handleChange} placeholder="1234" maxLength={4} className="input" required />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exp. Month</label>
              <input name="cardExpMonth" value={form.cardExpMonth} onChange={handleChange} placeholder="MM" maxLength={2} className="input" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exp. Year</label>
              <input name="cardExpYear" value={form.cardExpYear} onChange={handleChange} placeholder="YYYY" maxLength={4} className="input" required />
            </div>
          </div>
        </div>
      )}
      {form.type === "paypal" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
          <input name="paypalEmail" value={form.paypalEmail} onChange={handleChange} placeholder="your@email.com" className="input" required />
        </div>
      )}
      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
        <span className="text-sm">Set as default payment method</span>
      </label>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2 rounded font-semibold shadow transition disabled:opacity-60" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <button type="button" className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-6 py-2 rounded font-semibold text-gray-700 transition" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit", method?: any } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function fetchMethods() {
    setLoading(true);
    fetch("/api/payment-methods")
      .then(res => res.json())
      .then(data => {
        setMethods(data.paymentMethods || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load payment methods.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMethods();
  }, []);

  function handleAdd() {
    setModal({ mode: "add" });
  }

  function handleEdit(method: any) {
    setModal({ mode: "edit", method });
  }

  function handleDelete(method: any) {
    if (!window.confirm("Delete this payment method?")) return;
    setSaving(true);
    fetch(`/api/payment-methods/${method.id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setSuccess("Payment method deleted.");
        fetchMethods();
      })
      .catch(() => setError("Failed to delete payment method."))
      .finally(() => setSaving(false));
  }

  function handleSave(form: any) {
    setSaving(true);
    setError("");
    setSuccess("");
    const method = modal?.mode === "edit" ? "PUT" : "POST";
    const url = modal?.mode === "edit" ? `/api/payment-methods/${modal.method.id}` : "/api/payment-methods";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setSuccess("Payment method saved.");
          setModal(null);
          fetchMethods();
        }
      })
      .catch(() => setError("Failed to save payment method."))
      .finally(() => setSaving(false));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-700">Your Payment Methods</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition" onClick={handleAdd}>Add Payment Method</button>
      </div>
      {loading ? (
        <div>Loading payment methods...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
      ) : methods.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m-7-7h14" /></svg>
          <div className="text-lg">No payment methods added yet.</div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="grid gap-4">
            {methods.map(method => (
              <motion.div
                key={method.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl shadow bg-white border ${method.isDefault ? "border-blue-500" : "border-gray-100"} flex flex-col gap-2`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-blue-700">
                    {method.type === "card"
                      ? `${method.cardBrand} •••• ${method.cardLast4}`
                      : `PayPal: ${method.paypalEmail}`}
                  </div>
                  {method.isDefault && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>}
                </div>
                {method.type === "card" && (
                  <div className="text-gray-700 text-sm">
                    Expires {method.cardExpMonth?.toString().padStart(2, "0")}/{method.cardExpYear}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(method)}>Edit</button>
                  <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(method)} disabled={saving}>Delete</button>
                  {!method.isDefault && (
                    <button className="text-gray-600 hover:underline text-sm" onClick={() => handleSave({ ...method, isDefault: true })} disabled={saving}>Set as Default</button>
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
              <h4 className="text-xl font-bold text-blue-700">{modal.mode === "add" ? "Add Payment Method" : "Edit Payment Method"}</h4>
              <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" onClick={() => setModal(null)} aria-label="Close">&times;</button>
            </div>
            <PaymentForm initial={modal.method} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
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