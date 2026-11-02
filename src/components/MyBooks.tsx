"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch, publicFetch } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { Book } from "./BookCard";
import Spinner from "./Spinner";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooks() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const editRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!email) return;
    publicFetch(`/books?email=${encodeURIComponent(email)}`)
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setBooks([]);
      })
      .finally(() => setLoading(false));
  }, [email]);

  const openEdit = (b: Book) => {
    setEditing(b);
    editRef.current?.showModal();
  };

  const openDelete = (b: Book) => {
    setDeleting(b);
    deleteRef.current?.showModal();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const file = fd.get("image") as File | null;
    const imageUrlInput = (fd.get("imageUrl") as string || "").trim();
    setSaving(true);
    try {
      let image = editing.image;
      if (file && file.size > 0) {
        try {
          image = await uploadImage(file);
        } catch {
          if (imageUrlInput) image = imageUrlInput;
          else throw new Error("Image upload failed. Please provide an image URL instead.");
        }
      } else if (imageUrlInput) {
        image = imageUrlInput;
      }

      const updated = await apiFetch(`/books/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: fd.get("title"),
          author: fd.get("author"),
          category: fd.get("category"),
          totalCopies: Number(fd.get("totalCopies")),
          description: fd.get("description"),
          image,
        }),
      });

      setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      toast.success("Book updated successfully!");
      editRef.current?.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await apiFetch(`/books/${deleting._id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b._id !== deleting._id));
      toast.success("Book deleted successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingLoading(false);
      deleteRef.current?.close();
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const totalCopiesContributed = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-[#84a282]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#84a282]">
            ✦ Contributor Dashboard
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            My Books
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            Manage the titles you have shared with the BookNook reading community.
          </p>
        </div>

        <Link
          href="/add-book"
          className="btn btn-primary rounded-xl px-6 font-semibold shadow-sm transition hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-sm">
          <div className="text-xs font-medium text-base-content/60">Titles Added</div>
          <div className="mt-1 font-serif text-2xl font-bold text-primary">{books.length}</div>
        </div>
        <div className="rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-sm">
          <div className="text-xs font-medium text-base-content/60">Total Copies Shared</div>
          <div className="mt-1 font-serif text-2xl font-bold text-base-content">{totalCopiesContributed}</div>
        </div>
        <div className="col-span-2 rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-sm sm:col-span-1">
          <div className="text-xs font-medium text-base-content/60">Community Status</div>
          <div className="mt-1 flex items-center gap-1.5 font-serif text-sm font-bold text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Active Contributor
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300/90 bg-base-100/50 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84a282]/15 text-3xl text-primary">
            📖
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-base-content">No books added yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
            You haven&apos;t added any books to your corner yet. Share a book you own so community members can borrow it!
          </p>
          <Link href="/add-book" className="btn btn-primary btn-sm mt-6 rounded-xl px-6 font-semibold shadow-sm">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/60 text-xs font-semibold uppercase text-base-content/70">
                <tr>
                  <th className="py-4">Book</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Date Added</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/50 text-sm">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-base-200/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-16 w-12 rounded-lg object-cover shadow-sm"
                        />
                        <div>
                          <Link href={`/books/${b._id}`} className="font-serif font-bold text-base-content hover:text-primary transition-colors">
                            {b.title}
                          </Link>
                          <div className="text-xs text-base-content/65">by {b.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rounded-full bg-[#f6e2e9] px-2.5 py-0.5 text-xs font-semibold text-[#4a333d]">
                        {b.category}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-base-content">
                        {b.availableCopies} / {b.totalCopies}
                      </div>
                      <div className="text-xs text-base-content/60">copies left</div>
                    </td>
                    <td className="text-xs text-base-content/70">
                      {new Date(b.createdAt || Date.now()).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(b)}
                          className="btn btn-outline btn-xs rounded-lg border-base-300 hover:border-primary hover:bg-primary hover:text-primary-content"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete(b)}
                          className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      <dialog ref={editRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-3xl border border-base-300 p-6 sm:p-8">
          <h3 className="font-serif text-2xl font-bold text-base-content">
            Edit Book
          </h3>
          <p className="mt-1 text-xs text-base-content/65">
            Update the catalog information for this title.
          </p>

          {editing && (
            <form key={editing._id} onSubmit={handleUpdate} className="mt-5 space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-semibold text-base-content/80">Book Title</span>
                <input
                  name="title"
                  defaultValue={editing.title}
                  required
                  className="input w-full rounded-xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-semibold text-base-content/80">Author Name</span>
                <input
                  name="author"
                  defaultValue={editing.author}
                  required
                  className="input w-full rounded-xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-base-content/80">Category</span>
                  <select
                    name="category"
                    defaultValue={editing.category}
                   className="select w-full rounded-xl border-base-300 bg-base-200 text-sm focus:border-primary"
                  >
                    {!categories.includes(editing.category) && (
                      <option value={editing.category}>{editing.category}</option>
                    )}
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-base-content/80">Total Copies</span>
                  <input
                    name="totalCopies"
                    type="number"
                    min={1}
                    defaultValue={editing.totalCopies}
                    required
                    className="input w-full rounded-xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
                  />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-xs font-semibold text-base-content/80">Short Description</span>
                <textarea
                  name="description"
                  defaultValue={editing.description}
                  required
                  rows={3}
                  className="textarea w-full rounded-xl border-base-300 bg-base-200/50 text-sm focus:border-primary"
                />
              </label>

              <div className="space-y-2 border-t border-base-300/60 pt-3">
                <span className="text-xs font-semibold text-base-content/80">Update Cover Image</span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-sm w-full rounded-xl border-base-300 bg-base-200/50"
                />
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="Or paste an image URL..."
                  defaultValue={editing.image}
                  className="input input-sm w-full rounded-xl border-base-300 bg-base-200/50 text-xs"
                />
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  className="btn btn-ghost rounded-xl font-medium"
                  onClick={() => editRef.current?.close()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary rounded-xl px-6 font-semibold shadow-md"
                >
                  {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal (Custom Modal, Not Browser Alert) */}
      <dialog ref={deleteRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-3xl border border-base-300 p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/15 text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold text-base-content">
            Delete this book?
          </h3>
          <p className="mt-2 text-sm text-base-content/75">
            Are you sure you want to delete <span className="font-semibold text-base-content">“{deleting?.title}”</span>? This title will be removed permanently from the library catalog.
          </p>

          <div className="modal-action pt-4">
            <button
              type="button"
              className="btn btn-ghost rounded-xl font-medium"
              onClick={() => deleteRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deletingLoading}
              onClick={handleDelete}
              className="btn btn-error rounded-xl px-6 font-semibold text-white shadow-md"
            >
              {deletingLoading ? <span className="loading loading-spinner loading-sm" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
}