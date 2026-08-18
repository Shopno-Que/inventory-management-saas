import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomerForm from "@/components/customers/CustomerForm";
import { db } from "@/db";
import { customers } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { updateCustomer } from "@/server/customers";

export const metadata = { title: "Edit customer | Hishab Khata" };

export default async function EditCustomerPage({ params, searchParams }) {
  const { "store-slug": slug, "customer-id": customerId } = await params;
  const { error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, customerId), eq(customers.storeId, store.id)))
    .limit(1);

  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/customers`}>Customers</Link>
            </li>
            <li>Edit customer</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Edit customer
        </h1>
        <p className="mt-2 text-base-content/60">Update {customer.name}.</p>
      </div>

      <CustomerForm
        action={updateCustomer}
        error={error}
        customer={customer}
        storeSlug={slug}
      />
    </div>
  );
}
