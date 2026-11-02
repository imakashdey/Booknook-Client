"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import Spinner from "./Spinner";

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
};

const fmt = (d: string) => {
  if (!d) return "N/A";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

export default function MyBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");

  useEffect(() => {
    apiFetch("/borrows")
      .then((data) => {
        setBorrows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setBorrows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (id: string, title: string) => {
    setReturningId(id);
    try {
      await apiFetch(`/borrows/${id}`, { method: "DELETE" });
      setBorrows((prev) => prev.filter((b) => b._id !== id));
      toast.success(`"${title}" returned successfully. Thank you!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to return book");
    } finally {
      setReturningId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-[#f6e2e9] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#4a333d]">
            ✦ Reader Loan Shelf
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            My Borrows
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            Active borrowed books registered to your account. Return anytime when finished reading.
          </p>
        </div>

        <Link
          href="/books"
          className="btn btn-primary rounded-xl px-6 font-semibold shadow-sm transition hover:scale-105"
        >
          Browse More Books
        </Link>
      </div>

      {/* Info Notice */}
      <div className="my-8 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs text-base-content/80">
        <span className="text-base text-primary">💡</span>
        <span>
          <strong>7-Day Loan Policy:</strong> When you return a book, its available copy count is immediately restored so other members can read it.
        </span>
      </div>

      {borrows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300/90 bg-base-100/50 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6e2e9] text-3xl text-[#4a333d]">
            📚
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-base-content">
            No borrowed books right now
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
            Your reading shelf is clear. Explore the library collection and borrow a book for 7 days!
          </p>
          <Link
            href="/books"
            className="btn btn-primary btn-sm mt-6 rounded-xl px-6 font-semibold shadow-sm"
          >
            Browse Library Books
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/60 text-xs font-semibold uppercase text-base-content/70">
                <tr>
                  <th className="py-4">Book</th>
                  <th>Borrow Date</th>
                  <th>Return Due Date</th>
                  <th>Loan Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/50 text-sm">
                {borrows.map((b) => (
                  <tr key={b._id} className="hover:bg-base-200/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={b.bookImage}
                          alt={b.bookTitle}
                          className="h-16 w-12 rounded-lg object-cover shadow-sm"
                        />
                        <div>
                          <Link
                            href={`/books/${b.bookId}`}
                            className="font-serif font-bold text-base-content hover:text-primary transition-colors"
                          >
                            {b.bookTitle}
                          </Link>
                          <div className="text-xs text-base-content/65">ID: {b.bookId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-base-content/80 font-medium">
                      {fmt(b.borrowDate)}
                    </td>
                    <td className="text-xs font-semibold text-primary">
                      {fmt(b.returnDate)}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b8cfb3]/40 px-2.5 py-1 text-xs font-semibold text-[#1c2a1e]">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Active Loan
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-primary btn-sm rounded-xl font-medium shadow-sm transition hover:scale-105"
                        disabled={returningId === b._id}
                        onClick={() => handleReturn(b._id, b.bookTitle)}
                      >
                        {returningId === b._id ? (
                          <>
                            <span className="loading loading-spinner loading-xs" />
                            Returning...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Return Book
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}