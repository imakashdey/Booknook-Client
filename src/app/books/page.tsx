import type { Metadata } from "next";
import AllBooks from "@/components/AllBooks";

export const metadata: Metadata = { title: "All Books" };

export default function BooksPage() {
  return <AllBooks />;
}