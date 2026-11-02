"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
};

export default function BookCard({ book }: { book: Book }) {
  const [imgError, setImgError] = useState(false);
  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <Reveal className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
        {/* Book cover figure */}
        <div className="relative flex w-full items-center justify-center bg-gradient-to-b from-base-200 to-base-100 px-8 pb-4 pt-6">
          {!imgError && book.image ? (
            <img
              src={book.image}
              alt={book.title}
              onError={() => setImgError(true)}
              className="aspect-[3/4] h-44 w-auto rounded-md object-cover shadow-lg ring-1 ring-black/10 transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[3/4] h-44 flex-col items-center justify-center rounded-md bg-gradient-to-br from-[#b8cfb3]/20 via-base-200 to-[#f6e2e9]/30 p-4 text-center shadow-lg ring-1 ring-black/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <p className="mt-2 line-clamp-3 font-serif text-xs font-semibold text-base-content/80">
                {book.title}
              </p>
            </div>
          )}

          {/* Availability pill on cover */}
          <div className="absolute right-3 top-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur-md ${
                isAvailable
                  ? "bg-primary/90 text-primary-content"
                  : "bg-error/90 text-white"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {isAvailable ? `${book.availableCopies} Copies` : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="inline-block rounded-full bg-[#f6e2e9] px-2 py-0.5 text-[11px] font-semibold text-[#4a333d]">
              {book.category}
            </span>
            <span className="text-[11px] text-base-content/60">
              Total: {book.totalCopies}
            </span>
          </div>

          <h3 className="line-clamp-1 font-serif text-base font-bold text-base-content transition-colors group-hover:text-primary">
            {book.title}
          </h3>

          <p className="line-clamp-1 text-xs font-medium text-base-content/70">
            by <span className="text-base-content">{book.author}</span>
          </p>

          <p className="mt-1.5 line-clamp-2 text-xs text-base-content/60">
            {book.description || "A wonderful read waiting to be discovered."}
          </p>

          <div className="mt-auto pt-3">
            <Link
              href={`/books/${book._id}`}
              className="btn btn-primary btn-sm w-full rounded-lg font-medium shadow-sm transition duration-200 group-hover:shadow"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}