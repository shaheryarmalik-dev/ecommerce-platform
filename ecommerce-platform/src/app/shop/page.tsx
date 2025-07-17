"use client";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  category?: string;
};
export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Error fetching products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by selected category (case-insensitive)
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  const finalProducts = searchTerm
    ? filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Shop Banner */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-14 px-4 flex flex-col items-center mb-0"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 text-center">Shop All Products</h1>
        <p className="text-xl md:text-2xl text-gray-600 text-center max-w-2xl">Browse our curated selection of the latest and greatest in electronics, fashion, home, and more. Use the filters to find exactly what you need!</p>
      </motion.section>
      {/* Divider */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl h-2 mb-12 bg-gray-200 rounded-b-lg shadow-sm" />
      </div>
      {/* Search Bar Section */}
      <section className="w-full flex justify-center bg-gray-100 py-8 px-4">
        <div className="w-full max-w-3xl">
          <div className="rounded-lg shadow border border-blue-100 bg-white px-6 py-4">
            <SearchBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              query={query}
              setQuery={setQuery}
              onQueryChange={setSearchTerm}
            />
          </div>
        </div>
      </section>
      {/* Product Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 mt-12">
          <div className="flex items-center gap-3 mb-10">
            <ShoppingBagIcon className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Products</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ShoppingBagIcon className="w-16 h-16 mb-4 text-blue-200" />
              <span className="text-lg font-semibold">No products found.</span>
              <span className="text-sm text-gray-400 mt-1">Try a different search or category.</span>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
              >
                {finalProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.04 } },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
} 