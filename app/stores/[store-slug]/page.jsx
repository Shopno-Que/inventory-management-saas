import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  FiArrowUpRight,
  FiDollarSign,
  FiPackage,
  FiTrendingDown,
  FiUsers,
} from "react-icons/fi";
import { db } from "@/db";
import { customers, expenses, products, sales } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";

export const metadata = {
  title: "Store dashboard | Hishab Khata",
};

function formatMoney(value, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(Number(value || 0));
}

export default async function StoreDashboard({ params }) {
  const { "store-slug": slug } = await params;

  const [store] = await db
    .select({
      id: stores.id,
      currencyCode: stores.currencyCode,
    })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);

  if (!store) notFound();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const [productStats] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.storeId, store.id));

  const [customerStats] = await db
    .select({ count: count() })
    .from(customers)
    .where(eq(customers.storeId, store.id));

  const [saleStats] = await db
    .select({
      count: count(),
      revenue: sql`COALESCE(SUM(${sales.total}), 0)::numeric`.as("revenue"),
    })
    .from(sales)
    .where(
      and(
        eq(sales.storeId, store.id),
        gte(sales.saleDate, monthStart),
        lt(sales.saleDate, monthEnd),
      ),
    );

  const [expenseStats] = await db
    .select({
      count: count(),
      total: sql`COALESCE(SUM(${expenses.amount}), 0)::numeric`.as("total"),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.storeId, store.id),
        gte(expenses.expenseDate, monthStart),
        lt(expenses.expenseDate, monthEnd),
      ),
    );

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-base-content/60">Store dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Overview</h1>
          <p className="mt-2 max-w-2xl text-base-content/60">
            Your store is synced with live product, customer, sales, and expense
            data.
          </p>
        </div>

        <span className="badge badge-ghost gap-2 self-start sm:self-auto">
          <span className="status status-success" aria-hidden="true" />@{slug}
        </span>
      </section>

      <section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Store summary"
      >
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiPackage
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Products</p>
              <p className="mt-1 text-2xl font-semibold">
                {productStats.count}
              </p>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiUsers
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Customers</p>
              <p className="mt-1 text-2xl font-semibold">
                {customerStats.count}
              </p>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiDollarSign
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">Sales this month</p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(saleStats.revenue, store.currencyCode)}
              </p>
              <p className="text-xs text-base-content/60">
                {saleStats.count} invoices
              </p>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <FiTrendingDown
              className="text-base-content/60"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-base-content/60">
                Expenses this month
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatMoney(expenseStats.total, store.currencyCode)}
              </p>
              <p className="text-xs text-base-content/60">
                {expenseStats.count} records
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="card-title">Build your daily workflow</h2>
              <p className="mt-1 max-w-xl text-sm text-base-content/60">
                This dashboard is powered by live store data for products,
                customers, sales, and expenses.
              </p>
            </div>
            <span className="badge badge-ghost self-start">Live overview</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Manage products", "Track customers", "Record sales"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-box border border-base-300 p-4"
                >
                  <span className="font-medium">{item}</span>
                  <FiArrowUpRight
                    className="text-base-content/40"
                    aria-hidden="true"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
