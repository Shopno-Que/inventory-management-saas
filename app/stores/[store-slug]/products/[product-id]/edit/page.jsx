import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { db } from "@/db";
import { products } from "@/db/schema/store";
import { stores } from "@/db/schema/stores";
import { updateProduct } from "@/server/products";

export const metadata = { title: "Edit product | Hishab Khata" };

export default async function EditProductPage({ params, searchParams }) {
  const { "store-slug": slug, "product-id": productId } = await params;
  const { error = "" } = await searchParams;
  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.slug, slug))
    .limit(1);
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.storeId, store.id)))
    .limit(1);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/products`}>Products</Link>
            </li>
            <li>Edit product</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit product</h1>
        <p className="mt-2 text-base-content/60">Update {product.name}.</p>
      </div>
      <ProductForm
        action={updateProduct}
        error={error}
        product={product}
        storeSlug={slug}
      />
    </div>
  );
}
