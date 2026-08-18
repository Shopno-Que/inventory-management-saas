import Link from "next/link";
import CustomerForm from "@/components/customers/CustomerForm";
import { createCustomer } from "@/server/customers";

export const metadata = { title: "New customer | Hishab Khata" };

export default async function NewCustomerPage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { error = "" } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/customers`}>Customers</Link>
            </li>
            <li>New customer</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New customer</h1>
        <p className="mt-2 text-base-content/60">
          Add the contact details and notes needed to keep this customer on
          file.
        </p>
      </div>

      <CustomerForm action={createCustomer} error={error} storeSlug={slug} />
    </div>
  );
}
