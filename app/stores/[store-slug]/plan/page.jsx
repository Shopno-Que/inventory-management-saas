import Link from "next/link";

export const metadata = { title: "Plan | Hishab Khata" };

export default async function StorePlanPage({ params }) {
  const { "store-slug": slug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}`}>Overview</Link>
              </li>
              <li>Plan</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Store plan</h1>
          <p className="mt-2 text-base-content/60">
            Your current SaaS plan status.
          </p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <p className="text-sm text-base-content/60">Current plan</p>
              <h2 className="mt-2 text-4xl font-bold text-success">Free</h2>
            </div>

            <div className="rounded-box border border-base-300 bg-base-200 p-4">
              <p className="text-sm text-base-content/60">Included</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Basic product management</li>
                <li>• Customer and sales tracking</li>
                <li>• Expense logging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body items-center py-16 text-center">
            <h2 className="card-title">Coming soon</h2>
            <p className="max-w-md text-sm text-base-content/60">
              Plan upgrades, billing settings, and subscription management will
              be added here soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
