import type { Metadata } from "next";
import BookDetails from "@/components/BookDetails";

export const metadata: Metadata = { title: "Book Details" };

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetails id={id} />;
}