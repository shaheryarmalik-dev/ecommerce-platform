"use client";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartIcon() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" className="relative cursor-pointer">
      <FaShoppingCart className="text-2xl text-blue-700" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
          {itemCount}
        </span>
      )}
    </Link>
  );
} 