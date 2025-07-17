"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" }, // electronics gadgets
  { name: "Fashion", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" }, // fashion
  { name: "Home", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80" }, // home interior
  { name: "Audio", image: "https://images.unsplash.com/photo-1612465289702-7c84b5258fde?q=80&w=746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, // headphones
  { name: "Wearables", image: "https://images.unsplash.com/photo-1676173646429-95db566dde1a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" }, // tracking watch
  { name: "Toys", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" }, // toys
  { name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80" }, // sports
  { name: "Beauty", image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" }, // beauty
];

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  category?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Map product names to IDs for Trending and Home Essentials
  const trendingNames = [
    "Wireless Headphones",
    "Smart Watch",
    "Bluetooth Speaker",
    "VR Headset",
    "Robot Vacuum",
    "Fitness Tracker",
    "Portable Gaming Console",
    "Smart Glasses",
    "Wireless Earbuds",
    "Noise Cancelling Earbuds"
  ];
  const homeEssentialsNames = [
    "Robot Vacuum",
    "Smart Home Hub",
    "Smart Light Bulb",
    "Wireless Charger",
  ];
  const trending: Product[] = products.filter(p => trendingNames.includes(p.name));
  const homeEssentials: Product[] = products.filter(p => homeEssentialsNames.includes(p.name));

  const trendingRowRef = useRef<HTMLDivElement>(null);
  const trendingAutoSlideTimer = useRef<NodeJS.Timeout | null>(null);
  const [isTrendingHovered, setIsTrendingHovered] = useState(false);

  // Auto-slide effect for trending carousel
  useEffect(() => {
    if (isTrendingHovered || trending.length <= 1) return;
    trendingAutoSlideTimer.current = setInterval(() => {
      scrollTrending("right");
    }, 3000);
    return () => {
      if (trendingAutoSlideTimer.current) clearInterval(trendingAutoSlideTimer.current);
    };
  }, [isTrendingHovered, trending.length]);

  // Reset timer on manual scroll
  const scrollTrending = (dir: "left" | "right") => {
    if (trendingRowRef.current) {
      trendingRowRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
    if (trendingAutoSlideTimer.current) {
      clearInterval(trendingAutoSlideTimer.current);
      trendingAutoSlideTimer.current = null;
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full flex flex-col items-center justify-center py-16 md:py-28 bg-gradient-to-br from-yellow-100 to-blue-50 overflow-hidden shadow-sm mb-12"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=40')] bg-cover bg-center opacity-10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 flex flex-col md:flex-row items-center gap-12 w-full max-w-6xl mx-auto px-4"
        >
          <motion.div className="flex-1 flex flex-col items-start justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 text-yellow-700 drop-shadow-lg"
            >
              Fashion finds under $50
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-700 mb-8 max-w-xl"
            >
              Shop the latest electronics, fashion, and home essentials. Unbeatable prices, fast shipping, and a seamless shopping experience.
            </motion.p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center items-center"
          >
            <Image src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80" alt="Fashion Banner" width={380} height={300} className="rounded-3xl shadow-2xl object-cover" />
          </motion.div>
        </motion.div>
      </motion.section>
      {/* Shop by Category Grid */}
      <section className="py-14 bg-white/80 border-t border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-blue-700 text-center"
          >
            Shop by Category
          </motion.h2>
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-8"
            >
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.04 } },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Link href={`/shop?category=${encodeURIComponent(cat.name)}`}>
                    <div className="group bg-blue-50 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center p-6 cursor-pointer hover:bg-blue-100">
                      <div className="w-20 h-20 mb-3 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-blue-200">
                        <Image src={cat.image} alt={cat.name} width={80} height={80} className="object-cover" />
                      </div>
                      <span className="font-semibold text-blue-700 group-hover:text-blue-900 text-center text-base mt-1">{cat.name}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      {/* Trending Now Row */}
      <section className="py-16 bg-gradient-to-b from-white/90 to-blue-50/60 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-blue-700 text-center"
          >
            Trending Now
          </motion.h2>
          <div className="relative group" onMouseEnter={() => setIsTrendingHovered(true)} onMouseLeave={() => setIsTrendingHovered(false)}>
            {/* Left Button */}
            {trending.length > 1 && (
              <button
                onClick={() => scrollTrending("left")}
                className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-blue-100 border border-blue-200 rounded-full p-2 shadow transition"
                style={{ display: 'flex' }}
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="w-7 h-7 text-blue-700" />
              </button>
            )}
            {/* Right Button */}
            {trending.length > 1 && (
              <button
                onClick={() => scrollTrending("right")}
                className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-blue-100 border border-blue-200 rounded-full p-2 shadow transition"
                style={{ display: 'flex' }}
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="w-7 h-7 text-blue-700" />
              </button>
            )}
            <AnimatePresence>
              <motion.div
                ref={trendingRowRef}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
              >
                {trending.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.04 } },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div className="min-w-[240px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center p-6 cursor-pointer hover:bg-blue-50">
                        <div className="w-36 h-36 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image src={item.imageUrl} alt={item.name} width={140} height={140} className="object-cover" />
                        </div>
                        <span className="font-semibold text-blue-800 text-center mb-2 text-lg">{item.name}</span>
                        <span className="text-green-600 font-bold text-2xl mb-3">${item.price.toFixed(2)}</span>
                        <button className="bg-blue-600 text-white px-7 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition text-base">Add to Cart</button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      {/* Shop for Home Essentials Row */}
      <section className="py-14 bg-white/80">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-blue-700 text-center"
          >
            Shop for Home Essentials
          </motion.h2>
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-8"
            >
              {homeEssentials.map((item, idx) => (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.04 } },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div className="bg-blue-50 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center p-6 cursor-pointer hover:bg-blue-100">
                      <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden bg-white flex items-center justify-center border-2 border-blue-200">
                        <Image src={item.imageUrl} alt={item.name} width={96} height={96} className="object-cover" />
                      </div>
                      <span className="font-semibold text-blue-700 text-center text-base mt-1">{item.name}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
