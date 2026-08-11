import Link from "next/link";

export const dynamic = "force-dynamic";

export default function StoreLayout({ children, params }) {
  const slug = params["store-slug"];

  return (
    <div className="min-h-screen bg-base-100">
      <main className="container mx-auto p-6 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="col-span-1">
            <nav className="rounded-box border border-base-300 bg-base-100 p-4">
              <ul className="menu">
                <li>
                  <Link href={`/stores/${slug}`} className="p-2">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${slug}/products`} className="p-2">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${slug}/sales`} className="p-2">
                    Sales
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${slug}/settings`} className="p-2">
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="col-span-3">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
