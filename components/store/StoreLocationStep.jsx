"use client";

import { useState } from "react";

export default function StoreLocationStep({
    form,
    updateForm,
    onBack,
    onNext,
    pending,
}) {
    const [errors, setErrors] = useState({
        countryCode: false,
        currencyCode: false,
        timezone: false,
    });

    const handleNext = () => {
        const countryCode =
            form.countryCode.trim().toUpperCase();

        const currencyCode =
            form.currencyCode.trim().toUpperCase();

        const timezone = form.timezone.trim();

        /*
         * These fields are optional.
         *
         * If a value is provided, validate it.
         * Empty values are completely valid.
         */
        const countryInvalid =
            countryCode !== "" &&
            !/^[A-Z]{2}(-[A-Z]{2})?$/.test(
                countryCode,
            );

        const currencyInvalid =
            currencyCode !== "" &&
            !/^[A-Z]{3}$/.test(currencyCode);

        const timezoneInvalid =
            timezone !== "" &&
            !/^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)*$/.test(
                timezone,
            );

        setErrors({
            countryCode: countryInvalid,
            currencyCode: currencyInvalid,
            timezone: timezoneInvalid,
        });

        if (
            countryInvalid ||
            currencyInvalid ||
            timezoneInvalid
        ) {
            return;
        }

        updateForm({
            countryCode,
            currencyCode,
            timezone,
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
                অবস্থান ও মুদ্রা
            </legend>

            <header>
                <h2 className="text-xl font-semibold">
                    অবস্থান ও মুদ্রা
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                    আপনার স্টোরের দেশ, মুদ্রা এবং
                    টাইমজোন নির্বাচন করুন।
                </p>
            </header>

            {/* Country */}
            <div className="form-control w-full">
                <label
                    htmlFor="countryCode"
                    className="label mb-1"
                >
                    <span className="label-text font-medium">
                        দেশ / অঞ্চল
                    </span>

                    <span className="label-text-alt text-base-content/50">
                        (ঐচ্ছিক)
                    </span>
                </label>

                <select
                    id="countryCode"
                    name="countryCode"
                    className={`select select-bordered w-full ${errors.countryCode
                            ? "select-error"
                            : ""
                        }`}
                    value={form.countryCode}
                    onChange={(event) => {
                        setErrors((current) => ({
                            ...current,
                            countryCode: false,
                        }));

                        updateForm({
                            countryCode:
                                event.target.value,
                        });
                    }}
                    aria-invalid={
                        errors.countryCode
                    }
                    aria-describedby={
                        errors.countryCode
                            ? "countryCode-error"
                            : undefined
                    }
                >
                    <option value="">
                        দেশ / অঞ্চল নির্বাচন করুন
                    </option>

                    <option value="BD">
                        বাংলাদেশ
                    </option>

                    <option value="IN-WB">
                        পশ্চিমবঙ্গ, ভারত
                    </option>

                    <option value="IN-AS">
                        আসাম, ভারত
                    </option>
                </select>

                {errors.countryCode && (
                    <p
                        id="countryCode-error"
                        className="mt-1 text-sm text-error"
                    >
                        একটি বৈধ দেশ বা অঞ্চল নির্বাচন
                        করুন।
                    </p>
                )}
            </div>

            {/* Currency */}
            <div className="form-control w-full">
                <label
                    htmlFor="currencyCode"
                    className="label mb-1"
                >
                    <span className="label-text font-medium">
                        কারেন্সি
                    </span>

                    <span className="label-text-alt text-base-content/50">
                        (ঐচ্ছিক)
                    </span>
                </label>

                <select
                    id="currencyCode"
                    name="currencyCode"
                    className={`select select-bordered w-full ${errors.currencyCode
                            ? "select-error"
                            : ""
                        }`}
                    value={form.currencyCode}
                    onChange={(event) => {
                        setErrors((current) => ({
                            ...current,
                            currencyCode: false,
                        }));

                        updateForm({
                            currencyCode:
                                event.target.value,
                        });
                    }}
                    aria-invalid={
                        errors.currencyCode
                    }
                    aria-describedby={
                        errors.currencyCode
                            ? "currencyCode-error"
                            : undefined
                    }
                >
                    <option value="">
                        কারেন্সি নির্বাচন করুন
                    </option>

                    <option value="BDT">
                        বাংলাদেশি টাকা (BDT)
                    </option>

                    <option value="INR">
                        ভারতীয় রুপি (INR)
                    </option>
                </select>

                {errors.currencyCode && (
                    <p
                        id="currencyCode-error"
                        className="mt-1 text-sm text-error"
                    >
                        একটি বৈধ কারেন্সি নির্বাচন করুন।
                    </p>
                )}
            </div>

            {/* Timezone */}
            <div className="form-control w-full">
                <label
                    htmlFor="timezone"
                    className="label mb-1"
                >
                    <span className="label-text font-medium">
                        টাইমজোন
                    </span>

                    <span className="label-text-alt text-base-content/50">
                        (ঐচ্ছিক)
                    </span>
                </label>

                <select
                    id="timezone"
                    name="timezone"
                    className={`select select-bordered w-full ${errors.timezone
                            ? "select-error"
                            : ""
                        }`}
                    value={form.timezone}
                    onChange={(event) => {
                        setErrors((current) => ({
                            ...current,
                            timezone: false,
                        }));

                        updateForm({
                            timezone:
                                event.target.value,
                        });
                    }}
                    aria-invalid={errors.timezone}
                    aria-describedby={
                        errors.timezone
                            ? "timezone-error"
                            : undefined
                    }
                >
                    <option value="">
                        টাইমজোন নির্বাচন করুন
                    </option>

                    <option value="Asia/Dhaka">
                        বাংলাদেশ সময় (Asia/Dhaka)
                    </option>

                    <option value="Asia/Kolkata">
                        ভারতীয় সময় (Asia/Kolkata)
                    </option>
                </select>

                {errors.timezone && (
                    <p
                        id="timezone-error"
                        className="mt-1 text-sm text-error"
                    >
                        একটি বৈধ টাইমজোন নির্বাচন করুন।
                    </p>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onBack}
                    disabled={pending}
                >
                    পিছনে
                </button>

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