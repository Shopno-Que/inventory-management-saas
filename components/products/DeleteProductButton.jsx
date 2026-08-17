"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { FiTrash2 } from "react-icons/fi";
import { deleteProduct } from "@/server/products";

function DeleteProductSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-error"
      disabled={pending}
    >
      {pending && (
        <span className="loading loading-bars loading-sm" />
      )}

      {pending ? "Deleting..." : "Delete product"}
    </button>
  );
}

export default function DeleteProductButton({
  product,
  storeSlug,
  variant = "icon",
}) {
  const dialogRef = useRef(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        className={
          variant === "text"
            ? "btn btn-ghost text-error"
            : "btn btn-ghost btn-sm btn-square text-error"
        }
        aria-label={`Delete ${product.name}`}
        onClick={openDialog}
      >
        {variant === "text" ? (
          "Delete product"
        ) : (
          <FiTrash2 aria-hidden="true" />
        )}
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <dialog ref={dialogRef} className="modal">
            <div className="modal-box">
              <h2 className="text-xl font-semibold">
                Delete product?
              </h2>

              <p className="mt-3 text-base-content/70">
                Delete <strong>{product.name}</strong> from this
                store. This cannot be undone.
              </p>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => dialogRef.current?.close()}
                >
                  Cancel
                </button>

                <form action={deleteProduct}>
                  <input
                    type="hidden"
                    name="storeSlug"
                    value={storeSlug}
                  />

                  <input
                    type="hidden"
                    name="productId"
                    value={product.id}
                  />

                  <DeleteProductSubmitButton />
                </form>
              </div>
            </div>

            <form
              method="dialog"
              className="modal-backdrop"
            >
              <button type="submit" aria-label="Close delete confirmation">
                Close
              </button>
            </form>
          </dialog>,
          document.body
        )}
    </>
  );
}