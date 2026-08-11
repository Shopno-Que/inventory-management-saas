"use client";

import { useState } from "react";

export default function StoreInformationStep({
    form,
    updateForm,
    onNext,
    pending,
}) {
    const [errors, setErrors] = useState({
        name: false,
        slug: false,
    });

    const [slugManuallyEdited, setSlugManuallyEdited] =
        useState(false);

    const generateSlug = (value) => {
        const english = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        if (english) {
            return english.slice(0, 100);
        }

        // Fallback for non-Latin names
        return `store-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
    };

    const handleNext = () => {
        const name = form.name.trim();
        const slug = form.slug.trim();

        const nameInvalid =
            name.length < 2 || name.length > 100;

        const slugInvalid =
            slug.length < 2 ||
            slug.length > 100 ||
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

        setErrors({
            name: nameInvalid,
            slug: slugInvalid,
        });

        if (nameInvalid || slugInvalid) {
            return;
        }

        updateForm({
            name,
            slug,
        });

        onNext();
    };

    const handleKeyDown = (event) => {
        if (event.key !== "Enter") return;

        event.preventDefault();

        handleNext();
    };

    return (
        <fieldset
            className="grid gap-5"
            disabled={pending}
            onKeyDown={handleKeyDown}
        >
            <legend className="sr-only">
                স্টোরের তথ্য
            </legend>

            <header>
                <h2 className="text-xl font-semibold">
                    স্টোরের তথ্য
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                    আপনার স্টোরের নাম এবং URL সেট করুন।
                </p>
            </header>

            {/* Store Name */}
            <div className="form-control w-full">
                <label
                    htmlFor="storeName"
                    className="label mb-1"
                >
                    <span className="label-text font-medium">
                        স্টোরের নাম{" "}
                        <span
                            className="text-error"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </span>
                </label>

                <input
                    id="storeName"
                    name="name"
                    type="text"
                    className={`input input-bordered w-full ${errors.name
                            ? "input-error"
                            : ""
                        }`}
                    value={form.name}
                    onChange={(event) => {
                        const name = event.target.value;

                        setErrors((current) => ({
                            ...current,
                            name: false,
                        }));

                        updateForm({
                            name,
                            ...(!slugManuallyEdited && {
                                slug: generateSlug(name),
                            }),
                        });
                    }}
                    placeholder="আমার দোকান"
                    minLength={2}
                    maxLength={100}
                    required
                    aria-invalid={errors.name}
                    aria-describedby={
                        errors.name
                            ? "storeName-error"
                            : undefined
                    }
                />

                {errors.name && (
                    <p
                        id="storeName-error"
                        className="mt-1 text-sm text-error"
                    >
                        স্টোরের নাম ২ থেকে ১০০ অক্ষরের
                        মধ্যে হতে হবে।
                    </p>
                )}
            </div>

            {/* Store Slug */}
            <div className="form-control w-full">
                <label
                    htmlFor="storeSlug"
                    className="label mb-1"
                >
                    <span className="label-text font-medium">
                        স্টোর URL{" "}
                        <span
                            className="text-error"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </span>
                </label>

                <label
                    className={`input input-bordered flex items-center gap-2 ${errors.slug
                            ? "input-error"
                            : ""
                        }`}
                >
                    <span
                        className="text-base-content/50"
                        aria-hidden="true"
                    >
                        @
                    </span>

                    <input
                        id="storeSlug"
                        name="slug"
                        type="text"
                        className="grow"
                        value={form.slug}
                        onChange={(event) => {
                            setSlugManuallyEdited(true);

                            setErrors((current) => ({
                                ...current,
                                slug: false,
                            }));

                            updateForm({
                                slug: event.target.value
                                    .toLowerCase()
                                    .replace(
                                        /\s+/g,
                                        "-",
                                    )
                                    .replace(
                                        /[^a-z0-9-]/g,
                                        "",
                                    ),
                            });
                        }}
                        placeholder="amar-dokan"
                        minLength={2}
                        maxLength={100}
                        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                        required
                        aria-invalid={errors.slug}
                        aria-describedby={
                            errors.slug
                                ? "storeSlug-error"
                                : undefined
                        }
                    />
                </label>

                {errors.slug && (
                    <p
                        id="storeSlug-error"
                        className="mt-1 text-sm text-error"
                    >
                        ২ থেকে ১০০ অক্ষরের মধ্যে শুধু
                        ছোট হাতের ইংরেজি অক্ষর, সংখ্যা
                        এবং হাইফেন ব্যবহার করুন।
                    </p>
                )}
            </div>

            {/* Next */}
            <div className="flex justify-end">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={pending}
                >
                    পরবর্তী
                </button>
            </div>
        </fieldset>
    );
}