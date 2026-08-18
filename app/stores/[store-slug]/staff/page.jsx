import Link from "next/link";

export const metadata = { title: "Staff | Hishab Khata" };

export default async function StaffPage({ params }) {
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
              <li>Staff</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Staff</h1>
          <p className="mt-2 text-base-content/60">
            Invite and manage your store team members.
          </p>
        </div>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center py-16 text-center">
          <h2 className="card-title">Coming soon</h2>
          <p className="max-w-md text-sm text-base-content/60">
            The staff module is being developed. Access controls and member
            management will be added here soon.
          </p>
        </div>
      </div>
    </div>
  );
}
