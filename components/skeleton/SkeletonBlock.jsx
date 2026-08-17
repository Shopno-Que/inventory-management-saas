export default function SkeletonBlock({
  rows = 3,
  className = "",
  rowClassName = "h-4 w-full",
}) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${rowClassName}`}
        />
      ))}
    </div>
  );
}