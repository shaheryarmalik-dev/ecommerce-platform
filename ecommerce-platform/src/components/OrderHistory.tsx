import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>;
  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M9 3v18m6-18v18M3 21h18" /></svg>
      <div className="text-lg">You haven't placed any orders yet.</div>
    </div>
  );

  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <motion.button
                key={order.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left bg-white rounded-xl shadow p-6 hover:bg-blue-50 border border-gray-100 transition flex flex-col gap-2 mb-2"
                onClick={() => setSelected(order)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-blue-700">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="text-gray-600">{order.items.length} item(s)</div>
                  <div className="font-bold text-green-600">${order.total.toFixed(2)}</div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Order Details Modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setSelected(null)}>&times;</button>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Order #{selected.id.slice(0, 8).toUpperCase()}</h3>
            <div className="text-sm text-gray-500 mb-4">Placed on {formatDate(selected.createdAt)}</div>
            <div className="mb-4">
              <div className="font-semibold mb-1">Items:</div>
              <ul className="divide-y divide-gray-100">
                {selected.items.map((item: any) => (
                  <li key={item.id} className="py-2 flex items-center gap-3">
                    {item.product?.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-blue-700">{item.product?.name}</div>
                      <div className="text-gray-500 text-xs">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-gray-700">${item.price.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-green-600">${selected.total.toFixed(2)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className="capitalize">{selected.status}</span>
            </div>
            {selected.payment && (
              <div className="mb-2 flex justify-between">
                <span className="font-semibold">Payment:</span>
                <span>{selected.payment.provider} ({selected.payment.status})</span>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-4">Order ID: {selected.id}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 