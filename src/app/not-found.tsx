import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f6e2e9] via-[#b8cfb3]/40 to-[#84a282]/20 shadow-inner">
          <span className="font-serif text-5xl font-extrabold text-primary">404</span>
        </div>

        <div>
          <span className="inline-block rounded-full bg-[#f6e2e9] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#4a333d]">
            ✦ Shelf Not Found
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            This Page Has Gone Missing
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-base-content/75">
            The chapter or shelf you are trying to visit does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn btn-primary rounded-xl px-7 font-semibold shadow-md transition hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            href="/books"
            className="btn btn-outline rounded-xl border-base-300 font-semibold hover:border-primary hover:bg-base-200"
          >
            Browse All Books
          </Link>
        </div>
      </div>
    </section>
  );
}