"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiPackage,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteSale } from "@/server/sales";

export default function SaleForm({
  action,
  error,
  sale,
  customers,
  storeSlug,
}) {
  const salesUrl = `/stores/${storeSlug}/sales`;
  const isEdit = Boolean(sale);

  return (
    <form action={action}>
      <input type="hidden" name="storeSlug" value={storeSlug} />
      {isEdit && <input type="hidden" name="saleId" value={sale.id} />}

      {error && (
        <div role="alert" className="alert alert-error mb-5">
          <span>{error}</span>
        </div>
      )}

      <fieldset className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-control w-full">
            <label htmlFor="invoiceNumber" className="label mb-1">
              <span className="label-text font-medium">
                Invoice number <span className="text-error">*</span>
              </span>
            </label>
            <div className="input validator w-full">
              <FiTag className="text-base-content/50" aria-hidden="true" />
              <input
                id="invoiceNumber"
                name="invoiceNumber"
                type="text"
                placeholder="INV-1001"
                required
                maxLength={50}
                defaultValue={sale?.invoiceNumber || ""}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="customerId" className="label mb-1">
              <span className="label-text font-medium">Customer</span>
            </label>
            <div className="input validator w-full">
              <FiUsers className="text-base-content/50" aria-hidden="true" />
              <select
                id="customerId"
                name="customerId"
                className="w-full bg-transparent outline-none"
                defaultValue={sale?.customerId || ""}
              >
                <option value="">Walk-in customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-control w-full">
          <label htmlFor="itemDescription" className="label mb-1">
            <span className="label-text font-medium">
              Item description <span className="text-error">*</span>
            </span>
          </label>
          <div className="input validator w-full">
            <FiFileText className="text-base-content/50" aria-hidden="true" />
            <input
              id="itemDescription"
              name="itemDescription"
              type="text"
              placeholder="Premium Rice 5kg"
              required
              maxLength={5000}
              defaultValue={sale?.itemDescription || ""}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="form-control w-full">
            <label htmlFor="quantity" className="label mb-1">
              <span className="label-text font-medium">
                Quantity <span className="text-error">*</span>
              </span>
            </label>
            <div className="input validator w-full">
              <FiPackage className="text-base-content/50" aria-hidden="true" />
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={sale?.quantity ?? "1"}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="unitPrice" className="label mb-1">
              <span className="label-text font-medium">
                Unit price <span className="text-error">*</span>
              </span>
            </label>
            <div className="input validator w-full">
              <FiDollarSign
                className="text-base-content/50"
                aria-hidden="true"
              />
              <input
                id="unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={sale?.unitPrice ?? "0.00"}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="tax" className="label mb-1">
              <span className="label-text font-medium">Tax</span>
            </label>
            <div className="input validator w-full">
              <FiDollarSign
                className="text-base-content/50"
                aria-hidden="true"
              />
              <input
                id="tax"
                name="tax"
                type="number"
                min="0"
                step="0.01"
                defaultValue={sale?.tax ?? "0.00"}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="form-control w-full">
            <label htmlFor="discount" className="label mb-1">
              <span className="label-text font-medium">Discount</span>
            </label>
            <div className="input validator w-full">
              <FiDollarSign
                className="text-base-content/50"
                aria-hidden="true"
              />
              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={sale?.discount ?? "0.00"}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="saleDate" className="label mb-1">
              <span className="label-text font-medium">Sale date</span>
            </label>
            <div className="input validator w-full">
              <FiCalendar className="text-base-content/50" aria-hidden="true" />
              <input
                id="saleDate"
                name="saleDate"
                type="date"
                defaultValue={
                  sale?.saleDate
                    ? new Date(sale.saleDate).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)
                }
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="dueDate" className="label mb-1">
              <span className="label-text font-medium">Due date</span>
            </label>
            <div className="input validator w-full">
              <FiCalendar className="text-base-content/50" aria-hidden="true" />
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={
                  sale?.dueDate
                    ? new Date(sale.dueDate).toISOString().slice(0, 10)
                    : ""
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-control w-full">
            <label htmlFor="status" className="label mb-1">
              <span className="label-text font-medium">Status</span>
            </label>
            <div className="input validator w-full">
              <FiCreditCard
                className="text-base-content/50"
                aria-hidden="true"
              />
              <select
                id="status"
                name="status"
                className="w-full bg-transparent outline-none"
                defaultValue={sale?.status || "paid"}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="notes" className="label mb-1">
              <span className="label-text font-medium">Notes</span>
            </label>
            <div className="input validator w-full">
              <FiFileText className="text-base-content/50" aria-hidden="true" />
              <input
                id="notes"
                name="notes"
                type="text"
                maxLength={5000}
                placeholder="Optional notes"
                defaultValue={sale?.notes || ""}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {isEdit && (
            <DeleteButton
              action={deleteSale}
              id={sale.id}
              fieldName="saleId"
              storeSlug={storeSlug}
              itemName={sale.invoiceNumber}
              itemType="sale"
            />
          )}

          <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
            <Link href={salesUrl} className="btn btn-ghost">
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
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending && <span className="loading loading-bars loading-sm" />}
      {pending
        ? isEdit
          ? "Saving..."
          : "Creating..."
        : isEdit
          ? "Save changes"
          : "Create sale"}
    </button>
  );
}
