"use client";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};
export default function CartPage() {
  const { items, removeFromCart } = useCart();
  const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const { data: session } = useSession();
  const router = useRouter();

  function handleCheckout() {
    if (!session || !session.user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Your Cart</h1>
      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="text-gray-500 text-center">
          Your cart is empty.<br />
          <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="flex flex-col gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4 border-b pb-4"
              >
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">{item.name}</div>
                  <div className="text-gray-500">${item.price.toFixed(2)} x {item.quantity}</div>
                  <button
                    className="text-red-500 hover:underline text-sm mt-1 transition"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="font-bold text-green-600 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }} className="flex justify-between items-center mt-6">
              <div className="text-xl font-bold">Subtotal:</div>
              <div className="text-xl font-bold text-green-700">${subtotal.toFixed(2)}</div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700 transition text-lg font-semibold w-full"
              onClick={handleCheckout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 
