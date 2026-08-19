"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
    FaGlobe,
    FaMoneyBillWave,
    FaPencilAlt,
    FaStore,
    FaTimes, FaEnvelope, FaTimes
} from "react-icons/fa";
import {
    updateStoreRegionalSettings, updateStoreName, deleteStore, requestStoreOwnershipTransfer, acceptStoreOwnershipTransfer,
    declineStoreOwnershipTransfer, } from "@/server/stores";

export function RegionalSettings({ store, storeSlug }) {
    const [editing, setEditing] = useState(false);

    const [state, formAction, pending] = useActionState(
        updateStoreRegionalSettings,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            setEditing(false);
        }
    }, [state?.success]);

    if (!editing) {
        return (
            <div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <p className="mb-1 text-sm text-base-content/55">
                            Country
                        </p>

                        <p className="font-medium">
                            {store.countryCode || "<Not set>"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm text-base-content/55">
                            Currency
                        </p>

                        <p className="font-medium">
                            {store.currencyCode || "<Not set>"}
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="mb-1 text-sm text-base-content/55">
                        Timezone
                    </p>

                    <p className="font-medium">
                        {store.timezone || "<Not set>"}
                    </p>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditing(true)}
                    >
                        <FaPencilAlt aria-hidden="true" />
                        Edit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form action={formAction}>
            <input
                type="hidden"
                name="storeSlug"
                value={storeSlug}
            />

            <fieldset
                disabled={pending}
                className="grid gap-5"
            >
                {/* Country + Currency */}
                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Country */}
                    <div className="form-control w-full">
                        <label
                            htmlFor="countryCode"
                            className="label mb-1"
                        >
                            <span className="label-text font-medium">
                                Country
                            </span>
                        </label>

                        <div className="input validator w-full">
                            <FaGlobe
                                className="text-base-content/50"
                                aria-hidden="true"
                            />

                            <input
                                id="countryCode"
                                name="countryCode"
                                type="text"
                                placeholder="BD"
                                maxLength={2}
                                defaultValue={
                                    store.countryCode || ""
                                }
                                title="Enter the country code"
                            />
                        </div>

                        <p className="label">
                            <span className="label-text-alt text-base-content/50">
                                Use a two-letter country code,
                                such as BD or US.
                            </span>
                        </p>
                    </div>

                    {/* Currency */}
                    <div className="form-control w-full">
                        <label
                            htmlFor="currencyCode"
                            className="label mb-1"
                        >
                            <span className="label-text font-medium">
                                Currency
                            </span>
                        </label>

                        <div className="input validator w-full">
                            <FaMoneyBillWave
                                className="text-base-content/50"
                                aria-hidden="true"
                            />

                            <input
                                id="currencyCode"
                                name="currencyCode"
                                type="text"
                                placeholder="BDT"
                                maxLength={3}
                                defaultValue={
                                    store.currencyCode || ""
                                }
                                title="Enter the currency code"
                            />
                        </div>

                        <p className="label">
                            <span className="label-text-alt text-base-content/50">
                                Use a three-letter currency
                                code, such as BDT or USD.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Timezone */}
                <div className="form-control w-full">
                    <label
                        htmlFor="timezone"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            Timezone
                        </span>
                    </label>

                    <input
                        id="timezone"
                        name="timezone"
                        type="text"
                        placeholder="Asia/Dhaka"
                        maxLength={100}
                        defaultValue={store.timezone || ""}
                        title="Enter the store timezone"
                        className="input input-bordered w-full"
                    />

                    <p className="label">
                        <span className="label-text-alt text-base-content/50">
                            Use an IANA timezone such as
                            Asia/Dhaka or
                            America/New_York.
                        </span>
                    </p>
                </div>

                {/* Response */}
                {state?.error && (
                    <div
                        role="alert"
                        className="alert alert-error"
                    >
                        <span>{state.error}</span>
                    </div>
                )}

                {state?.success && (
                    <div
                        role="status"
                        className="alert alert-success"
                    >
                        <span>{state.success}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-2 flex justify-end gap-2 border-t border-base-300 pt-5">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setEditing(false)}
                    >
                        <FaTimes aria-hidden="true" />
                        Cancel
                    </button>

                    <SubmitButton pending={pending} />
                </div>
            </fieldset>
        </form>
    );
}

