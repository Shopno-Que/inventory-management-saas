"use client";

import { FiMenu } from "react-icons/fi";
import AvatarMenu from "@/components/common/avatar-dropdown"

const DRAWER_ID = "dashboard-sidebar";

export default function DashboardHeader({
    title,
    subtitle,
    user,
}) {
    return (
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100">
            <div className="navbar mx-auto w-full max-w-7xl px-4 sm:px-6">
                <div className="navbar-start min-w-0 gap-2">
                    {/* Mobile sidebar button */}
                    <label
                        htmlFor={DRAWER_ID}
                        aria-label="Open navigation"
                        className="btn btn-ghost btn-square lg:hidden"
                    >
                        <FiMenu
                            size={20}
                            aria-hidden="true"
                        />
                    </label>

                    <div className="min-w-0 lg:hidden">
                        {title && (
                            <p className="truncate font-semibold">
                                {title}
                            </p>
                        )}

                        {subtitle && (
                            <p className="truncate text-xs text-base-content/60">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="navbar-end gap-2">
                    <AvatarMenu user={user} />
                </div>
            </div>
        </header>
    );
}