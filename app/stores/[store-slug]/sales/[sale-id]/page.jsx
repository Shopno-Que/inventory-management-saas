import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, sales } from "@/db/schema/store";
import { stores } from "@/db/schema/store";
import InvoicePdfButton from "@/components/sales/InvoicePdfButton";

export const metadata = { title: "Invoice | Hishab Khata" };

function formatMoney(value, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(Number(value || 0));
}

export default async function SaleDetailsPage({ params }) {
  const { "store-slug": slug, "sale-id": saleId } = await params;

  const [store] = await db
    .select({
      id: stores.id,
      name: stores.name,
      currencyCode: stores.currencyCode,
    })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);
  const [sale] = await db
    .select()
    .from(sales)
    .where(and(eq(sales.id, saleId), eq(sales.storeId, store.id)))
    .limit(1);

  if (!sale) notFound();

  const customer = sale.customerId
    ? await db
      .select()
      .from(customers)
      .where(eq(customers.id, sale.customerId))
      .limit(1)
    : [];
  const customerName = customer[0]?.name || "Walk-in customer";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}/sales`}>Sales</Link>
              </li>
              <li>{sale.invoiceNumber}</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Invoice {sale.invoiceNumber}
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/stores/${slug}/sales/${sale.id}/edit`}
            className="btn btn-ghost"
          >
            Edit
          </Link>
          <InvoicePdfButton
            store={store}
            sale={sale}
            customerName={customerName}
            slug={slug}
          />
        </div>
      </div>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-col gap-4 border-b border-base-300 pb-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm text-base-content/60">From</p>
              <h2 className="text-xl font-semibold">{store.name}</h2>
              <p className="text-sm text-base-content/60">@{slug}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-base-content/60">Invoice</p>
              <p className="font-semibold">{sale.invoiceNumber}</p>
              <p className="text-sm text-base-content/60">
                {new Date(sale.saleDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-base-content/60">Bill to</p>
              <p className="font-medium">{customerName}</p>
              <p className="text-sm text-base-content/60">{sale.status}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-base-content/60">Due date</p>
              <p className="font-medium">
                {sale.dueDate
                  ? new Date(sale.dueDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{sale.itemDescription}</td>
                  <td>{sale.quantity}</td>
                  <td>{formatMoney(sale.unitPrice, store.currencyCode)}</td>
                  <td>{formatMoney(sale.total, store.currencyCode)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ml-auto w-full max-w-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatMoney(sale.subtotal, store.currencyCode)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatMoney(sale.tax, store.currencyCode)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>{formatMoney(sale.discount, store.currencyCode)}</span>
            </div>
            <div className="flex justify-between border-t border-base-300 pt-2 text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(sale.total, store.currencyCode)}</span>
            </div>
          </div>

          {sale.notes && (
            <p className="text-sm text-base-content/60">Notes: {sale.notes}</p>
          )}
        </div>
      </section>
    </div>
  );
}
