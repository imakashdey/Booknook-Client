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

  useEffect(() => {
    publicFetch("/books?sort=newest&limit=6")
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <Reveal>
        <h2 className="mb-8 text-center text-3xl font-bold">New Arrivals</h2>
      </Reveal>
      {loading ? (
        <Spinner />
      ) : books.length === 0 ? (
        <p className="text-center">No books added yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/books" className="btn btn-primary">See All Books</Link>
      </div>
    </section>
  );
}