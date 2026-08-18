import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { db } from "@/db";
import { expenses } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { updateExpense } from "@/server/expenses";

export const metadata = { title: "Edit expense | Hishab Khata" };

export default async function EditExpensePage({ params, searchParams }) {
  const { "store-slug": slug, "expense-id": expenseId } = await params;
  const { error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);
  const [expense] = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.storeId, store.id)))
    .limit(1);

  if (!expense) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/expenses`}>Expenses</Link>
            </li>
            <li>Edit expense</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit expense</h1>
        <p className="mt-2 text-base-content/60">Update {expense.title}.</p>
      </div>

      <ExpenseForm
        action={updateExpense}
        error={error}
        expense={expense}
        storeSlug={slug}
      />
    </div>
  );
}
