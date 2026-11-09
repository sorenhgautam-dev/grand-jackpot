import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dhaka px-6 text-center">
      <p className="gold-text font-display text-8xl font-semibold">404</p>
      <h1 className="mt-4 font-display text-3xl">This page isn&rsquo;t on the floor</h1>
      <p className="mt-3 max-w-sm text-muted">The page you were looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/" className="btn btn-gold mt-8">Return home</Link>
    </main>
  );
}
