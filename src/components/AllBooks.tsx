"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { publicFetch } from "@/lib/api";
import BookCard, { Book } from "./BookCard";
import Spinner from "./Spinner";

const baseCategories = ["Fiction", "Science", "History", "Kids", "Others"];

type SortKey = "newest" | "title" | "copies";

export default function AllBooks() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  useEffect(() => {
    publicFetch("/books")
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Fixed categories + any custom category found in the books
  const categories = useMemo(() => {
    const extra = Array.from(new Set(books.map((b) => b.category))).filter(
      (c) => c && !baseCategories.includes(c)
    );
    return ["All", ...baseCategories, ...extra];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        const matchesCat =
          selectedCategory === "All" ||
          b.category.toLowerCase() === selectedCategory.toLowerCase();
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "copies") return (b.availableCopies ?? 0) - (a.availableCopies ?? 0);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [books, selectedCategory, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Page Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block rounded-full bg-[#84a282]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#84a282]">
          ✦ Complete Collection
        </span>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl md:text-5xl">
          All Books
        </h1>
        <p className="mt-3 text-base text-base-content/75">
          Browse through all community-contributed books. Search by title or author, filter by category, and borrow your next read.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-10 space-y-4 rounded-3xl border border-base-300/80 bg-base-100 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 pl-11 text-sm focus:border-primary focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/50 hover:text-base-content"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs font-medium text-base-content/70">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="select select-sm rounded-xl border-base-300 bg-base-200 text-xs font-medium focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="copies">Available Copies</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-t border-base-300/60 pt-4">
          <span className="mr-1 text-xs font-medium text-base-content/60">Category:</span>
          {categories.map((cat) => {
            const active = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-primary text-primary-content shadow-sm"
                    : "bg-base-200 text-base-content/75 hover:bg-base-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      {!loading && !error && (
        <div className="mb-6 mt-8 flex items-center justify-between text-sm text-base-content/70">
          <div>
            Showing <span className="font-semibold text-base-content">{filteredBooks.length}</span>{" "}
            {filteredBooks.length === 1 ? "book" : "books"}
            {selectedCategory !== "All" && (
              <span> in <span className="font-semibold text-primary">{selectedCategory}</span></span>
            )}
            {searchTerm && <span> matching &ldquo;{searchTerm}&rdquo;</span>}
          </div>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Content grid */}
      {loading ? (
        <div className="py-20">
          <Spinner />
        </div>
      ) : error ? (
        <p className="py-16 text-center text-error">{error}</p>
      ) : filteredBooks.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-base-300 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-3xl">
            📚
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold">No books found</h3>
          <p className="mt-2 text-sm text-base-content/70">
            {books.length === 0
              ? "No books have been added yet. Be the first to add one!"
              : "We couldn't find any books matching your current filters. Try different keywords."}
          </p>
          {books.length > 0 && (
            <button onClick={resetFilters} className="btn btn-primary btn-sm mt-6 rounded-xl font-medium">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* 3 cards per row on desktop as required */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </section>
  );
}