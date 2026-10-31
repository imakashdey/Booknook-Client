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
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  return "";
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const file = formData.get("photo") as File | null;

    const error = validatePassword(password);
    setPasswordError(error);
    if (error) return;

    if (!file || file.size === 0) {
      toast.error("Please choose a profile photo");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be smaller than 5 MB");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage(file);
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
      });
      if (authError) {
        toast.error(authError.message || "Registration failed. Please try again.");
        return;
      }
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <h1 className="text-center text-3xl font-bold">Create your account</h1>
          <p className="text-center text-sm text-base-content/70">
            Join BookNook to add, borrow and return books.
          </p>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Name</span>
            <input name="name" type="text" required placeholder="Your full name" className="input w-full" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input w-full" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Profile Photo</span>
            <input name="photo" type="file" accept="image/*" required className="file-input w-full" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input name="password" type="password" required placeholder="Create a password" className="input w-full" />
            {passwordError && <p className="text-sm text-error">{passwordError}</p>}
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Register"}
          </button>

          <div className="divider my-0">OR</div>
          <GoogleButton callbackURL="/" />

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}