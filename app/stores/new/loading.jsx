import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function Loading() {
  return (
    <main className="container mx-auto max-w-3xl p-6">
      <div className="space-y-6">
        {/* Back button / header skeletons */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-28 rounded-md bg-base-200/60 animate-pulse" />
          <div className="h-8 w-20 rounded-md bg-base-200/60 animate-pulse" />
        </div>

        <header className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-base-200/60 animate-pulse" />
          <div className="h-4 w-72 rounded-md bg-base-200/60 animate-pulse" />
        </header>

        {/* Steps skeleton */}
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-md bg-base-200/60 animate-pulse" />
          ))}
        </div>

        {/* Card skeleton for the onboarding form */}
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body space-y-4">
            <div className="h-6 w-40 rounded-md bg-base-200/60 animate-pulse" />

            <SkeletonBlock rows={5} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-10 w-full rounded-md bg-base-200/60 animate-pulse" />
              <div className="h-10 w-full rounded-md bg-base-200/60 animate-pulse" />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="h-10 w-28 rounded-md bg-base-200/60 animate-pulse" />
              <div className="h-10 w-36 rounded-md bg-base-200/60 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
