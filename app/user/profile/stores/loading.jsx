import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function Loading() {
  return (
    <main className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="h-6 w-48 rounded-md bg-base-200/60 animate-pulse" />
          <div className="mt-1 h-4 w-72 rounded-md bg-base-200/60 animate-pulse" />
        </div>

        <div className="h-10 w-40 rounded-md bg-base-200/60 animate-pulse" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="h-14 w-14 rounded-xl bg-base-200/60 animate-pulse" />
                </div>

                <div className="min-w-0">
                  <div className="h-5 w-40 rounded-md bg-base-200/60 animate-pulse" />
                  <div className="mt-2 h-4 w-28 rounded-md bg-base-200/60 animate-pulse" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-6 w-16 rounded-md bg-base-200/60 animate-pulse" />
              </div>

              <div className="card-actions mt-4">
                <div className="h-10 w-full rounded-md bg-base-200/60 animate-pulse" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
