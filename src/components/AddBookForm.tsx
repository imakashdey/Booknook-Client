"use client";
/* eslint-disable @next/next/no-img-element */
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
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("image") as File | null;
    const urlInput = ((fd.get("imageUrl") as string) || "").trim();

    if ((!file || file.size === 0) && !urlInput) {
      return toast.error("Please provide a book image (upload file or paste URL)");
    }
    if (file && file.size > 5 * 1024 * 1024) {
      return toast.error("Image file must be smaller than 5 MB");
    }

    const finalCategory =
      category === "Others" && customCategory.trim()
        ? customCategory.trim()
        : category;

    setLoading(true);
    try {
      let image = urlInput;
      if (file && file.size > 0) {
        try {
          image = await uploadImage(file);
        } catch {
          if (!urlInput) {
            toast.error("Image upload failed. Please try again or paste an image link.");
            return;
          }
          image = urlInput;
        }
      }

      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify({
          title: fd.get("title"),
          author: fd.get("author"),
          category: finalCategory,
          totalCopies: Number(fd.get("totalCopies")),
          description: fd.get("description"),
          addedByName: user?.name || "Community Reader",
          image,
        }),
      });

      toast.success("Book added successfully to library!");
      form.reset();
      setPreviewUrl("");
      setCategory("");
      setCustomCategory("");
      router.push("/my-books");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-[#84a282]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#84a282]">
          ✦ Expand the Collection
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          Add a New Book
        </h1>
        <p className="mt-2 text-sm text-base-content/75">
          Share a book from your collection with fellow readers. All fields marked are required.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Author */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Book Title *
              </span>
              <input
                name="title"
                required
                placeholder="e.g. The Midnight Library"
                className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Author Name *
              </span>
              <input
                name="author"
                required
                placeholder="e.g. Matt Haig"
                className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
              />
            </label>
          </div>

          {/* Category & Copies */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                  Category *
                </span>
                <select
                  name="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select w-full rounded-2xl border-base-300 bg-base-200 text-sm focus:border-primary"
                >
                  <option value="" disabled>Choose a shelf category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              {category === "Others" && (
                <input
                  name="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  maxLength={30}
                  placeholder="Type your own category (e.g. Poetry)"
                  className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
                />
              )}
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Total Copies Available *
              </span>
              <input
                name="totalCopies"
                type="number"
                min={1}
                defaultValue={1}
                required
                className="input w-full rounded-2xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
              />
            </label>
          </div>

          {/* Image Upload / URL & Preview */}
          <div className="space-y-2 rounded-2xl border border-base-300/70 bg-base-200/30 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Book Cover Image *
            </span>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2 space-y-2">
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-sm w-full rounded-xl border-base-300 bg-base-100"
                />
                <div className="text-center text-xs text-base-content/50">— OR —</div>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="input input-sm w-full rounded-xl border-base-300 bg-base-100 text-xs"
                />
                <p className="text-[11px] text-base-content/60">
                  Upload an image file (under 5MB) or provide an image link.
                </p>
              </div>

              {/* Preview Box */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-2 text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-28 w-20 rounded-md object-cover shadow-sm"
                  />
                ) : (
                  <div className="text-xs text-base-content/40">
                    <span className="mb-1 block text-2xl">🖼️</span>
                    Cover Preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Short Description / Synopsis *
            </span>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Provide a compelling overview of what this book is about..."
              className="textarea w-full rounded-2xl border-base-300 bg-base-200/50 text-sm leading-relaxed focus:border-primary"
            />
          </label>

          {/* User Info (Read-only) */}
          <div className="grid gap-5 border-t border-base-300/60 pt-5 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                Contributor Name (Read-only)
              </span>
              <input
                value={user?.name || ""}
                readOnly
                className="input w-full rounded-2xl border-base-300 bg-base-200/70 text-sm font-medium text-base-content/75"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                Contributor Email (Read-only)
              </span>
              <input
                value={user?.email || ""}
                readOnly
                className="input w-full rounded-2xl border-base-300 bg-base-200/70 text-sm font-medium text-base-content/75"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-2xl py-3 font-semibold shadow-md transition hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving to Library...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Book to Library
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}