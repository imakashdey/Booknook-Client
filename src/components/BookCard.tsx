/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="card h-full bg-base-100 shadow-md transition hover:shadow-xl">
      <figure className="h-64 w-full bg-base-200">
        <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <span className="badge badge-primary badge-outline">{book.category}</span>
        <h3 className="card-title line-clamp-1">{book.title}</h3>
        <p className="line-clamp-1 text-sm text-base-content/70">by {book.author}</p>
        <div className="card-actions mt-auto pt-2">
          <Link href={`/books/${book._id}`} className="btn btn-primary btn-sm w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}