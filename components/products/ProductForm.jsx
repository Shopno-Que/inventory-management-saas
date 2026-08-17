"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  FaBarcode,
  FaBox,
  FaMoneyBillWave,
  FaTag,
} from "react-icons/fa";
import { deleteProduct } from "@/server/products";
import DeleteProductButton from "@/components/products/DeleteProductButton";

export default function ProductForm({ action, error, product, storeSlug }) {

const productsUrl = `/stores/${ storeSlug }/products`;
const isEdit = Boolean(product);

return (
  <form action={action}>
    <input type="hidden" name="storeSlug" value={storeSlug} />

    {isEdit && (
      <input type="hidden" name="productId" value={product.id} />
    )}

    {error && (
      <div role="alert" className="alert alert-error mb-5">
        <span>{error}</span>
      </div>
    )}

    <fieldset className="grid gap-5">
      {/* Product Name */}
      <div className="form-control w-full">
        <label htmlFor="name" className="label mb-1">
          <span className="label-text font-medium">
            Product name <span className="text-error">*</span>
          </span>
        </label>

        <div className="input validator w-full">
          <FaTag
            className="text-base-content/50"
            aria-hidden="true"
          />

          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Premium Rice 5kg"
            required
            minLength={2}
            maxLength={200}
            defaultValue={product?.name || ""}
            title="Enter the product name"
          />
        </div>

        <p className="validator-hint hidden">
          Product name is required and must be between 2 and 200
          characters.
        </p>
      </div>

      {/* SKU + Barcode */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* SKU */}
        <div className="form-control w-full">
          <label htmlFor="sku" className="label mb-1">
            <span className="label-text font-medium">SKU</span>
          </label>

          <div className="input validator w-full">
            <FaBox
              className="text-base-content/50"
              aria-hidden="true"
            />

            <input
              id="sku"
              name="sku"
              type="text"
              placeholder="e.g. RICE-5KG"
              maxLength={100}
              defaultValue={product?.sku || ""}
              title="Optional product SKU"
            />
          </div>

          <p className="validator-hint hidden">
            SKU must be 100 characters or fewer.
          </p>

          <p className="label">
            <span className="label-text-alt text-base-content/50">
              Optional. Must be unique within this store.
            </span>
          </p>
        </div>

        {/* Barcode */}
        <div className="form-control w-full">
          <label htmlFor="barcode" className="label mb-1">
            <span className="label-text font-medium">Barcode</span>
          </label>

          <div className="input validator w-full">
            <FaBarcode
              className="text-base-content/50"
              aria-hidden="true"
            />

            <input
              id="barcode"
              name="barcode"
              type="text"
              placeholder="e.g. 8941234567890"
              maxLength={100}
              defaultValue={product?.barcode || ""}
              title="Optional product barcode"
            />
          </div>

          <p className="validator-hint hidden">
            Barcode must be 100 characters or fewer.
          </p>
        </div>
      </div>

      {/* Pricing + Unit */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Sale Price */}
        <div className="form-control w-full">
          <label htmlFor="salePrice" className="label mb-1">
            <span className="label-text font-medium">
              Sale price <span className="text-error">*</span>
            </span>
          </label>

          <div className="input validator w-full">
            <FaMoneyBillWave
              className="text-base-content/50"
              aria-hidden="true"
            />

            <input
              id="salePrice"
              name="salePrice"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              defaultValue={product?.salePrice ?? "0.00"}
              title="Enter the product sale price"
            />
          </div>

          <p className="validator-hint hidden">
            Sale price is required and cannot be negative.
          </p>
        </div>

        {/* Cost Price */}
        <div className="form-control w-full">
          <label htmlFor="costPrice" className="label mb-1">
            <span className="label-text font-medium">Cost price</span>
          </label>

          <div className="input validator w-full">
            <FaMoneyBillWave
              className="text-base-content/50"
              aria-hidden="true"
            />

            <input
              id="costPrice"
              name="costPrice"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              defaultValue={product?.costPrice ?? ""}
              title="Optional product cost price"
            />
          </div>

          <p className="validator-hint hidden">
            Cost price cannot be negative.
          </p>
        </div>

        {/* Unit */}
        <div className="form-control w-full">
          <label htmlFor="unit" className="label mb-1">
            <span className="label-text font-medium">
              Unit <span className="text-error">*</span>
            </span>
          </label>

          <div className="input validator w-full">
            <FaBox
              className="text-base-content/50"
              aria-hidden="true"
            />

            <input
              id="unit"
              name="unit"
              type="text"
              placeholder="piece, kg, litre"
              required
              maxLength={40}
              defaultValue={product?.unit || "piece"}
              title="Enter the product unit"
            />
          </div>

          <p className="validator-hint hidden">
            Unit is required and must be 40 characters or fewer.
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="form-control w-full">
        <label htmlFor="description" className="label mb-1">
          <span className="label-text font-medium">Description</span>
        </label>

        <textarea
          id="description"
          name="description"
          className="textarea validator h-28 w-full"
          placeholder="Optional details about this product"
          maxLength={5000}
          defaultValue={product?.description || ""}
          title="Optional product description"
        />

        <p className="validator-hint hidden">
          Description must be 5000 characters or fewer.
        </p>
      </div>

      {/* Active Status */}
      <div className="form-control">
        <label
          htmlFor="isActive"
          className="flex w-fit cursor-pointer items-center gap-3"
        >
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            className="checkbox"
            defaultChecked={product ? product.isActive : true}
          />

          <span className="text-sm">
            Product is active and available for sale
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
        {isEdit && (
          <DeleteProductButton
            product={product}
            storeSlug={storeSlug}
            variant="text"
          />
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:ml-auto">
          <Link href={productsUrl} className="btn btn-ghost">
            Cancel
          </Link>

          <SubmitButton isEdit={isEdit} />
        </div>
      </div>
    </fieldset>
  </form>
);
}

function SubmitButton({ isEdit }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary"
      disabled={pending}
    >
      {pending && (
        <span className="loading loading-bars loading-sm" />
      )}

      {pending
        ? isEdit
          ? "Saving..."
          : "Creating..."
        : isEdit
          ? "Save changes"
          : "Create product"}
    </button>
  );
}