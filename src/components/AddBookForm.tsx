"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("image") as File | null;

    if (!file || file.size === 0) return toast.error("Please choose a book image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");

    setLoading(true);
    try {
      const image = await uploadImage(file);
      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify({
          title: fd.get("title"),
          author: fd.get("author"),
          category: fd.get("category"),
          totalCopies: fd.get("totalCopies"),
          description: fd.get("description"),
          addedByName: user?.name,
          image,
        }),
      });
      toast.success("Book added successfully!");
      form.reset();
      router.push("/my-books");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <h1 className="text-center text-3xl font-bold">Add a New Book</h1>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Book Title</span>
            <input name="title" required className="input w-full" placeholder="e.g. The Silent Garden" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Author Name</span>
            <input name="author" required className="input w-full" placeholder="Author name" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Category</span>
              <select name="category" required defaultValue="" className="select w-full">
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Total Copies</span>
              <input name="totalCopies" type="number" min={1} defaultValue={1} required className="input w-full" />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Book Image</span>
            <input name="image" type="file" accept="image/*" required className="file-input w-full" />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Short Description</span>
            <textarea name="description" required rows={4} className="textarea w-full" placeholder="What is this book about?" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Your Name</span>
              <input value={user?.name || ""} readOnly className="input w-full bg-base-200" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Your Email</span>
              <input value={user?.email || ""} readOnly className="input w-full bg-base-200" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Add Book"}
          </button>
        </form>
      </div>
    </section>
  );
}