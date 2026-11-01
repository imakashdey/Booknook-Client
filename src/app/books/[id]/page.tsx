import type { Metadata } from "next";
import { Suspense } from "react";
import BookDetails from "@/components/BookDetails";
import Spinner from "@/components/Spinner";

export const metadata: Metadata = { title: "Book Details" };

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <BookDetails id={id} />
    </Suspense>
  );
}