export function StoreNameField({ store, storeSlug }) {
    const [editing, setEditing] = useState(false);

    const [state, formAction, pending] = useActionState(
        updateStoreName,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            setEditing(false);
        }
    }, [state?.success]);

    if (!editing) {
        return (
            <div>
                <p className="mb-1 text-sm text-base-content/55">
                    Store name
                </p>

                <div className="flex items-center gap-3">
                    <p className="font-medium">
                        {store.name || "<No store name>"}
                    </p>

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => setEditing(true)}
                        aria-label="Change store name"
                    >
                        <FaPencilAlt aria-hidden="true" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <label
                htmlFor="storeName"
                className="mb-2 block text-sm text-base-content/55"
            >
                Store name
            </label>

            <form
                action={formAction}
                className="flex items-center gap-2"
            >
                <input
                    type="hidden"
                    name="storeSlug"
                    value={storeSlug}
                />

                <div className="input validator flex-1">
                    <FaStore
                        className="text-base-content/50"
                        aria-hidden="true"
                    />

                    <input
                        id="storeName"
                        name="name"
                        type="text"
                        placeholder="e.g. Rahman Electronics"
                        defaultValue={store.name}
                        required
                        minLength={2}
                        maxLength={200}
                        autoFocus
                        disabled={pending}
                        title="Enter the store name"
                    />
                </div>

                <SubmitButton pending={pending} />

                <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() => setEditing(false)}
                    disabled={pending}
                    aria-label="Cancel store name change"
                >
                    <FaTimes aria-hidden="true" />
                </button>
            </form>

            {state?.error && (
                <div
                    role="alert"
                    className="alert alert-error mt-3"
                >
                    <span>{state.error}</span>
                </div>
            )}
        </div>
    );
}

export default function TransferStoreOwnershipForm({
    store,
    storeSlug,
}) {
    const [state, formAction, pending] = useActionState(
        requestStoreOwnershipTransfer,
        {
            error: "",
            success: "",
        },
    );

    return (
        <form action={formAction}>
            <input
                type="hidden"
                name="storeSlug"
                value={storeSlug}
            />

            {state.error && (
                <div
                    role="alert"
                    className="alert alert-error mb-5"
                >
                    <span>{state.error}</span>
                </div>
            )}

            {state.success && (
                <div
                    role="status"
                    className="alert alert-success mb-5"
                >
                    <span>{state.success}</span>
                </div>
            )}

            <fieldset className="grid gap-5">
                {/* Target email */}
                <div className="form-control w-full">
                    <label
                        htmlFor="targetEmail"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            New owner email{" "}
                            <span className="text-error">*</span>
                        </span>
                    </label>

                    <div className="input validator w-full">
                        <FaEnvelope
                            className="text-base-content/50"
                            aria-hidden="true"
                        />

                        <input
                            id="targetEmail"
                            name="targetEmail"
                            type="email"
                            placeholder="e.g. owner@example.com"
                            required
                            maxLength={320}
                            autoComplete="email"
                            title="Enter the email address of the new owner"
                        />
                    </div>

                    <p className="validator-hint hidden">
                        Enter a valid email address.
                    </p>

                    <p className="label">
                        <span className="label-text-alt text-base-content/50">
                            The person must have a Hishab Khata account
                            to accept the transfer.
                        </span>
                    </p>
                </div>

                {/* Confirmation notice */}
                <div className="alert alert-warning alert-soft">
                    <span className="text-sm">
                        Ownership will not change immediately. The new
                        owner must accept the transfer, and you must
                        confirm it afterward.
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-2 flex justify-end border-t border-base-300 pt-5">
                    <SubmitButton pending={pending} />
                </div>
            </fieldset>
        </form>
    );
}

