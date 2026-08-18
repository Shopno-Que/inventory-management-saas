import { and, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import SaleForm from "@/components/sales/SaleForm";
import { db } from "@/db";
import { customers, sales } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { updateSale } from "@/server/sales";

export const metadata = { title: "Edit sale | Hishab Khata" };

export default async function EditSalePage({ params, searchParams }) {
  const { "store-slug": slug, "sale-id": saleId } = await params;
  const { error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);
  const [sale] = await db
    .select()
    .from(sales)
    .where(and(eq(sales.id, saleId), eq(sales.storeId, store.id)))
    .limit(1);
  const customerList = await db
    .select()
    .from(customers)
    .where(eq(customers.storeId, store.id))
    .orderBy(desc(customers.name));

  if (!sale) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/sales`}>Sales</Link>
            </li>
            <li>Edit sale</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit sale</h1>
        <p className="mt-2 text-base-content/60">
          Update invoice {sale.invoiceNumber}.
        </p>
      </div>

      <SaleForm
        action={updateSale}
        error={error}
        sale={sale}
        customers={customerList}
        storeSlug={slug}
      />
    </div>
  );
}
