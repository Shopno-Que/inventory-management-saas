import { and, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { FiEdit2, FiPlus, FiSearch } from "react-icons/fi";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteCustomer } from "@/server/customers";
import { db } from "@/db";
import { customers } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";

export const metadata = { title: "Customers | Hishab Khata" };

export default async function CustomersPage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { q = "", error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  const search = typeof q === "string" ? q.trim() : "";
  const filter = search
    ? and(
        eq(customers.storeId, store.id),
        or(
          ilike(customers.name, `%${search}%`),
          ilike(customers.email, `%${search}%`),
          ilike(customers.phone, `%${search}%`),
          ilike(customers.company, `%${search}%`),
        ),
      )
    : eq(customers.storeId, store.id);

  const customerList = await db
    .select()
    .from(customers)
    .where(filter)
    .orderBy(desc(customers.createdAt));

  const customersUrl = `/stores/${slug}/customers`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}`}>Overview</Link>
              </li>
              <li>Customers</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Customers</h1>
          <p className="mt-2 text-base-content/60">
            Manage your store customers and contact details.
          </p>
        </div>
        <Link href={`${customersUrl}/new`} className="btn btn-primary">
          <FiPlus size={18} aria-hidden="true" />
          New customer
        </Link>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error}</span>
        </div>
      )}

      <form action={customersUrl} className="flex gap-2">
        <label className="input w-full sm:max-w-md">
          <FiSearch size={18} aria-hidden="true" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search name, email, phone, or company"
          />
        </label>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        {customerList.length === 0 ? (
          <div className="card-body items-center py-16 text-center">
            <h2 className="card-title">
              {search ? "No matching customers" : "No customers yet"}
            </h2>
            <p className="max-w-md text-sm text-base-content/60">
              {search
                ? "Try another search term."
                : "Create your first customer to keep contact information and notes in one place."}
            </p>
            {!search && (
              <Link
                href={`${customersUrl}/new`}
                className="btn btn-primary mt-3"
              >
                Create customer
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerList.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-base-content/60">
                        {customer.notes
                          ? customer.notes.slice(0, 52)
                          : "No notes"}
                      </div>
                    </td>
                    <td>
                      <div className="font-mono text-sm">
                        {customer.email || "—"}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {customer.phone || "No phone"}
                      </div>
                    </td>
                    <td>{customer.company || "—"}</td>
                    <td>
                      <span
                        className={`badge ${customer.isActive ? "badge-success badge-soft" : "badge-ghost"}`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`${customersUrl}/${customer.id}/edit`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Edit ${customer.name}`}
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        <DeleteButton
                          action={deleteCustomer}
                          id={customer.id}
                          fieldName="customerId"
                          storeSlug={slug}
                          itemName={customer.name}
                          itemType="customer"
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
