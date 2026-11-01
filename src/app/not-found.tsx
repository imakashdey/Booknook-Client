import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-base-content/70">The page you are looking for does not exist or was moved.</p>
      <Link href="/" className="btn btn-primary">Back to Home</Link>
    </section>
  );
}