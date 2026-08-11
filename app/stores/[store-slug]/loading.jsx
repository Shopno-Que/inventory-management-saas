import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100">
      <main className="container mx-auto p-6 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="col-span-1">
            <nav className="rounded-box border border-base-300 bg-base-100 p-4">
              <ul className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}>
                    <div className="h-8 w-full rounded-md bg-base-200/60 animate-pulse" />
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="col-span-3">
            <div className="space-y-6">
              <div>
                <div className="h-6 w-64 rounded-md bg-base-200/60 animate-pulse" />
                <div className="mt-2 h-4 w-96 rounded-md bg-base-200/60 animate-pulse" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card p-4 border border-base-300 bg-base-100 shadow-sm">
                    <div className="h-5 w-32 rounded-md bg-base-200/60 animate-pulse" />
                    <div className="mt-3">
                      <SkeletonBlock rows={3} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="h-6 w-48 rounded-md bg-base-200/60 animate-pulse" />
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="h-24 w-full rounded-md bg-base-200/60 animate-pulse" />
                  <div className="h-24 w-full rounded-md bg-base-200/60 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
