"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
      .then((data) => {
        if (data && data._id) setBook(data);
        else setError("Book not found");
      })
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
      setBook((b) => (b ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));
      router.push("/my-borrows");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to borrow book");
      modalRef.current?.close();
    } finally {
      setBorrowing(false);
    }
  };

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 7);
  const formattedReturnDate = returnDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-3xl text-error">
          ⚠
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold">Book Not Found</h2>
        <p className="mt-2 text-sm text-base-content/70">{error || "The requested book could not be located."}</p>
        <Link href="/books" className="btn btn-primary btn-sm mt-6 rounded-xl">
          Back to All Books
        </Link>
      </div>
    );
  }

  const unavailable = (book.availableCopies ?? 0) <= 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-xs font-medium text-base-content/60">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-primary">All Books</Link>
        <span>/</span>
        <span className="line-clamp-1 text-base-content">{book.title}</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 shadow-sm">
        <div className="grid gap-10 p-6 md:grid-cols-12 md:p-10 lg:gap-14">
          {/* Cover Column */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-base-300/70 bg-base-200 shadow-md">
              <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
              <div className="absolute right-3 top-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${
                    !unavailable ? "bg-primary/95 text-primary-content" : "bg-error/95 text-white"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {!unavailable ? `${book.availableCopies} Copies Available` : "Out of Copies"}
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="mt-6 space-y-3 rounded-2xl border border-base-300/60 bg-base-200/40 p-4 text-xs">
              <div className="flex justify-between border-b border-base-300/50 py-1">
                <span className="text-base-content/60">Loan Duration:</span>
                <span className="font-semibold text-base-content">7 Days</span>
              </div>
              <div className="flex justify-between border-b border-base-300/50 py-1">
                <span className="text-base-content/60">Late Fines:</span>
                <span className="font-semibold text-success">Free</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-base-content/60">Total Library Stock:</span>
                <span className="font-semibold text-base-content">{book.totalCopies} copies</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between md:col-span-7 lg:col-span-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f6e2e9] px-3 py-1 text-xs font-semibold text-[#4a333d]">
                  {book.category}
                </span>
                <span className="text-xs text-base-content/60">
                  Added on{" "}
                  {new Date(book.createdAt || Date.now()).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg font-medium text-base-content/80">
                  Written by <span className="font-semibold text-primary">{book.author}</span>
                </p>
              </div>

              {/* Contributor Card */}
              <div className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/30 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#84a282]/20 font-serif font-bold text-primary">
                  {(book.addedByName?.charAt(0) || "U").toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Contributed to BookNook by</div>
                  <div className="text-sm font-semibold text-base-content">
                    {book.addedByName || "Community Reader"}
                  </div>
                  {book.addedByEmail && (
                    <div className="text-xs text-base-content/60">{book.addedByEmail}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-base-content">About this Book</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-base-content/80">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 border-t border-base-300/70 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs text-base-content/60">Availability Status</div>
                  <div className="font-serif text-lg font-bold text-base-content">
                    {book.availableCopies} of {book.totalCopies} copies in library
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      router.push(`/login?callbackUrl=/books/${id}`);
                      return;
                    }
                    modalRef.current?.showModal();
                  }}
                  disabled={unavailable}
                  className={`btn rounded-2xl px-8 font-semibold shadow-md transition sm:w-auto ${
                    unavailable
                      ? "btn-disabled cursor-not-allowed bg-base-300 text-base-content/40"
                      : "btn-primary hover:scale-[1.02]"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {unavailable ? "Not Available" : "Borrow This Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-3xl border border-base-300 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#84a282]/15 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-base-content">Borrow Confirmation</h3>
              <p className="text-xs text-base-content/60">Loan duration: 7 days</p>
            </div>
          </div>

          <div className="my-5 space-y-3 rounded-2xl border border-base-300/80 bg-base-200/50 p-4 text-xs">
            <div className="flex justify-between border-b border-base-300/50 py-1">
              <span className="text-base-content/60">Selected Book:</span>
              <span className="font-semibold text-base-content">{book.title}</span>
            </div>
            <div className="flex justify-between border-b border-base-300/50 py-1">
              <span className="text-base-content/60">Author:</span>
              <span className="font-medium text-base-content">{book.author}</span>
            </div>
            <div className="flex justify-between border-b border-base-300/50 py-1">
              <span className="text-base-content/60">Borrow Date:</span>
              <span className="font-medium text-base-content">
                {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-base-content/60">Due Return Date:</span>
              <span className="font-semibold text-primary">{formattedReturnDate}</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBorrow();
            }}
            className="space-y-4"
          >
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-base-content/80">Borrower Name (Read-only)</span>
              <input
                value={user?.name || ""}
                readOnly
                className="input w-full rounded-xl border-base-300 bg-base-200/70 text-sm font-medium"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold text-base-content/80">Borrower Email (Read-only)</span>
              <input
                value={user?.email || ""}
                readOnly
                className="input w-full rounded-xl border-base-300 bg-base-200/70 text-sm font-medium"
              />
            </label>

            <p className="text-xs leading-relaxed text-base-content/65">
              By confirming, this book will be registered under your account in{" "}
              <span className="font-semibold text-primary">My Borrows</span>. Please return it when finished so other
              readers can enjoy it!
            </p>

            <div className="modal-action pt-2">
              <button
                type="button"
                className="btn btn-ghost rounded-xl font-medium"
                onClick={() => modalRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={borrowing}
                className="btn btn-primary rounded-xl px-6 font-semibold shadow-md"
              >
                {borrowing ? <span className="loading loading-spinner loading-sm" /> : "Confirm Borrow"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
}