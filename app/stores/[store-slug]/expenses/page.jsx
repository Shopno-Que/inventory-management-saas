import { and, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { FiEdit2, FiPlus, FiSearch } from "react-icons/fi";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteExpense } from "@/server/expenses";
import { db } from "@/db";
import { expenses } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";

export const metadata = { title: "Expenses | Hishab Khata" };

function formatMoney(value, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(Number(value || 0));
}

export default async function ExpensesPage({ params, searchParams }) {
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
        eq(expenses.storeId, store.id),
        or(
          ilike(expenses.title, `%${search}%`),
          ilike(expenses.category, `%${search}%`),
          ilike(expenses.vendor, `%${search}%`),
        ),
      )
    : eq(expenses.storeId, store.id);

  const expenseList = await db
    .select()
    .from(expenses)
    .where(filter)
    .orderBy(desc(expenses.expenseDate));

  const expensesUrl = `/stores/${slug}/expenses`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="breadcrumbs text-sm text-base-content/60">
            <ul>
              <li>
                <Link href={`/stores/${slug}`}>Overview</Link>
              </li>
              <li>Expenses</li>
            </ul>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="mt-2 text-base-content/60">
            Track operating costs and vendor payments.
          </p>
        </div>
        <Link href={`${expensesUrl}/new`} className="btn btn-primary">
          <FiPlus size={18} aria-hidden="true" />
          New expense
        </Link>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error}</span>
        </div>
      )}

      <form action={expensesUrl} className="flex gap-2">
        <label className="input w-full sm:max-w-md">
          <FiSearch size={18} aria-hidden="true" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search title, category, or vendor"
          />
        </label>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        {expenseList.length === 0 ? (
          <div className="card-body items-center py-16 text-center">
            <h2 className="card-title">
              {search ? "No matching expenses" : "No expenses yet"}
            </h2>
            <p className="max-w-md text-sm text-base-content/60">
              {search
                ? "Try another search term."
                : "Create your first expense to track spending."}
            </p>
            {!search && (
              <Link
                href={`${expensesUrl}/new`}
                className="btn btn-primary mt-3"
              >
                Create expense
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="font-medium">{expense.title}</div>
                      <div className="text-sm text-base-content/60">
                        {expense.vendor || "No vendor"}
                      </div>
                    </td>
                    <td>{expense.category || "—"}</td>
                    <td>{formatMoney(expense.amount, store.currencyCode)}</td>
                    <td>
                      <span
                        className={`badge ${expense.status === "paid" ? "badge-success badge-soft" : "badge-ghost"}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`${expensesUrl}/${expense.id}/edit`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Edit ${expense.title}`}
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        <DeleteButton
                          action={deleteExpense}
                          id={expense.id}
                          fieldName="expenseId"
                          storeSlug={slug}
                          itemName={expense.title}
                          itemType="expense"
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
