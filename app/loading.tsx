export default function Loading() {
  return (
    <div className="animate-pulse bg-ivory">
      <div className="h-[92svh] w-full bg-forest-deep/10" />
      <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-px bg-forest-deep/10 px-5 py-16 sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-card" />
        ))}
      </div>
      <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-px bg-forest-deep/10 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-card" />
        ))}
      </div>
    </div>
  );
}
