export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[100svh] w-full bg-primary/10" />
      <div className="container grid grid-cols-2 gap-6 py-16 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-ink/5" />
        ))}
      </div>
      <div className="container grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-3xl bg-ink/5" />
        ))}
      </div>
    </div>
  );
}
