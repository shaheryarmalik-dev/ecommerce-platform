"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const categories = ["All", "Electronics", "Wearables", "Audio", "Home"];

interface SearchBarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  query: string;
  setQuery: (q: string) => void;
  suggestions?: Array<{ id: string; name: string }>;
  onQueryChange?: (q: string) => void;
  onSuggestionClick?: (id: string) => void;
}

export default function SearchBar({ selectedCategory, setSelectedCategory, query, setQuery, suggestions = [], onQueryChange, onSuggestionClick }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <form className="w-full flex items-center bg-white rounded-lg shadow px-2 py-1 gap-2" onSubmit={e => { e.preventDefault(); onQueryChange && onQueryChange(query); }}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-gray-100 text-gray-700 rounded-l-lg px-3 py-2 border-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onQueryChange && onQueryChange(e.target.value); }}
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base px-2"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 flex items-center justify-center transition"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>
      {suggestions.length > 0 && query && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 mt-1 max-h-56 overflow-y-auto">
          {suggestions.map(s => (
            <li
              key={s.id}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
              onMouseDown={() => onSuggestionClick && onSuggestionClick(s.id)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 