import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BookNook | Home", template: "BookNook | %s" },
  description: "BookNook is a small online library. Add a book, borrow a book, return a book.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={<header className="sticky top-0 z-50 bg-base-100 px-4 shadow-sm lg:px-8"><div className="flex h-16 items-center"><span className="loading loading-spinner loading-sm text-primary" /></div></header>}>
          <Navbar />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}