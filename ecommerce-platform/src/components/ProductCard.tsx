"use client";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { useWishlist } from "@/components/WishlistContext";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  stock?: number;
  avgRating?: number;
  reviewCount?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const favorite = isInWishlist(product.id);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  async function handleAddToCart() {
    if (!session || !session.user) {
      router.push("/login");
      return;
    }
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  }

  async function handleFavorite() {
    if (!session || !session.user) {
      alert("Please log in to use the wishlist feature.");
      return;
    }
    setFavoriteLoading(true);
    if (favorite) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    setFavoriteLoading(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl relative">
      {/* Favorite Heart Icon */}
      <button
        className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white shadow hover:bg-gray-100 cursor-pointer"
        onClick={e => { e.stopPropagation(); e.preventDefault(); handleFavorite(); }}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        disabled={favoriteLoading}
      >
        {favoriteLoading ? (
          <svg className="animate-spin w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        ) : favorite ? (
          <HeartSolid className="w-7 h-7 text-red-500" />
        ) : (
          <HeartOutline className="w-7 h-7 text-gray-400" />
        )}
      </button>
      <Link href={`/shop/${product.id}`} className="w-full flex flex-col items-center group" style={{ textDecoration: 'none' }}>
        <div className="w-48 h-48 mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl.trim()}
              alt={product.name}
              width={180}
              height={180}
              className="object-cover rounded-lg"
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80"
              alt="No image"
              width={120}
              height={120}
              className="object-contain opacity-50"
            />
          )}
        </div>
        <h2 className="text-xl font-bold mb-2 text-blue-800 text-center group-hover:underline">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-2 text-center">{product.description}</p>
      </Link>
      {/* Stock status */}
      <div className={`mb-2 text-sm font-semibold ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
        {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </div>
      {/* Rating and reviews */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-500 font-bold">★</span>
        <span className="text-base font-semibold">{product.avgRating?.toFixed(1) || '0.0'}</span>
        <span className="text-gray-400 text-sm">({product.reviewCount || 0} reviews)</span>
      </div>
      <div className="font-bold text-green-600 text-2xl mb-4">${product.price.toFixed(2)}</div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  );
} 