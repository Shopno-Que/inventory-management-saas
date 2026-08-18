import { and, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { FiEdit2, FiPlus, FiSearch } from "react-icons/fi";
import { TbEye } from "react-icons/tb";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteSale } from "@/server/sales";
import InvoicePdfButton from "@/components/sales/InvoicePdfButton";
import { db } from "@/db";
import { customers, sales } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";

export const metadata = { title: "Sales | Hishab Khata" };

function formatMoney(value, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(Number(value || 0));
}

export default async function SalesPage({ params, searchParams }) {
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
        eq(sales.storeId, store.id),
        or(
          ilike(sales.invoiceNumber, `%${search}%`),
          ilike(sales.itemDescription, `%${search}%`),
          ilike(sales.status, `%${search}%`),
        ),
      )
    : eq(sales.storeId, store.id);

  const saleList = await db
    .select({
      id: sales.id,
      invoiceNumber: sales.invoiceNumber,
      itemDescription: sales.itemDescription,
      status: sales.status,
      total: sales.total,
      saleDate: sales.saleDate,
      customerId: sales.customerId,
      customerName: customers.name,
    })
    .from(sales)
    .leftJoin(customers, eq(customers.id, sales.customerId))
    .where(filter)
    .orderBy(desc(sales.saleDate));

  const salesUrl = `/stores/${slug}/sales`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}`}>Overview</Link>
              </li>
              <li>Sales</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Sales</h1>
          <p className="mt-2 text-base-content/60">
            Track invoices, totals, and payment status.
          </p>
        </div>
        <Link href={`${salesUrl}/new`} className="btn btn-primary">
          <FiPlus size={18} aria-hidden="true" />
          New sale
        </Link>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error}</span>
        </div>
      )}

      <form action={salesUrl} className="flex gap-2">
        <label className="input w-full sm:max-w-md">
          <FiSearch size={18} aria-hidden="true" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search invoice or item"
          />
        </label>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        {saleList.length === 0 ? (
          <div className="card-body items-center py-16 text-center">
            <h2 className="card-title">
              {search ? "No matching sales" : "No sales yet"}
            </h2>
            <p className="max-w-md text-sm text-base-content/60">
              {search
                ? "Try another search term."
                : "Create your first invoice to start tracking revenue."}
            </p>
            {!search && (
              <Link href={`${salesUrl}/new`} className="btn btn-primary mt-3">
                Create sale
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {saleList.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <div className="font-medium">{sale.invoiceNumber}</div>
                      <div className="text-sm text-base-content/60">
                        {sale.itemDescription}
                      </div>
                    </td>
                    <td>{sale.customerName || "Walk-in"}</td>
                    <td>{formatMoney(sale.total, store.currencyCode)}</td>
                    <td>
                      <span
                        className={`badge ${sale.status === "paid" ? "badge-success badge-soft" : "badge-ghost"}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <InvoicePdfButton
                          store={store}
                          sale={sale}
                          customerName={sale.customerId}
                          slug={slug}
                          variant="icon"
                        />
                        <Link
                          href={`${salesUrl}/${sale.id}`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`View ${sale.invoiceNumber}`}
                        >
                          <TbEye aria-hidden="true" />
                        </Link>
                        <Link
                          href={`${salesUrl}/${sale.id}/edit`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Edit ${sale.invoiceNumber}`}
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        <DeleteButton
                          action={deleteSale}
                          id={sale.id}
                          fieldName="saleId"
                          storeSlug={slug}
                          itemName={sale.invoiceNumber}
                          itemType="sale"
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
