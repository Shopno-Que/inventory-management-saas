"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { FiTrash2 } from "react-icons/fi";

function DeleteSubmitButton({ label }) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className="btn btn-error" disabled={pending}>
            {pending && <span className="loading loading-bars loading-sm" />}
            {pending ? "Deleting..." : label}
        </button>
    );
}

export default function DeleteButton({
    action,
    id,
    fieldName,
    storeSlug,
    itemName,
    itemType,
    variant = "icon",
}) {
    const dialogRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const deleteLabel = `Delete ${itemType}`;

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
                aria-label={`${deleteLabel} ${itemName}`}
                onClick={openDialog}
            >
                {variant === "text" ? (
                    deleteLabel
                ) : (
                    <FiTrash2 aria-hidden="true" />
                )}
            </button>

            {mounted &&
                createPortal(
                    <dialog ref={dialogRef} className="modal">
                        <div className="modal-box">
                            <h2 className="text-xl font-semibold">
                                {deleteLabel}?
                            </h2>

                            <p className="mt-3 text-base-content/70">
                                Delete{" "}
                                <strong>{itemName}</strong> from this
                                store. This cannot be undone.
                            </p>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() =>
                                        dialogRef.current?.close()
                                    }
                                >
                                    Cancel
                                </button>

                                <form action={action}>
                                    <input
                                        type="hidden"
                                        name="storeSlug"
                                        value={storeSlug}
                                    />

                                    <input
                                        type="hidden"
                                        name={fieldName}
                                        value={id}
                                    />

                                    <DeleteSubmitButton
                                        label={deleteLabel}
                                    />
                                </form>
                            </div>
                        </div>

                        <form
                            method="dialog"
                            className="modal-backdrop"
                        >
                            <button
                                type="submit"
                                aria-label="Close delete confirmation"
                            >
                                Close
                            </button>
                        </form>
                    </dialog>,
                    document.body,
                )}
        </>
    );
}