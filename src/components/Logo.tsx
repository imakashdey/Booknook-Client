import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-content shadow-sm transition group-hover:bg-primary/90">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <div className="flex items-baseline">
        <span className="font-serif text-2xl font-bold tracking-tight text-base-content">
          Book<span className="text-primary">Nook</span>
        </span>
        <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[#f6e2e9]" />
      </div>
    </Link>
  );
}