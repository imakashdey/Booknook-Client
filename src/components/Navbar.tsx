"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeDropdown = () =>
    (document.activeElement as HTMLElement | null)?.blur();

  const handleLogout = async () => {
    closeDropdown();
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/90 backdrop-blur-md transition-colors">
      <div className="navbar mx-auto max-w-7xl px-4 lg:px-8">
        <div className="navbar-start gap-2">
          {/* Mobile drawer / dropdown */}
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-square btn-sm"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-20 mt-3 w-56 rounded-2xl border border-base-300 bg-base-100 p-2.5 shadow-xl"
            >
              <li className="menu-title px-3 py-1 font-semibold text-primary">Menu</li>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={closeDropdown}
                    className={`rounded-lg py-2 font-medium transition ${
                      isActive(l.href)
                        ? "bg-primary text-primary-content"
                        : "text-base-content/80 hover:bg-base-200"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1 rounded-full border border-base-300/70 bg-base-200/50 p-1">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/80 hover:bg-base-100 hover:text-base-content"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Navbar End / Auth / Theme */}
        <div className="navbar-end gap-2.5">
          <ThemeToggle />

          {isPending ? (
            <span className="loading loading-spinner loading-sm text-primary" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar transition hover:scale-105"
                aria-label="User account menu"
              >
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary font-serif font-bold text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-sm">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{(user.name?.charAt(0) || "U").toUpperCase()}</span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-20 mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title border-b border-base-300/60 px-4 py-2">
                  <div className="text-xs uppercase tracking-wider text-base-content/60">Signed in as</div>
                  <div className="truncate font-serif text-base font-bold text-base-content">{user.name}</div>
                  <div className="truncate text-xs text-base-content/60">{user.email}</div>
                </li>
                <li className="mt-1">
                  <Link href="/profile" onClick={closeDropdown} className="py-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/my-books" onClick={closeDropdown} className="py-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Added Books
                  </Link>
                </li>
                <li>
                  <Link href="/my-borrows" onClick={closeDropdown} className="py-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Borrowed Books
                  </Link>
                </li>
                <div className="my-1 border-t border-base-300/60" />
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2 font-medium text-error hover:bg-error/10 hover:text-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="btn btn-ghost btn-sm rounded-xl font-medium text-base-content hover:bg-base-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm rounded-xl font-medium shadow-sm transition hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}