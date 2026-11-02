"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-sm text-base-content/70">Please log in to view your profile.</p>
        <Link href="/login" className="btn btn-primary btn-sm mt-4 rounded-xl">
          Login
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 lg:px-8">
      <title>BookNook | My Profile</title>

      <div className="overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 shadow-sm">
        {/* Cover banner */}
        <div className="h-32 bg-gradient-to-r from-[#84a282]/30 via-[#b8cfb3]/40 to-[#f6e2e9]/50" />

        <div className="relative px-6 pb-8 pt-0 sm:px-10">
          {/* Avatar */}
          <div className="-mt-16 mb-4 flex items-end justify-between">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-primary font-serif text-3xl font-bold text-primary-content shadow-md">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{(user.name?.charAt(0) || "U").toUpperCase()}</span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm rounded-xl border-base-300 text-error hover:border-error hover:bg-error hover:text-white"
            >
              Sign Out
            </button>
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-base-content sm:text-3xl">
              {user.name}
            </h1>
            <p className="text-sm text-base-content/70">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#84a282]/15 px-3 py-0.5 text-xs font-semibold text-[#84a282]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Verified Reader
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/my-books"
              className="group flex items-center justify-between rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition hover:border-primary/50 hover:bg-base-200/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  📖
                </div>
                <div>
                  <div className="font-semibold text-sm text-base-content">My Added Books</div>
                  <div className="text-xs text-base-content/60">View & edit contributed titles</div>
                </div>
              </div>
              <span className="text-primary transition group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/my-borrows"
              className="group flex items-center justify-between rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition hover:border-primary/50 hover:bg-base-200/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6e2e9] text-[#4a333d]">
                  🔖
                </div>
                <div>
                  <div className="font-semibold text-sm text-base-content">My Borrowed Books</div>
                  <div className="text-xs text-base-content/60">Manage active loans & returns</div>
                </div>
              </div>
              <span className="text-primary transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}