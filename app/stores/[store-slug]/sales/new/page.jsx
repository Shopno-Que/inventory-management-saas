import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import SaleForm from "@/components/sales/SaleForm";
import { db } from "@/db";
import { customers } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { createSale } from "@/server/sales";

export const metadata = { title: "New sale | Hishab Khata" };

export default async function NewSalePage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);
  const customerList = await db
    .select()
    .from(customers)
    .where(eq(customers.storeId, store.id))
    .orderBy(desc(customers.name));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/sales`}>Sales</Link>
            </li>
            <li>New sale</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New sale</h1>
        <p className="mt-2 text-base-content/60">
          Create a sale and generate an invoice for it.
        </p>
      </div>

      <SaleForm
        action={createSale}
        error={error}
        customers={customerList}
        storeSlug={slug}
      />
    </div>
  );
}
