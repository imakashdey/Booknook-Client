"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/uploadImage";
import GoogleButton from "./GoogleButton";

function validatePassword(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter (A-Z)";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter (a-z)";
  return "";
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const pass = String(formData.get("password") || "");
    const file = formData.get("photo") as File | null;
    const urlFromInput = String(formData.get("photoUrl") || "").trim();

    const err = validatePassword(pass);
    setPasswordError(err);
    if (err) {
      toast.error(err);
      return;
    }

    let finalImageUrl = urlFromInput || photoUrl;

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be smaller than 5 MB");
        return;
      }
      setLoading(true);
      try {
        finalImageUrl = await uploadImage(file);
      } catch {
        finalImageUrl = urlFromInput || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || "reader")}`;
      }
    } else if (!finalImageUrl) {
      finalImageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || "reader")}`;
    }

    setLoading(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password: pass,
        image: finalImageUrl,
      });

      if (authError) {
        const msg = authError.message || "Registration failed. Please try again.";
        setFormError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6e2e9] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#4a333d]">
            ✦ Join the Community
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Create an Account
          </h1>
          <p className="mt-2 text-xs text-base-content/70">
            Sign up to share, borrow, and read books freely with BookNook.
          </p>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-error/10 p-3.5 text-xs font-medium text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
              Full Name *
            </span>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. John Doe"
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
            />
          </label>

          {/* Email */}
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
              Email Address *
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
            />
          </label>

          {/* Photo URL or Upload */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
              Photo URL / Avatar
            </span>
            <input
              name="photoUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-base-content/60">Or upload:</span>
              <input
                name="photo"
                type="file"
                accept="image/*"
                className="file-input file-input-xs rounded-lg border-base-300 bg-base-200/40 text-xs"
              />
            </div>
          </div>

          {/* Password with Validation */}
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/75">
              Password *
            </span>
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(validatePassword(e.target.value));
              }}
              placeholder="Create a strong password"
              className={`input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary ${
                passwordError ? "border-error focus:border-error" : ""
              }`}
            />
          </label>

          {/* Password Validation Checklist */}
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-3 text-xs space-y-1">
            <div className="font-semibold text-base-content/70 mb-1">Password Requirements:</div>
            <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-success font-medium" : "text-base-content/60"}`}>
              <span>{hasMinLength ? "✓" : "○"}</span> At least 6 characters
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-success font-medium" : "text-base-content/60"}`}>
              <span>{hasUppercase ? "✓" : "○"}</span> At least one uppercase letter (A-Z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-success font-medium" : "text-base-content/60"}`}>
              <span>{hasLowercase ? "✓" : "○"}</span> At least one lowercase letter (a-z)
            </div>
          </div>

          {passwordError && (
            <p className="text-xs font-medium text-error">{passwordError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-2xl py-3 font-semibold shadow-md transition hover:scale-[1.01]"
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300/70" />
            </div>
            <span className="relative bg-base-100 px-3 text-xs font-semibold uppercase text-base-content/50">
              OR
            </span>
          </div>

          <GoogleButton callbackURL="/" />

          <p className="pt-2 text-center text-xs text-base-content/70">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}