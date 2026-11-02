"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/api";
import { Book } from "./BookCard";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Add a Book",
    desc: "Catalog books from your personal shelves. Enter title, author, category, and copies to share with other readers.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    badgeColor: "bg-[#84a282] text-white",
  },
  {
    n: "02",
    title: "Borrow Instantly",
    desc: "Browse our dynamic library, inspect details, and borrow available copies for 7 days with a single click.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badgeColor: "bg-[#b8cfb3] text-[#1c2a1e]",
  },
  {
    n: "03",
    title: "Return & Repeat",
    desc: "Finished reading? Return your borrowed book from 'My Borrows' anytime to automatically replenish available copies.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    badgeColor: "bg-[#f6e2e9] text-[#4a333d]",
  },
];

const baseCategories = [
  { title: "Fiction", desc: "Novels, magical realism & literary fiction", icon: "📖", color: "bg-[#f6e2e9]/50" },
  { title: "Science", desc: "Physics, astronomy, nature & tech wonders", icon: "🔬", color: "bg-[#b8cfb3]/40" },
  { title: "History", desc: "Ancient civilizations, memoirs & eras", icon: "🏛️", color: "bg-[#84a282]/20" },
  { title: "Kids", desc: "Bedtime tales, adventures & picture books", icon: "🎨", color: "bg-[#f6e2e9]/50" },
  { title: "Others", desc: "Poetry, essays, art & philosophy", icon: "☕", color: "bg-[#b8cfb3]/40" },
];

const highlights = [
  { icon: "📚", title: "Community Powered", desc: "Every book on the shelf was added by a real reader, so the library grows with its members." },
  { icon: "⏱️", title: "7-Day Loans", desc: "Borrow for a full week, long enough to enjoy a book without rushing." },
  { icon: "🔔", title: "Live Availability", desc: "Copies update the moment a book is borrowed or returned, so you always see what is free." },
  { icon: "🤝", title: "No Late Fines", desc: "Return a book from My Borrows whenever you finish. No fees, no stress." },
];

export default function HomeSections() {
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    publicFetch("/books")
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  // Real book counts per category (custom categories get their own card)
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    (books || []).forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    const fixed = baseCategories.map((c) => ({ ...c, count: counts[c.title] || 0 }));
    const custom = Object.keys(counts)
      .filter((name) => !baseCategories.some((c) => c.title === name))
      .map((name) => ({
        title: name,
        desc: "Shared by our community readers",
        icon: "📚",
        color: "bg-[#f6e2e9]/50",
        count: counts[name],
      }));
    return [...fixed, ...custom];
  }, [books]);

  return (
    <>
      {/* Section 1: How Borrowing Works */}
      <section className="relative border-y border-base-300/60 bg-base-200/50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-[#b8cfb3]/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#1c2a1e]">
                ✦ Simple Three-Step Flow
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                How Borrowing Works
              </h2>
              <p className="mt-3 text-base text-base-content/75">
                Our community library is founded on mutual trust: add a book, borrow a book, return a book.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} className="h-full" delay={i * 0.12}>
                <div className="group relative flex h-full flex-col rounded-3xl border border-base-300/80 bg-base-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-primary/40 transition-colors group-hover:text-primary">
                      {s.n}
                    </span>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.badgeColor} shadow-sm`}>
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-base-content">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-base-content/70">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Top Categories (real counts) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-[#f6e2e9] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#4a333d]">
                ✦ Curated Shelves
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                Explore Top Categories
              </h2>
              <p className="mt-3 text-base text-base-content/75">
                Whether you crave fantastical worlds, historic voyages, or bedtime whimsy, we have a shelf for you.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c, i) => (
              <Reveal key={c.title} className="h-full" delay={i * 0.08}>
                <Link
                  href={`/books?category=${encodeURIComponent(c.title)}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-base-300/70 bg-base-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div>
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${c.color}`}>
                      {c.icon}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-base-content transition-colors group-hover:text-primary">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-base-content/65">{c.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-base-300/60 pt-3 text-xs font-semibold text-primary">
                    <span>
                      {books === null ? "…" : `${c.count} ${c.count === 1 ? "Book" : "Books"}`}
                    </span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why BookNook + CTA */}
      <section className="border-t border-base-300/60 bg-gradient-to-b from-base-200/40 to-base-100 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-[#84a282]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#84a282]">
                ✦ Why BookNook
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                Why Readers Love BookNook
              </h2>
              <p className="mt-3 text-base text-base-content/75">
                A calm, simple library built around sharing, trust and the joy of reading.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <Reveal key={h.title} className="h-full" delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#84a282]/15 text-2xl">
                    {h.icon}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-base-content">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/70">{h.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Library Community CTA banner */}
          <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#84a282] via-[#84a282]/95 to-[#6b8c69] p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold sm:text-3xl">Have books collecting dust?</h3>
                <p className="max-w-xl text-white/90">
                  Join our readers by listing your books. You retain ownership while inspiring fellow bibliophiles.
                </p>
              </div>
              <Link
                href="/add-book"
                className="btn btn-secondary rounded-full border-none px-8 font-semibold text-[#4a333d] shadow-lg transition hover:scale-105"
              >
                Add Your First Book
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}