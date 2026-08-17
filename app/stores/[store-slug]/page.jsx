import {
  FiArrowUpRight,
  FiBox,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

export const metadata = {
  title: "Store dashboard | Hishab Khata",
};

export default async function StoreDashboard({ params }) {
  const { "store-slug": slug } = await params;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-base-content/60">Store dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Overview</h1>
          <p className="mt-2 max-w-2xl text-base-content/60">
            Your store workspace is ready. Add products and record sales as
            those modules are enabled.
          </p>
        </div>

        <span className="badge badge-ghost gap-2 self-start sm:self-auto">
          <span className="status status-success" aria-hidden="true" />@{slug}
        </span>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Store summary">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiPackage
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Products</p>
              <p className="mt-1 text-2xl font-semibold">Not set up</p>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiBox
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Inventory</p>
              <p className="mt-1 text-2xl font-semibold">Not set up</p>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiShoppingCart
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Sales today</p>
              <p className="mt-1 text-2xl font-semibold">Not set up</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="card-title">Build your daily workflow</h2>
              <p className="mt-1 max-w-xl text-sm text-base-content/60">
                This dashboard is the home for your store’s sales, products,
                stock levels, and reports.
              </p>
            </div>
            <span className="badge badge-ghost self-start">Dashboard base</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Manage products", "Track stock", "Record sales"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-box border border-base-300 p-4"
              >
                <span className="font-medium">{item}</span>
                <FiArrowUpRight
                  className="text-base-content/40"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