export function DeleteStoreForm({ store, storeSlug }) {
    const [confirmation, setConfirmation] = useState("");
    const [deleteStoreOpen, setDeleteStoreOpen] = useState(false);

    const [state, formAction, pending] = useActionState(
        deleteStore,
        null,
    );

    const isConfirmed = confirmation === store.name;

    const handleCancel = () => {
        setDeleteStoreOpen(false);
        setConfirmation("");
    };

    return (
        <div>
            {!deleteStoreOpen ? (
                <button
                    type="button"
                    className="btn btn-error w-fit"
                    onClick={() => setDeleteStoreOpen(true)}
                >
                    Delete store
                </button>
            ) : (
                <form action={formAction}>
                    <input
                        type="hidden"
                        name="storeSlug"
                        value={storeSlug}
                    />

                    <div className="mt-2 rounded-lg border border-error/30 bg-error/5 p-4">
                        <p className="text-sm text-base-content/70">
                            Deleting this store is permanent. All
                            data associated with the store may also
                            be deleted.
                        </p>

                        <div className="mt-4 grid gap-2">
                            <label
                                htmlFor="delete-confirmation"
                                className="label"
                            >
                                <span className="label-text">
                                    Type{" "}
                                    <strong>{store.name}</strong>{" "}
                                    to confirm
                                </span>
                            </label>

                            <input
                                id="delete-confirmation"
                                name="confirmation"
                                type="text"
                                className="input input-bordered w-full max-w-md"
                                value={confirmation}
                                onChange={(event) =>
                                    setConfirmation(
                                        event.target.value,
                                    )
                                }
                                placeholder={store.name}
                                autoComplete="off"
                                required
                                disabled={pending}
                            />
                        </div>

                        {state?.error && (
                            <div
                                role="alert"
                                className="alert alert-error mt-4"
                            >
                                <span>{state.error}</span>
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="btn"
                                onClick={handleCancel}
                                disabled={pending}
                            >
                                Cancel
                            </button>

                                <DeleteSubmitButton disabled={!isConfirmed} pending={pending} />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

function DeleteSubmitButton({ disabled, pending }) {
    return (
        <button
            type="submit"
            className="btn btn-error"
            disabled={disabled || pending}
        >
            {pending && (
                <span className="loading loading-bars loading-sm" />
            )}

            {pending ? "Deleting store..." : "Delete store"}
        </button>
    );
}

function SubmitButton({ pending }) {
    return (
        <button
            type="submit"
            className="btn btn-primary"
            disabled={pending}
        >
            {pending && (
                <span className="loading loading-bars loading-sm" />
            )}

            {pending ? "Saving..." : "Save changes"}
        </button>
    );
}

export default function AcceptStoreTransferForm({
    token,
}) {
    const [acceptState, acceptAction] = useActionState(
        acceptStoreOwnershipTransfer,
        {
            error: "",
            success: "",
        },
    );

    const [declineState, declineAction] = useActionState(
        declineStoreOwnershipTransfer,
        initialState,
    );

    const error =
        acceptState.error || declineState.error;

    const success =
        acceptState.success || declineState.success;

    return (
        <div className="space-y-4">
            {error && (
                <div
                    role="alert"
                    className="alert alert-error"
                >
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="alert alert-success"
                >
                    <span>{success}</span>
                </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <form action={declineAction}>
                    <input
                        type="hidden"
                        name="token"
                        value={token}
                    />

                    <DeclineButton />
                </form>

                <form action={acceptAction}>
                    <input
                        type="hidden"
                        name="token"
                        value={token}
                    />

                    <AcceptButton />
                </form>
            </div>
        </div>
    );
}

function AcceptButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className="btn btn-primary"
            disabled={pending}
        >
            {pending ? (
                <span className="loading loading-bars loading-sm" />
            ) : (
                <FaCheck aria-hidden="true" />
            )}

            {pending
                ? "Accepting..."
                : "Accept transfer"}
        </button>
    );
}

function DeclineButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className="btn btn-ghost text-error"
            disabled={pending}
        >
            {pending ? (
                <span className="loading loading-bars loading-sm" />
            ) : (
                <FaTimes aria-hidden="true" />
            )}

            {pending
                ? "Declining..."
                : "Decline"}
        </button>
    );
}