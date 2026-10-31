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

  // only allow redirects inside our own site
  const requested = searchParams.get("callbackUrl") || "/";
  const callbackUrl =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <section className="flex justify-center px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <h1 className="text-center text-3xl font-bold">Login to BookNook</h1>
          <p className="text-center text-sm text-base-content/70">
            Welcome back! Log in to borrow and manage your books.
          </p>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input w-full" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input w-full" />
            <button
              type="button"
              onClick={() => toast("Password reset is not available yet.")}
              className="link link-hover text-sm"
            >
              Forgot password?
            </button>
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Login"}
          </button>

          <div className="divider my-0">OR</div>
          <GoogleButton callbackURL={callbackUrl} />

          <p className="text-center text-sm">
            New to BookNook?{" "}
            <Link href="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}