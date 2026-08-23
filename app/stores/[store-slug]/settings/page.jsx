import Link from "next/link";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { stores } from "@/db/schema/store";
import { createClient } from "@/lib/supabase/server";

import { RegionalSettings, StoreNameField, TransferStoreOwnershipForm, DeleteStoreForm } from "@/components/store/StoreSettingsForm";

export const metadata = {
  title: "Store settings | Hishab Khata",
};

export default async function StoreSettingsPage({ params }) {
  const { "store-slug": slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [store] = await db
    .select()
    .from(stores)
    .where(
      and(
        eq(stores.slug, slug),
        eq(stores.ownerId, user.id),
      ),
    )
    .limit(1);

  if (!store) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}`}>Overview</Link>
            </li>
            <li>Settings</li>
          </ul>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Store settings
        </h1>

        <p className="mt-2 text-base-content/60">
          Manage your store information and workspace settings.
        </p>
      </div>
      {/* Store Information */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">
            Store information
          </h2>

          <div className="grid gap-5">
            {/* Store name */}
            <StoreNameField
              store={store}
              storeSlug={slug}
            />

            {/* Slug */}
            <div>
              <p className="mb-1 text-sm text-base-content/55">
                Store slug
              </p>

              <div className="flex items-center gap-3">
                <p className="font-medium break-all">
                  {store.slug}
                </p>
              </div>

              <p className="mt-1 text-sm text-base-content/50">
                This is used in your store URL and
                cannot be changed here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Settings */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div>
            <h2 className="card-title">
              Regional settings
            </h2>

            <p className="mt-1 text-sm text-base-content/55">
              Configure your store&apos;s country,
              currency, and timezone.
            </p>
          </div>

          <div className="divider my-0" />

          <RegionalSettings
            store={store}
            storeSlug={slug}
          />
        </div>
      </section>

      {/* Ownership */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div>
            <h2 className="card-title">Store ownership</h2>

            <p className="mt-1 text-sm text-base-content/60">
              Transfer ownership of this store to another
              registered account.
            </p>
          </div>

          <TransferStoreOwnershipForm
            store={store}
            storeSlug={slug}
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className="card border border-error/30 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-error">
            Danger Zone
          </h2>

          <p className="text-sm text-base-content/60">
            Permanently delete this store. This action cannot be
            undone.
          </p>

          <DeleteStoreForm
            store={store}
            storeSlug={slug}
          />
        </div>
      </section>
    </div>
  );
}