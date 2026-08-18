import { eq } from "drizzle-orm";
import Link from "next/link";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { db } from "@/db";
import { stores } from "@/db/schema/stores";
import { createExpense } from "@/server/expenses";

export const metadata = { title: "New expense | Hishab Khata" };

export default async function NewExpensePage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { error = "" } = await searchParams;

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  void store;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/expenses`}>Expenses</Link>
            </li>
            <li>New expense</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New expense</h1>
        <p className="mt-2 text-base-content/60">
          Add an operating cost or vendor payment.
        </p>
      </div>

      <ExpenseForm action={createExpense} error={error} storeSlug={slug} />
    </div>
  );
}
