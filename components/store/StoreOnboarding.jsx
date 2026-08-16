"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useNavigation } from "@/components/navigation/NavigationProvider"; import { HiArrowLeft } from "react-icons/hi2";

import StoreInformationStep from "./StoreInformationStep";
import StoreLocationStep from "./StoreLocationStep";
import StoreAccountStep from "./StoreAccountStep";

import { createStore } from "@/server/new-store";

export const initialState = {
    success: false, 
    error: null, 
    storeId: null, 
    requiresConfirmation: false
};

const initialForm = {
    name: "",
    slug: "",
    logoUrl: "",
    countryCode: "",
    currencyCode: "",
    timezone: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function StoreOnboarding({ user }) {
    const { push } = useNavigation();

    const [step, setStep] = useState(1);
    const [completed, setCompleted] = useState(false);
    const [form, setForm] = useState(initialForm);

    const [state, formAction, pending] = useActionState(
        createStore,
        initialState,
    );

    useEffect(() => {
        if (!state?.success) {
            return;
        }

        if (state.requiresConfirmation) {
            setCompleted(true);
            return;
        }

        push(`/stores/${state.storeSlug}`);
    }, [state, push]);

    const isAuthenticated = Boolean(user);

    const totalSteps = isAuthenticated ? 3 : 4;

    const updateForm = (values) => {
        setForm((current) => ({
            ...current,
            ...values,
        }));
    };

    const nextStep = () => {
        setStep((current) => current + 1);
    };

    const previousStep = () => {
        setStep((current) => current - 1);
    };

    return (
        <div className="space-y-6">
            {/* Back / Cancel */}
            <div>
                <Link
                    href={
                        isAuthenticated
                            ? "/user/profile/stores"
                            : "/"
                    }
                    className="btn btn-ghost btn-sm gap-2"
                >
                    <HiArrowLeft
                        aria-hidden="true"
                    />

                    {isAuthenticated
                        ? "স্টোরসমূহে ফিরে যান"
                        : "হোমে ফিরে যান"}
                </Link>
            </div>

            {/* Header */}
            <header>
                <h1 className="text-2xl font-bold">
                    নতুন স্টোর তৈরি করুন
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    আপনার স্টোরের তথ্য দিন।
                </p>
            </header>

            {/* Progress */}
            <ol
                className="steps steps-horizontal w-full"
                aria-label="স্টোর তৈরির ধাপ"
            >
                <li
                    className={`step ${step >= 1
                            ? "step-primary"
                            : ""
                        }`}
                >
                    স্টোর
                </li>

                <li
                    className={`step ${step >= 2
                            ? "step-primary"
                            : ""
                        }`}
                >
                    অবস্থান
                </li>

                {!isAuthenticated && (
                    <li
                        className={`step ${step >= 3
                                ? "step-primary"
                                : ""
                            }`}
                    >
                        অ্যাকাউন্ট
                    </li>
                )}

                <li
                    className={`step ${step >= totalSteps
                            ? "step-primary"
                            : ""
                        }`}
                >
                    সম্পন্ন
                </li>
            </ol>

            {/* Onboarding Form */}
            <form action={formAction}>
                <section className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div
                            key={step}
                            className="onboarding-step"
                        >
                            {/* Step 1 */}
                            {step === 1 && (
                                <StoreInformationStep
                                    form={form}
                                    updateForm={updateForm}
                                    onNext={nextStep}
                                    pending={pending}
                                />
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <StoreLocationStep
                                    form={form}
                                    updateForm={updateForm}
                                    onBack={previousStep}
                                    onNext={nextStep}
                                    pending={pending}
                                />
                            )}

                            {/* Step 3 - Account */}
                            {!isAuthenticated &&
                                step === 3 && (
                                    <StoreAccountStep
                                        form={form}
                                        updateForm={updateForm}
                                        onBack={
                                            previousStep
                                        }
                                        onNext={nextStep}
                                        pending={
                                            pending
                                        }
                                    />
                                )}

                            {/* Final Step */}
                            {step === totalSteps && (
                                completed ? (
                                    <div className="space-y-5">
                                        <header>
                                            <h2 className="text-xl font-semibold">
                                                ইমেইল যাচাই করুন
                                            </h2>

                                            <p className="mt-1 text-sm text-base-content/60">
                                                আপনার ইমেইল ঠিকানায় একটি যাচাইকরণ লিংক পাঠানো হয়েছে।
                                                লিংকে ক্লিক করে আপনার অ্যাকাউন্ট যাচাই করুন।
                                            </p>
                                        </header>

                                        <div
                                            role="status"
                                            className="alert alert-info"
                                        >
                                            <span>
                                                {form.email} ঠিকানার ইনবক্স এবং স্প্যাম ফোল্ডার
                                                চেক করুন।
                                            </span>
                                        </div>

                                        <Link
                                            href="/"
                                            className="btn btn-primary"
                                        >
                                            হোমে ফিরে যান
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <header>
                                            <h2 className="text-xl font-semibold">
                                                স্টোর তৈরি করার জন্য প্রস্তুত
                                            </h2>

                                            <p className="mt-1 text-sm text-base-content/60">
                                                নিচের তথ্যগুলো একবার দেখে স্টোর তৈরি করুন।
                                            </p>
                                        </header>

                                        {/* Form values from previous steps */}
                                        <input
                                            type="hidden"
                                            name="name"
                                            value={form.name}
                                        />

                                        <input
                                            type="hidden"
                                            name="slug"
                                            value={form.slug}
                                        />

                                        <input
                                            type="hidden"
                                            name="logoUrl"
                                            value={form.logoUrl}
                                        />

                                        <input
                                            type="hidden"
                                            name="countryCode"
                                            value={form.countryCode}
                                        />

                                        <input
                                            type="hidden"
                                            name="currencyCode"
                                            value={form.currencyCode}
                                        />

                                        <input
                                            type="hidden"
                                            name="timezone"
                                            value={form.timezone}
                                        />

                                        {!isAuthenticated && (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name="fullName"
                                                    value={form.fullName}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="email"
                                                    value={form.email}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="password"
                                                    value={form.password}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                />
                                            </>
                                        )}

                                        {/* Store summary */}
                                        <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
                                            <div className="border-b border-base-300 bg-base-200/50 px-5 py-4">
                                                <h3 className="font-semibold">
                                                    স্টোরের তথ্য
                                                </h3>

                                                <p className="mt-1 text-sm text-base-content/60">
                                                    আপনার স্টোরের মূল তথ্য
                                                </p>
                                            </div>

                                            <dl className="divide-y divide-base-300">
                                                {/* Store Name */}
                                                <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                    <dt className="text-sm font-medium text-base-content/60">
                                                        স্টোরের নাম
                                                    </dt>

                                                    <dd className="font-medium">
                                                        {form.name}
                                                    </dd>
                                                </div>

                                                {/* Store URL */}
                                                <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                    <dt className="text-sm font-medium text-base-content/60">
                                                        স্টোর URL
                                                    </dt>

                                                    <dd>
                                                        <span className="font-medium">
                                                            @{form.slug}
                                                        </span>
                                                    </dd>
                                                </div>

                                                {/* Country */}
                                                {form.countryCode && (
                                                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                        <dt className="text-sm font-medium text-base-content/60">
                                                            দেশ / অঞ্চল
                                                        </dt>

                                                        <dd className="font-medium">
                                                            {form.countryCode === "BD"
                                                                ? "বাংলাদেশ"
                                                                : form.countryCode ===
                                                                    "IN-WB"
                                                                    ? "পশ্চিমবঙ্গ, ভারত"
                                                                    : form.countryCode ===
                                                                        "IN-AS"
                                                                        ? "আসাম, ভারত"
                                                                        : form.countryCode}
                                                        </dd>
                                                    </div>
                                                )}

                                                {/* Currency */}
                                                {form.currencyCode && (
                                                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                        <dt className="text-sm font-medium text-base-content/60">
                                                            কারেন্সি
                                                        </dt>

                                                        <dd className="font-medium">
                                                            {form.currencyCode === "BDT"
                                                                ? "বাংলাদেশি টাকা (BDT)"
                                                                : form.currencyCode ===
                                                                    "INR"
                                                                    ? "ভারতীয় রুপি (INR)"
                                                                    : form.currencyCode}
                                                        </dd>
                                                    </div>
                                                )}

                                                {/* Timezone */}
                                                {form.timezone && (
                                                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                        <dt className="text-sm font-medium text-base-content/60">
                                                            টাইমজোন
                                                        </dt>

                                                        <dd className="font-medium">
                                                            {form.timezone === "Asia/Dhaka"
                                                                ? "বাংলাদেশ সময়"
                                                                : form.timezone ===
                                                                    "Asia/Kolkata"
                                                                    ? "ভারতীয় সময়"
                                                                    : form.timezone}

                                                            <span className="ml-2 text-sm font-normal text-base-content/50">
                                                                ({form.timezone})
                                                            </span>
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>

                                        {/* Account summary */}
                                        {!isAuthenticated && (
                                            <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
                                                <div className="border-b border-base-300 bg-base-200/50 px-5 py-4">
                                                    <h3 className="font-semibold">
                                                        অ্যাকাউন্ট
                                                    </h3>

                                                    <p className="mt-1 text-sm text-base-content/60">
                                                        স্টোরের মালিকের অ্যাকাউন্ট
                                                    </p>
                                                </div>

                                                <dl>
                                                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                        <dt className="text-sm font-medium text-base-content/60">
                                                            পূর্ণ নাম
                                                        </dt>

                                                        <dd className="font-medium">
                                                            {form.fullName}
                                                        </dd>
                                                    </div>

                                                    <div className="grid gap-1 border-t border-base-300 px-5 py-4 sm:grid-cols-[160px_1fr] sm:items-center">
                                                        <dt className="text-sm font-medium text-base-content/60">
                                                            ইমেইল
                                                        </dt>

                                                        <dd className="font-medium">
                                                            {form.email}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        )}

                                        {/* Optional information notice */}
                                        {(!form.countryCode ||
                                            !form.currencyCode ||
                                            !form.timezone) && (
                                                <div
                                                    role="note"
                                                    className="rounded-lg border border-base-300 bg-base-200/40 px-4 py-3 text-sm text-base-content/60"
                                                >
                                                    <span>
                                                        কিছু ঐচ্ছিক তথ্য দেওয়া হয়নি। আপনি চাইলে
                                                        স্টোর তৈরির পরে এগুলো সেট করতে পারবেন।
                                                    </span>
                                                </div>
                                            )}

                                        {/* Server action error */}
                                        {state?.error && (
                                            <div
                                                role="alert"
                                                className="alert alert-error"
                                            >
                                                <span>{state.error}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-5">
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                onClick={previousStep}
                                                disabled={pending}
                                            >
                                                পিছনে
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={pending}
                                            >
                                                {pending && (
                                                    <span className="loading loading-bars loading-sm" />
                                                )}

                                                {pending
                                                    ? "প্রক্রিয়াধীন..."
                                                    : "স্টোর তৈরি করুন"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}