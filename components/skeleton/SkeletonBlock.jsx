export default function SkeletonBlock({ rows = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-full rounded-md bg-base-200/60 animate-pulse"
        />
      ))}
    </div>
  );
}
