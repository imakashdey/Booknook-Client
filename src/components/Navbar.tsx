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
    <header className="navbar sticky top-0 z-50 bg-base-100 px-4 shadow-sm lg:px-8">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-square" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={closeDropdown} className={isActive(l.href) ? "menu-active" : ""}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Logo />
      </div>

      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={isActive(l.href) ? "menu-active" : ""}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="navbar-end gap-2">
        <ThemeToggle />
        {isPending ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="User menu">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-content ring ring-primary ring-offset-2 ring-offset-base-100">
                {user.image ? (
                  <img src={user.image} alt={user.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
              <li className="menu-title px-4 py-2 font-semibold text-base-content">{user.name}</li>
              <li>
                <Link href="/profile" onClick={closeDropdown}>My Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}