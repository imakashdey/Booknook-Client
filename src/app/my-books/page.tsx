import type { Metadata } from "next";
import MyBooks from "@/components/MyBooks";

export const metadata: Metadata = { title: "My Books" };

export default function MyBooksPage() {
  return <MyBooks />;
}