"use client";

import { useState } from "react";
import {
    FaEnvelope,
    FaLock,
    FaPencilAlt,
    FaTimes,
    FaUser,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
    name,
    email,
}) {
    const [currentName, setCurrentName] = useState(name || "<কোন নাম দেওয়া নেই>");

    const [nameEditing, setNameEditing] = useState(false);
    const [emailEditing, setEmailEditing] = useState(false);
    const [passwordEditing, setPasswordEditing] = useState(false);

    const [nameLoading, setNameLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [nameMessage, setNameMessage] = useState(null);
    const [emailMessage, setEmailMessage] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);

    const handleNameSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const newName = formData.get("name")?.trim();

        setNameLoading(true);
        setNameMessage(null);

        if (!newName || newName.length < 2) {
            setNameMessage({
                type: "error",
                text: "নাম কমপক্ষে ২ অক্ষরের হতে হবে।",
            });
            setNameLoading(false);
            return;
        }

        if (newName === name?.trim()) {
            setNameEditing(false);
            setNameLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: newName,
                },
            });

            if (error) throw error;

            setNameMessage({
                type: "success",
                text: "নাম সফলভাবে পরিবর্তন হয়েছে।",
            });
            
            setCurrentName(newName);
            setNameEditing(false);
        } catch (error) {
            setNameMessage({
                type: "error",
                text: error?.message || "কোন সমস্যা হয়েছে। আবার চেষ্টা করুন।",
            });
        } finally {
            setNameLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const newEmail = formData.get("newEmail")?.trim();

        setEmailLoading(true);
        setEmailMessage(null);

        if (!newEmail) {
            setEmailMessage({
                type: "error",
                text: "নতুন ইমেইল লিখুন।",
            });
            setEmailLoading(false);
            return;
        }

        if (newEmail.toLowerCase() === email.toLowerCase()) {
            setEmailMessage({
                type: "error",
                text: "নতুন ইমেইলটি বর্তমান ইমেইল থেকে আলাদা হতে হবে।",
            });
            setEmailLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                email: newEmail,
            });

            if (error) throw error;

            form.reset();

            setEmailMessage({
                type: "success",
                text: "নতুন ইমেইলে একটি নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে।",
            });
        } catch (error) {
            setEmailMessage({
                type: "error",
                text: error?.message || "কোন সমস্যা হয়েছে। আবার চেষ্টা করুন।",
            });
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        setPasswordLoading(true);
        setPasswordMessage(null);

        if (password !== confirmPassword) {
            setPasswordMessage({
                type: "error",
                text: "পাসওয়ার্ড মেলেনি।",
            });
            setPasswordLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) throw error;

            form.reset();

            setPasswordMessage({
                type: "success",
                text: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
            });
        } catch (error) {
            setPasswordMessage({
                type: "error",
                text: error?.message || "কোন সমস্যা হয়েছে। আবার চেষ্টা করুন।",
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            {/* Account Information */}
            <section className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">
                        অ্যাকাউন্টের তথ্য
                    </h2>

                    <div className="grid gap-5">
                        {/* Name */}
                        <div>
                            <p className="mb-1 text-sm text-base-content/55">
                                নাম
                            </p>

                            <div className="flex items-center gap-3">
                                {nameEditing ? (
                                    <form
                                        onSubmit={handleNameSubmit}
                                        className="flex flex-1 items-center gap-2"
                                    >
                                        <fieldset
                                            className="flex flex-1 items-center gap-2"
                                            disabled={nameLoading}
                                        >
                                            <div className="input validator w-full">
                                                <FaUser
                                                    className="text-base-content/50"
                                                    aria-hidden="true"
                                                />

                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    defaultValue={currentName}
                                                    placeholder="আপনার নাম"
                                                    minLength={2}
                                                    maxLength={100}
                                                    required
                                                    autoFocus
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={nameLoading}
                                            >
                                                {nameLoading && (
                                                    <span className="loading loading-bars loading-sm" />
                                                )}

                                                {nameLoading
                                                    ? "সংরক্ষণ হচ্ছে..."
                                                    : "সংরক্ষণ"}
                                            </button>
                                        </fieldset>
                                    </form>
                                ) : (
                                    <p className="font-medium">
                                        {currentName}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm btn-square"
                                    onClick={() => {
                                        setNameEditing((value) => !value);
                                        setNameMessage(null);
                                    }}
                                    aria-label={
                                        nameEditing
                                            ? "নাম পরিবর্তন বাতিল করুন"
                                            : "নাম পরিবর্তন করুন"
                                    }
                                >
                                    {nameEditing ? <FaTimes /> : <FaPencilAlt />}
                                </button>
                            </div>

                            {nameMessage && (
                                <div
                                    role="alert"
                                    className={`alert mt-3 ${nameMessage.type === "success"
                                        ? "alert-success"
                                        : "alert-error"
                                        }`}
                                >
                                    {nameMessage.text}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">

                                    <div className="min-w-0">
                                        <p className="mb-1 text-sm text-base-content/55">
                                            ইমেইল
                                        </p>

                                        <p className="break-all font-medium">
                                            {email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm btn-square"
                                    onClick={() => {
                                        setEmailEditing((value) => !value);
                                        setEmailMessage(null);
                                    }}
                                    aria-label={
                                        emailEditing
                                            ? "ইমেইল পরিবর্তন বাতিল করুন"
                                            : "ইমেইল পরিবর্তন করুন"
                                    }
                                >
                                    {emailEditing ? <FaTimes /> : <FaPencilAlt />}
                                </button>
                            </div>

                            {emailEditing && (
                                <form
                                    onSubmit={handleEmailSubmit}
                                    className="mt-4 grid gap-4"
                                >
                                    <fieldset
                                        className="grid gap-4"
                                        disabled={emailLoading}
                                    >
                                        <div className="form-control w-full">
                                            <label
                                                htmlFor="newEmail"
                                                className="label mb-1"
                                            >
                                                <span className="label-text font-medium">
                                                    নতুন ইমেইল
                                                </span>
                                            </label>

                                            <div className="input validator w-full">
                                                <FaEnvelope
                                                    className="text-base-content/50"
                                                    aria-hidden="true"
                                                />

                                                <input
                                                    id="newEmail"
                                                    name="newEmail"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>

                                            <p className="validator-hint hidden">
                                                একটি সঠিক ইমেইল ঠিকানা লিখুন।
                                            </p>
                                        </div>

                                        {emailMessage && (
                                            <div
                                                role="alert"
                                                className={`alert ${emailMessage.type === "success"
                                                    ? "alert-success"
                                                    : "alert-error"
                                                    }`}
                                            >
                                                {emailMessage.text}
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-primary w-fit"
                                            type="submit"
                                            disabled={emailLoading}
                                        >
                                            {emailLoading && (
                                                <span className="loading loading-bars loading-sm" />
                                            )}

                                            {emailLoading
                                                ? "আপডেট হচ্ছে..."
                                                : "ইমেইল পরিবর্তন করুন"}
                                        </button>
                                    </fieldset>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Password */}
            <section className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="card-title">
                                পাসওয়ার্ড
                            </h2>

                            <p className="mt-1 text-sm text-base-content/55">
                                আপনার অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন।
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-square"
                            onClick={() => {
                                setPasswordEditing((value) => !value);
                                setPasswordMessage(null);
                            }}
                            aria-label={
                                passwordEditing
                                    ? "পাসওয়ার্ড পরিবর্তন বাতিল করুন"
                                    : "পাসওয়ার্ড পরিবর্তন করুন"
                            }
                        >
                            {passwordEditing ? <FaTimes /> : <FaPencilAlt />}
                        </button>
                    </div>

                    {passwordEditing && (
                        <>
                            <div className="divider my-0" />

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="grid gap-5"
                            >
                                <fieldset
                                    className="grid gap-5"
                                    disabled={passwordLoading}
                                >
                                    {/* New Password */}
                                    <div className="form-control w-full">
                                        <label
                                            htmlFor="password"
                                            className="label mb-1"
                                        >
                                            <span className="label-text font-medium">
                                                নতুন পাসওয়ার্ড
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
                                                placeholder="••••••••"
                                                minLength={6}
                                                required
                                                title="পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
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
                                                পাসওয়ার্ড পুনরায় লিখুন
                                            </span>
                                        </label>

                                        <div className="input validator w-full">
                                            <FaLock
                                                className="text-base-content/50"
                                                aria-hidden="true"
                                            />

                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                minLength={6}
                                                required
                                                title="একই পাসওয়ার্ড পুনরায় লিখুন"
                                            />
                                        </div>

                                        <p className="validator-hint hidden">
                                            একই পাসওয়ার্ড পুনরায় লিখুন।
                                        </p>
                                    </div>

                                    {passwordMessage && (
                                        <div
                                            role="alert"
                                            className={`alert ${passwordMessage.type === "success"
                                                    ? "alert-success"
                                                    : "alert-error"
                                                }`}
                                        >
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-fit"
                                        disabled={passwordLoading}
                                    >
                                        {passwordLoading && (
                                            <span className="loading loading-bars loading-sm" />
                                        )}

                                        {passwordLoading
                                            ? "পরিবর্তন হচ্ছে..."
                                            : "পাসওয়ার্ড পরিবর্তন করুন"}
                                    </button>
                                </fieldset>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}