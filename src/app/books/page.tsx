import { Suspense } from "react";
import type { Metadata } from "next";
import AllBooks from "@/components/AllBooks";
import Spinner from "@/components/Spinner";

export const metadata: Metadata = { title: "All Books" };

export default function BooksPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AllBooks />
    </Suspense>
  );
}