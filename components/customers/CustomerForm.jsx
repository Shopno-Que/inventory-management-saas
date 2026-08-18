"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { FiBriefcase, FiMail, FiPhone, FiUser } from "react-icons/fi";
import DeleteButton from "@/components/crud/DeleteButton";
import { deleteCustomer } from "@/server/customers";

export default function CustomerForm({ action, error, customer, storeSlug }) {
  const customersUrl = `/stores/${storeSlug}/customers`;
  const isEdit = Boolean(customer);

  return (
    <form action={action}>
      <input type="hidden" name="storeSlug" value={storeSlug} />
      {isEdit && <input type="hidden" name="customerId" value={customer.id} />}

      {error && (
        <div role="alert" className="alert alert-error mb-5">
          <span>{error}</span>
        </div>
      )}

      <fieldset className="grid gap-5">
        <div className="form-control w-full">
          <label htmlFor="name" className="label mb-1">
            <span className="label-text font-medium">
              Customer name <span className="text-error">*</span>
            </span>
          </label>

          <div className="input validator w-full">
            <FiUser className="text-base-content/50" aria-hidden="true" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Rahim Uddin"
              required
              minLength={2}
              maxLength={200}
              defaultValue={customer?.name || ""}
              title="Enter the customer name"
            />
          </div>

          <p className="validator-hint hidden">
            Customer name is required and must be between 2 and 200 characters.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-control w-full">
            <label htmlFor="email" className="label mb-1">
              <span className="label-text font-medium">Email</span>
            </label>

            <div className="input validator w-full">
              <FiMail className="text-base-content/50" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. rahim@example.com"
                maxLength={255}
                defaultValue={customer?.email || ""}
                title="Optional customer email"
              />
            </div>

            <p className="validator-hint hidden">
              Email must be valid and 255 characters or fewer.
            </p>
          </div>

          <div className="form-control w-full">
            <label htmlFor="phone" className="label mb-1">
              <span className="label-text font-medium">Phone</span>
            </label>

            <div className="input validator w-full">
              <FiPhone className="text-base-content/50" aria-hidden="true" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +8801700000000"
                maxLength={40}
                defaultValue={customer?.phone || ""}
                title="Optional customer phone"
              />
            </div>

            <p className="validator-hint hidden">
              Phone must be 40 characters or fewer.
            </p>
          </div>
        </div>

        <div className="form-control w-full">
          <label htmlFor="company" className="label mb-1">
            <span className="label-text font-medium">Company</span>
          </label>

          <div className="input validator w-full">
            <FiBriefcase className="text-base-content/50" aria-hidden="true" />
            <input
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Green Mart"
              maxLength={200}
              defaultValue={customer?.company || ""}
              title="Optional company name"
            />
          </div>

          <p className="validator-hint hidden">
            Company must be 200 characters or fewer.
          </p>
        </div>

        <div className="form-control w-full">
          <label htmlFor="notes" className="label mb-1">
            <span className="label-text font-medium">Notes</span>
          </label>

          <textarea
            id="notes"
            name="notes"
            className="textarea validator h-28 w-full"
            placeholder="Optional customer notes or preferences"
            maxLength={5000}
            defaultValue={customer?.notes || ""}
            title="Optional customer notes"
          />

          <p className="validator-hint hidden">
            Notes must be 5000 characters or fewer.
          </p>
        </div>

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
              defaultChecked={customer ? customer.isActive : true}
            />

            <span className="text-sm">Customer is active</span>
          </label>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {isEdit && (
            <DeleteButton
              action={deleteCustomer}
              id={customer.id}
              fieldName="customerId"
              storeSlug={storeSlug}
              itemName={customer.name}
              itemType="customer"
            />
          )}

          <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
            <Link href={customersUrl} className="btn btn-ghost">
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
          : "Create customer"}
    </button>
  );
}
