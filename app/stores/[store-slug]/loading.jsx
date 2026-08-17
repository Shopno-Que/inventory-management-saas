import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-9 w-44" />
        <SkeletonBlock className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <SkeletonBlock key={item} className="h-36 w-full" />
        ))}
      </div>
      <SkeletonBlock className="h-64 w-full" />
    </div>
  );
}
