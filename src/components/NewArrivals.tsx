"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/api";
import BookCard, { Book } from "./BookCard";
import Reveal from "./Reveal";
import Spinner from "./Spinner";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicFetch("/books?sort=newest&limit=6")
      .then((data) => setBooks(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setError("Could not load the latest books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <Reveal>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6e2e9] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#4a333d]">
            ✦ Fresh Off The Shelves
          </div>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            New Arrivals
          </h2>
          <p className="mt-3 text-base text-base-content/75">
            Discover the latest literary additions shared by our reading community, ready to borrow right now.
          </p>
        </div>
      </Reveal>

      {loading ? (
        <div className="py-12">
          <Spinner />
        </div>
      ) : error ? (
        <p className="py-8 text-center text-error">{error}</p>
      ) : books.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center">
          <p className="text-base-content/70">No books have been added yet. Be the first to share one!</p>
          <Link href="/add-book" className="btn btn-primary btn-sm mt-4 rounded-full px-6">
            Add a Book
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/books"
          className="btn btn-primary rounded-full px-8 font-semibold shadow-md transition hover:scale-105"
        >
          See All Books
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}