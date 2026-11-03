"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const requested = searchParams.get("callbackUrl") || "/";
  const callbackUrl =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      const msg = error.message || "Invalid email or password";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Welcome back to BookNook!");
    router.push(callbackUrl);
    router.refresh();
  };


  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#84a282]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#84a282]">
            ✦ Welcome Back
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Login to BookNook
          </h1>
          <p className="mt-2 text-xs text-base-content/70">
            Sign in to borrow, return, and catalog books in your library.
          </p>
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-error/10 p-3.5 text-xs font-medium text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
              Email Address
            </span>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
            />
          </label>

          <label className="block space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
                Password
              </span>
              <button
                type="button"
                onClick={() => toast("Password reset is coming soon. For now, please sign in with Google or contact support.")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-2xl py-3 font-semibold shadow-md transition hover:scale-[1.01]"
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300/70" />
            </div>
            <span className="relative bg-base-100 px-3 text-xs font-semibold uppercase text-base-content/50">
              OR
            </span>
          </div>

          <GoogleButton callbackURL={callbackUrl} />


          <p className="pt-2 text-center text-xs text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}