import { Suspense } from "react";
import type { Metadata } from "next";
import BookDetails from "@/components/BookDetails";
import Spinner from "@/components/Spinner";

export const metadata: Metadata = { title: "Book Details" };

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetails id={id} />;
}

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <Content params={params} />
    </Suspense>
  );
}