import type { Metadata } from "next";
import AddBookForm from "@/components/AddBookForm";

export const metadata: Metadata = { title: "Add Book" };

export default function AddBookPage() {
  return <AddBookForm />;
}