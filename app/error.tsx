"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        This page didn&rsquo;t load the way it should have
      </h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        Nothing on your end is broken — try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/">Back to homepage</a>
        </Button>
      </div>
    </div>
  );
}
