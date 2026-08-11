"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="eyebrow justify-center">Something went wrong</p>
      <h1 className="display-md mt-5 max-w-xl text-forest-deep">
        This page did not load the way it should have.
      </h1>
      <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
        Try again, or return to the homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center justify-center bg-forest-deep px-6 py-3 text-[0.78rem] font-semibold tracking-[0.16em] text-ivory uppercase transition-all duration-300 hover:bg-forest-soft"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center border border-forest-deep/30 px-6 py-3 text-[0.78rem] font-semibold tracking-[0.16em] text-forest-deep uppercase transition-all duration-300 hover:border-gold"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
