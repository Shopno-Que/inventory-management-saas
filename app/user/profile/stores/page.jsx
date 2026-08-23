import Link from "next/link";
import { redirect } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { stores, storeMembers } from "@/db/schema/store";
import { and, eq, or } from "drizzle-orm";

export const metadata = {
  title: "স্টোরসমূহ | হিসাব খাতা",
};

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/user/login");
  }

  const accessibleStores = await db
    .select({
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      logoUrl: stores.logoUrl,
      currencyCode: stores.currencyCode,
      timezone: stores.timezone,
      countryCode: stores.countryCode,
      ownerId: stores.ownerId,
      memberStatus: storeMembers.status,
    })
    .from(stores)
    .leftJoin(
      storeMembers,
      and(
        eq(storeMembers.storeId, stores.id),
        eq(storeMembers.userId, user.id),
      ),
    )
    .where(
      or(
        eq(stores.ownerId, user.id),
        eq(storeMembers.userId, user.id),
      ),
    )
    .orderBy(stores.name)
    .execute();

  return (
    <main className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">স্টোরসমূহ</h1>
          <p className="mt-1 text-sm text-base-content/60">
            আপনার স্টোর এবং যেসব স্টোরে আপনার অ্যাক্সেস আছে।
          </p>
        </div>

        <Link href="/stores/new" className="btn btn-primary">
          <FiPlus size={18} />
          নতুন স্টোর
        </Link>
      </div>

      {accessibleStores.length === 0 ? (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body items-center py-12 text-center">
            <FaStore size={40} className="text-base-content/40" />

            <h2 className="card-title mt-2">কোনো স্টোর নেই</h2>

            <p className="text-sm text-base-content/60">
              আপনার প্রথম স্টোর তৈরি করে শুরু করুন।
            </p>

            <Link href="/stores/new" className="btn btn-primary mt-2">
              <FiPlus size={18} />
              নতুন স্টোর তৈরি করুন
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {accessibleStores.map((store) => {
            const isOwner = store.ownerId === user.id;

            return (
              <article
                key={store.id}
                className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="h-14 w-14 rounded-xl bg-primary text-primary-content">
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={`${store.name} logo`}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xl font-bold">
                            {store.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold">
                        {store.name}
                      </h2>

                      <p className="truncate text-sm text-base-content/50">
                        @{store.slug}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="badge badge-ghost">
                      {isOwner ? "মালিক" : "সদস্য"}
                    </span>

                    {store.memberStatus && !isOwner && (
                      <span className="badge badge-outline">
                        {store.memberStatus}
                      </span>
                    )}
                  </div>

                  <div className="card-actions mt-4">
                    <Link
                      href={`/stores/${store.slug}`}
                      className="btn btn-primary btn-sm w-full"
                    >
                      স্টোরে যান
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}