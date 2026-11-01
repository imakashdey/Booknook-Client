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
  const editRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!email) return;
    publicFetch(`/books?email=${encodeURIComponent(email)}`)
      .then(setBooks)
      .catch(() => toast.error("Could not load your books"))
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
    setSaving(true);
    try {
      const image = file && file.size > 0 ? await uploadImage(file) : editing.image;
      const updated = await apiFetch(`/books/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: fd.get("title"),
          author: fd.get("author"),
          category: fd.get("category"),
          totalCopies: fd.get("totalCopies"),
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
    try {
      await apiFetch(`/books/${deleting._id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b._id !== deleting._id));
      toast.success("Book deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      deleteRef.current?.close();
    }
  };

  if (isPending || loading) return <Spinner />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">My Books</h1>
      {books.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">You have not added any books yet.</p>
          <Link href="/add-book" className="btn btn-primary">Add Book</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th><th>Title</th><th>Author</th><th>Category</th><th>Copies</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td><img src={b.image} alt={b.title} className="h-16 w-12 rounded object-cover" /></td>
                  <td className="font-medium">{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>{b.availableCopies} / {b.totalCopies}</td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => openDelete(b)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      <dialog ref={editRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-3 text-xl font-bold">Edit Book</h3>
          {editing && (
            <form key={editing._id} onSubmit={handleUpdate} className="space-y-3">
              <input name="title" defaultValue={editing.title} required className="input w-full" placeholder="Title" />
              <input name="author" defaultValue={editing.author} required className="input w-full" placeholder="Author" />
              <div className="grid grid-cols-2 gap-3">
                <select name="category" defaultValue={editing.category} className="select w-full">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input name="totalCopies" type="number" min={1} defaultValue={editing.totalCopies} required className="input w-full" />
              </div>
              <textarea name="description" defaultValue={editing.description} required rows={3} className="textarea w-full" />
              <div className="space-y-1">
                <span className="text-sm">New image (optional)</span>
                <input name="image" type="file" accept="image/*" className="file-input w-full" />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => editRef.current?.close()}>Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Delete confirm modal */}
      <dialog ref={deleteRef} className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold">Delete this book?</h3>
          <p className="py-3">
            “{deleting?.title}” will be removed permanently. This cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => deleteRef.current?.close()}>Cancel</button>
            <button className="btn btn-error" onClick={handleDelete}>Yes, Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </section>
  );
}