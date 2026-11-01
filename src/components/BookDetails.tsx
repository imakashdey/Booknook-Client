"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Book } from "./BookCard";
import Spinner from "./Spinner";

export default function BookDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const modalRef = useRef<HTMLDialogElement>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    apiFetch(`/books/${id}`)
      .then(setBook)
      .catch((e) => setError(e.message || "Book not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }
    setBorrowing(true);
    try {
      await apiFetch("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId: id, userName: user.name }),
      });
      toast.success("Book borrowed successfully!");
      modalRef.current?.close();
      setBook((b) => (b ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to borrow");
      modalRef.current?.close();
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <Spinner />;
  if (error || !book)
    return <p className="py-20 text-center text-error">{error || "Book not found"}</p>;

  const unavailable = book.availableCopies <= 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <img src={book.image} alt={book.title} className="h-96 w-full rounded-box object-cover shadow-lg" />
        <div className="space-y-3">
          <span className="badge badge-primary badge-outline">{book.category}</span>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-lg">by {book.author}</p>
          <p className="text-base-content/80">{book.description}</p>
          <p className="text-sm">
            Added by <span className="font-semibold">{book.addedByName}</span> ({book.addedByEmail})
          </p>
          <p className="text-sm">
            Available copies: <span className="font-semibold">{book.availableCopies}</span> / {book.totalCopies}
          </p>
          <button
            className="btn btn-primary"
            disabled={unavailable}
            onClick={() => modalRef.current?.showModal()}
          >
            {unavailable ? "Not Available" : "Borrow This Book"}
          </button>
        </div>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box space-y-3">
          <h3 className="text-xl font-bold">Borrow “{book.title}”</h3>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Name</span>
            <input value={user?.name || ""} readOnly className="input w-full bg-base-200" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input value={user?.email || ""} readOnly className="input w-full bg-base-200" />
          </label>
          <p className="text-sm text-base-content/70">The book is due back in 7 days.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current?.close()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBorrow} disabled={borrowing}>
              {borrowing ? <span className="loading loading-spinner loading-sm" /> : "Confirm Borrow"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </section>
  );
}