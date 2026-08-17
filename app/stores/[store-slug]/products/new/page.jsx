import Link from "next/link";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "@/server/products";

export const metadata = { title: "New product | Hishab Khata" };

export default async function NewProductPage({ params, searchParams }) {
  const { "store-slug": slug } = await params;
  const { error = "" } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="breadcrumbs text-sm text-base-content/60">
          <ul>
            <li>
              <Link href={`/stores/${slug}/products`}>Products</Link>
            </li>
            <li>New product</li>
          </ul>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New product</h1>
        <p className="mt-2 text-base-content/60">
          Add the essential information needed to sell this product.
        </p>
      </div>
      <ProductForm action={createProduct} error={error} storeSlug={slug} />
    </div>
  );
}
