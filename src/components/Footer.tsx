import Link from "next/link";
import Logo from "./Logo";

const socials = [
  {
    name: "X",
    href: "https://x.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    name: "GitHub",
    href: "https://github.com",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300/70 bg-base-200/60 transition-colors">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-base-content/75">
            BookNook is a cozy online community library. Add a book, borrow a book, and return a book with ease.
          </p>
          
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-serif text-base font-bold text-base-content">Navigation</h3>
          <ul className="space-y-2 text-sm text-base-content/75">
            <li>
              <Link href="/" className="transition hover:text-primary">Home</Link>
            </li>
            <li>
              <Link href="/books" className="transition hover:text-primary">All Books</Link>
            </li>
            <li>
              <Link href="/add-book" className="transition hover:text-primary">Add a Book</Link>
            </li>
            <li>
              <Link href="/my-borrows" className="transition hover:text-primary">My Borrows</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-serif text-base font-bold text-base-content">Contact & Hours</h3>
          <div className="space-y-2 text-sm text-base-content/75">
            <p className="flex items-center gap-2">
              <span className="text-primary">✉</span> support@booknook.app
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">☎</span> +880 1700 000000
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">⚲</span> Dhaka, Bangladesh
            </p>
            <p className="text-xs text-base-content/60">Digital Shelves Open 24/7</p>
          </div>
        </div>

        {/* Socials */}
        <div className="space-y-3">
          <h3 className="font-serif text-base font-bold text-base-content">Connect With Us</h3>
          <p className="text-xs text-base-content/70">
            Join our book discussions, reading challenges, and community updates.
          </p>
          <div className="flex gap-2.5 pt-1">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="btn btn-circle btn-sm border-base-300 bg-base-100 hover:border-primary hover:bg-primary hover:text-primary-content transition shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

<div className="border-t border-base-300/60 py-3 text-center text-xs font-medium text-base-content/60">
        © 2026 BookNook. Built with care for book lovers everywhere. All rights reserved.
      </div>
    </footer>
  );
}