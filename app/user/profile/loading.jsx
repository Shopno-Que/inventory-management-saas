import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function Loading() {
  return (
    <main className="container mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <div className="h-4 w-32 rounded-md bg-base-200/60 animate-pulse" />

        <div className="mt-3 h-6 w-48 rounded-md bg-base-200/60 animate-pulse" />

        <div className="mt-2 h-4 w-72 rounded-md bg-base-200/60 animate-pulse" />
      </div>

      <div className="grid gap-6">
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              <div className="h-5 w-40 rounded-md bg-base-200/60 animate-pulse" />
            </h2>

            <div className="grid gap-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-base-200/60 animate-pulse" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-56 rounded-md bg-base-200/60 animate-pulse" />
                  <div className="h-4 w-40 rounded-md bg-base-200/60 animate-pulse" />
                </div>
              </div>

              <SkeletonBlock rows={4} />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-10 w-full rounded-md bg-base-200/60 animate-pulse" />
                <div className="h-10 w-full rounded-md bg-base-200/60 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between gap-4">
              <div className="h-5 w-40 rounded-md bg-base-200/60 animate-pulse" />
              <div className="h-4 w-28 rounded-md bg-base-200/60 animate-pulse" />
            </div>

            <div className="divider my-3" />

            <SkeletonBlock rows={6} />

            <div className="mt-4 flex items-center justify-end gap-3">
              <div className="h-10 w-28 rounded-md bg-base-200/60 animate-pulse" />
              <div className="h-10 w-36 rounded-md bg-base-200/60 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
