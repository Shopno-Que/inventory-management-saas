"use client";

import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function StoreAccountStep({ form, updateForm, onBack, onNext, pending, }) {
    const passwordsMatch = !form.password || !form.confirmPassword || form.password === form.confirmPassword;

    const handleNext = (event) => {
        event.preventDefault();

        const formElement = event.currentTarget.closest("form");

        if (!formElement?.checkValidity()) {
            formElement?.reportValidity();
            return;
        }

        if (!passwordsMatch) {
            return;
        }

        onNext();
    };

    const handleKeyDown = (event) => {
        if (event.key !== "Enter") return;

        event.preventDefault();

        const formElement = event.currentTarget.closest("form");

        if (!formElement?.checkValidity()) {
            formElement?.reportValidity();
            return;
        }

        if (!passwordsMatch) return;

        onNext();
    };

    return (
        <div className="grid gap-5">
            <header>
                <h2 className="text-xl font-semibold">
                    আপনার অ্যাকাউন্ট
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                    স্টোর তৈরি করতে আপনার অ্যাকাউন্টের তথ্য দিন।
                </p>
            </header>

            <fieldset
                className="grid gap-5"
                disabled={pending}
                onKeyDown={handleKeyDown}
            >
                {/* Full Name */}
                <div className="form-control w-full">
                    <label
                        htmlFor="fullName"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            পূর্ণ নাম
                        </span>

                        <span className="label-text-alt text-base-content/50">
                            (ঐচ্ছিক)
                        </span>
                    </label>

                    <div className="input validator w-full">
                        <FaUser
                            className="text-base-content/50"
                            aria-hidden="true"
                        />

                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={(event) =>
                                updateForm({
                                    fullName:
                                        event.target.value,
                                })
                            }
                            placeholder="আপনার নাম"
                            minLength={2}
                            maxLength={100}
                        />
                    </div>

                    <p className="validator-hint hidden">
                        পূর্ণ নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে।
                    </p>
                </div>

                {/* Email */}
                <div className="form-control w-full">
                    <label
                        htmlFor="email"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            ইমেইল{" "}
                            <span className="text-error">*</span>
                        </span>
                    </label>

                    <div className="input validator w-full">
                        <FaEnvelope
                            className="text-base-content/50"
                            aria-hidden="true"
                        />

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                                updateForm({
                                    email:
                                        event.target.value,
                                })
                            }
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <p className="validator-hint hidden">
                        একটি সঠিক ইমেইল ঠিকানা লিখুন।
                    </p>
                </div>

                {/* Password */}
                <div className="form-control w-full">
                    <label
                        htmlFor="password"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            পাসওয়ার্ড{" "}
                            <span className="text-error">*</span>
                        </span>
                    </label>

                    <div className="input validator w-full">
                        <FaLock
                            className="text-base-content/50"
                            aria-hidden="true"
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={(event) =>
                                updateForm({
                                    password:
                                        event.target.value,
                                })
                            }
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <p className="validator-hint hidden">
                        পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।
                    </p>
                </div>

                {/* Confirm Password */}
                <div className="form-control w-full">
                    <label
                        htmlFor="confirmPassword"
                        className="label mb-1"
                    >
                        <span className="label-text font-medium">
                            পাসওয়ার্ড পুনরায় লিখুন{" "}
                            <span className="text-error">*</span>
                        </span>
                    </label>

                    <div
                        className={`input validator w-full ${form.password &&
                                form.confirmPassword &&
                                !passwordsMatch
                                ? "input-error"
                                : ""
                            }`}
                    >
                        <FaLock
                            className="text-base-content/50"
                            aria-hidden="true"
                        />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(event) =>
                                updateForm({
                                    confirmPassword:
                                        event.target.value,
                                })
                            }
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <p className="validator-hint hidden">
                        একই পাসওয়ার্ড পুনরায় লিখুন।
                    </p>
                    
                    {form.password &&
                        form.confirmPassword &&
                        !passwordsMatch && (
                            <div role="alert" className="alert mt-5 alert-error">
                                <span>পাসওয়ার্ড দুটি একই নয়।</span>
                            </div>
                        )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onBack}
                    >
                        পিছনে
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                    >
                        পরবর্তী
                    </button>
                </div>
            </fieldset>
        </div>
    );

}