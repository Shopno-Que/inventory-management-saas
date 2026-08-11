import Link from "next/link";

export const metadata = {
  title: "Store Dashboard | হিসাব খাতা",
};

export default function StoreDashboard({ params }) {
  const slug = params["store-slug"];

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{slug} - Dashboard</h1>
        <p className="mt-1 text-sm text-base-content/60">Store overview and quick actions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4 border border-base-300 bg-base-100 shadow-sm">
          <h3 className="font-semibold">Orders</h3>
          <p className="text-sm text-base-content/60">—</p>
        </div>

        <div className="card p-4 border border-base-300 bg-base-100 shadow-sm">
          <h3 className="font-semibold">Products</h3>
          <p className="text-sm text-base-content/60">—</p>
        </div>

        <div className="card p-4 border border-base-300 bg-base-100 shadow-sm">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-sm text-base-content/60">—</p>
        </div>
      </div>

      <div className="mt-6">
        <Link className="btn btn-outline" href={`/stores/${slug}/products`}>
          View products
        </Link>
      </div>
    </section>
  );
}
