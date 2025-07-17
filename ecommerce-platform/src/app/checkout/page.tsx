"use client";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};
export default function CheckoutPage() {
  const { items } = useCart();
  const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  async function handleStripeCheckout() {
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Stripe checkout failed.");
    }
  }

  async function handlePayPalCheckout() {
    // For now, just call the API and show a mock success alert
    const res = await fetch("/api/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.orderID) {
      alert("PayPal order created! (Mock flow) Order ID: " + data.orderID);
    } else {
      alert("PayPal checkout failed.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Checkout</h1>
      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="text-gray-500 text-center">
          Your cart is empty.<br />
          <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="mb-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4 border-b pb-2 mb-2"
                >
                  <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800">{item.name}</div>
                    <div className="text-gray-500">${item.price.toFixed(2)} x {item.quantity}</div>
                  </div>
                  <div className="font-bold text-green-600 text-md">${(item.price * item.quantity).toFixed(2)}</div>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mt-4">
                <div className="text-lg font-bold">Subtotal:</div>
                <div className="text-lg font-bold text-green-700">${subtotal.toFixed(2)}</div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="bg-blue-50 p-4 rounded shadow mb-6">
              <div className="font-semibold mb-2">Payment Options</div>
              <div className="flex gap-6 items-center">
                <button
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 hover:border-blue-400 transition"
                  onClick={handleStripeCheckout}
                >
                  <Image src="/stripe-logo.png" alt="Stripe" width={40} height={20} />
                  Pay with Stripe
                </button>
                <button
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 hover:border-blue-400 transition"
                  onClick={handlePayPalCheckout}
                >
                  <Image src="/paypal-logo.png" alt="PayPal" width={40} height={20} />
                  Pay with PayPal
                </button>
                <span className="ml-2 text-green-600 flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 17.5l-5-5 1.41-1.41L9.5 14.67l8.59-8.59L19.5 7.5l-10 10z"/></svg>
                  Secure Payment
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 