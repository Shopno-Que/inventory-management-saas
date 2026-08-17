import { and, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { FiEdit2, FiPlus, FiSearch } from "react-icons/fi";
import DeleteProductButton from "@/components/products/DeleteProductButton";
import { db } from "@/db";
import { products } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { deleteProduct } from "@/server/products";

export const metadata = { title: "Products | Hishab Khata" };

function formatPrice(value, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(Number(value));
}

export default async function ProductsPage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { q = "", error = "" } = await searchParams;
  const [store] = await db
    .select({ id: stores.id, currencyCode: stores.currencyCode })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  const search = typeof q === "string" ? q.trim() : "";
  const filter = search
    ? and(
        eq(products.storeId, store.id),
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.barcode, `%${search}%`),
        ),
      )
    : eq(products.storeId, store.id);

  const productList = await db
    .select()
    .from(products)
    .where(filter)
    .orderBy(desc(products.createdAt));

  const productsUrl = `/stores/${slug}/products`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}`}>Overview</Link>
              </li>
              <li>Products</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-base-content/60">
            Manage the products your store sells.
          </p>
        </div>
        <Link href={`${productsUrl}/new`} className="btn btn-primary">
          <FiPlus size={18} aria-hidden="true" />
          New product
        </Link>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error}</span>
        </div>
      )}

      <form action={productsUrl} className="flex gap-2">
        <label className="input w-full sm:max-w-md">
          <FiSearch size={18} aria-hidden="true" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search name, SKU, or barcode"
          />
        </label>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        {productList.length === 0 ? (
          <div className="card-body items-center py-16 text-center">
            <h2 className="card-title">
              {search ? "No matching products" : "No products yet"}
            </h2>
            <p className="max-w-md text-sm text-base-content/60">
              {search
                ? "Try another search term."
                : "Create your first product to begin building your catalogue."}
            </p>
            {!search && (
              <Link
                href={`${productsUrl}/new`}
                className="btn btn-primary mt-3"
              >
                Create product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Sale price</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-base-content/60">
                        {product.barcode || product.unit}
                      </div>
                    </td>
                    <td className="font-mono text-sm">{product.sku || "—"}</td>
                    <td>
                      {formatPrice(product.salePrice, store.currencyCode)}
                    </td>
                    <td>
                      <span
                        className={`badge ${product.isActive ? "badge-success badge-soft" : "badge-ghost"}`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`${productsUrl}/${product.id}/edit`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Edit ${product.name}`}
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        <DeleteProductButton
                          action={deleteProduct}
                          product={product}
                          storeSlug={slug}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
