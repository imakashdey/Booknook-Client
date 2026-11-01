"use client";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/api";
import BookCard, { Book } from "./BookCard";
import Spinner from "./Spinner";

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicFetch("/books")
      .then(setBooks)
      .catch(() => setError("Could not load books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold">All Books</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-error">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-center">No books yet. Be the first to add one!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </section>
  );
}