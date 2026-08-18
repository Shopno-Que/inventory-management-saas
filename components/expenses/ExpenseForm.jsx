"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteExpense } from "@/server/expenses";

export default function ExpenseForm({ action, error, expense, storeSlug }) {
  const expensesUrl = `/stores/${storeSlug}/expenses`;
  const isEdit = Boolean(expense);

  return (
    <form action={action}>
      <input type="hidden" name="storeSlug" value={storeSlug} />
      {isEdit && <input type="hidden" name="expenseId" value={expense.id} />}

      {error && (
        <div role="alert" className="alert alert-error mb-5">
          <span>{error}</span>
        </div>
      )}

      <fieldset className="grid gap-5">
        <div className="form-control w-full">
          <label htmlFor="title" className="label mb-1">
            <span className="label-text font-medium">
              Expense title <span className="text-error">*</span>
            </span>
          </label>
          <div className="input validator w-full">
            <FiTag className="text-base-content/50" aria-hidden="true" />
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Rent, utilities, supplies"
              required
              maxLength={200}
              defaultValue={expense?.title || ""}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-control w-full">
            <label htmlFor="category" className="label mb-1">
              <span className="label-text font-medium">Category</span>
            </label>
            <div className="input validator w-full">
              <FiFileText className="text-base-content/50" aria-hidden="true" />
              <input
                id="category"
                name="category"
                type="text"
                maxLength={80}
                placeholder="Utilities"
                defaultValue={expense?.category || ""}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="vendor" className="label mb-1">
              <span className="label-text font-medium">Vendor</span>
            </label>
            <div className="input validator w-full">
              <FiTruck className="text-base-content/50" aria-hidden="true" />
              <input
                id="vendor"
                name="vendor"
                type="text"
                maxLength={200}
                placeholder="Provider name"
                defaultValue={expense?.vendor || ""}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="form-control w-full">
            <label htmlFor="amount" className="label mb-1">
              <span className="label-text font-medium">
                Amount <span className="text-error">*</span>
              </span>
            </label>
            <div className="input validator w-full">
              <FiDollarSign
                className="text-base-content/50"
                aria-hidden="true"
              />
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={expense?.amount ?? "0.00"}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="expenseDate" className="label mb-1">
              <span className="label-text font-medium">Expense date</span>
            </label>
            <div className="input validator w-full">
              <FiCalendar className="text-base-content/50" aria-hidden="true" />
              <input
                id="expenseDate"
                name="expenseDate"
                type="date"
                defaultValue={
                  expense?.expenseDate
                    ? new Date(expense.expenseDate).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)
                }
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label htmlFor="paymentMethod" className="label mb-1">
              <span className="label-text font-medium">Payment method</span>
            </label>
            <div className="input validator w-full">
              <FiCreditCard
                className="text-base-content/50"
                aria-hidden="true"
              />
              <input
                id="paymentMethod"
                name="paymentMethod"
                type="text"
                maxLength={50}
                placeholder="Cash, bank, card"
                defaultValue={expense?.paymentMethod || ""}
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
                defaultValue={expense?.status || "paid"}
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
                placeholder="Optional details"
                defaultValue={expense?.notes || ""}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {isEdit && (
            <DeleteButton
              action={deleteExpense}
              id={expense.id}
              fieldName="expenseId"
              storeSlug={storeSlug}
              itemName={expense.title}
              itemType="expense"
            />
          )}

          <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
            <Link href={expensesUrl} className="btn btn-ghost">
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
          : "Create expense"}
    </button>
  );
}
