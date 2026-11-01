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

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function MyBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");

  useEffect(() => {
    apiFetch("/borrows")
      .then(setBorrows)
      .catch(() => toast.error("Could not load your borrows"))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (id: string) => {
    setReturningId(id);
    try {
      await apiFetch(`/borrows/${id}`, { method: "DELETE" });
      setBorrows((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book returned. Thank you!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Return failed");
    } finally {
      setReturningId("");
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">My Borrows</h1>
      {borrows.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">You have not borrowed any books yet.</p>
          <Link href="/books" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr><th>Image</th><th>Title</th><th>Borrow Date</th><th>Return Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b._id}>
                  <td><img src={b.bookImage} alt={b.bookTitle} className="h-16 w-12 rounded object-cover" /></td>
                  <td className="font-medium">{b.bookTitle}</td>
                  <td>{fmt(b.borrowDate)}</td>
                  <td>{fmt(b.returnDate)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" disabled={returningId === b._id} onClick={() => handleReturn(b._id)}>
                      {returningId === b._id ? <span className="loading loading-spinner loading-xs" /> : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}