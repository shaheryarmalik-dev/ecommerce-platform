"use client";
import Link from "next/link";
const categories = ["All", "Electronics", "Wearables", "Audio"];
const selected = "All"; // For demo, highlight 'All' as selected

export default function CategoryFilters() {
  return (
    <div className="flex gap-3 py-2 px-2 bg-blue-50 rounded-xl shadow-sm">
      {categories.map((cat) => (
        <Link key={cat} href="/">
          <button
            className={`px-4 py-1 rounded-full font-semibold transition shadow-sm
              ${selected === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"}
            `}
          >
            {cat}
          </button>
        </Link>
      ))}
    </div>
  );
} 