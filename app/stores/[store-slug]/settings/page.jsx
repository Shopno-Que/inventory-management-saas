import Link from "next/link";

export const metadata = { title: "Store settings | Hishab Khata" };

export default async function StoreSettingsPage({ params }) {
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
              <li>Settings</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Store settings
          </h1>
          <p className="mt-2 text-base-content/60">
            Basic details for your store workspace.
          </p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title">Store details</h2>
              <p className="mt-1 text-sm text-base-content/60">
                These are the basic settings currently available for the store.
              </p>
            </div>

            <div className="space-y-3">
              <label className="form-control w-full">
                <span className="label-text text-sm font-medium">
                  Store name
                </span>
                <input
                  defaultValue="My Store"
                  className="input input-bordered w-full"
                  disabled
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text text-sm font-medium">
                  Store slug
                </span>
                <input
                  defaultValue={slug}
                  className="input input-bordered w-full"
                  disabled
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text text-sm font-medium">Currency</span>
                <input
                  defaultValue="USD"
                  className="input input-bordered w-full"
                  disabled
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text text-sm font-medium">Timezone</span>
                <input
                  defaultValue="UTC"
                  className="input input-bordered w-full"
                  disabled
                />
              </label>
            </div>

            <div className="alert alert-info alert-soft mt-2">
              <span>
                Basic settings are visible here. Editing will be added soon.
              </span>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title">Plan</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Current SaaS subscription state.
              </p>
            </div>

            <div className="rounded-box border border-success/30 bg-success/10 p-4">
              <p className="text-sm text-base-content/60">Current plan</p>
              <p className="mt-2 text-3xl font-bold text-success">Free</p>
            </div>

            <div className="alert alert-warning alert-soft">
              <span>Billing and plan configuration are coming soon.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
