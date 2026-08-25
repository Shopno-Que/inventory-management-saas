"use client";

import Link from "next/link";
import { FaUser, FaStore } from "react-icons/fa6";

import LogoutButton from "@/components/auth/logout-btn";

export default function AvatarMenu({ user }) {
    if (!user) return null;

    const name =
        user.user_metadata?.full_name ||
        null;

    const email = user.email || null;

    const initial =
        name?.charAt(0)?.toUpperCase() ||
        email?.charAt(0)?.toUpperCase() ||
        user.id?.charAt(0)?.toUpperCase() ||
        "?";

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 rounded-box p-1.5 hover:bg-base-200"
            >
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium">
                        {name }
                    </p>

                    {email && (
                        <p className="text-xs text-base-content/55">
                            {email}
                        </p>
                    )}
                </div>

                <div className="avatar avatar-placeholder">
                    <div className="w-10 rounded-full bg-primary text-primary-content">
                        <span>{initial}</span>
                    </div>
                </div>
            </div>

            <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
                <li>
                    <Link href="/user/profile">
                        <FaUser />
                        প্রোফাইল সেটিংস
                    </Link>
                </li>

                <li>
                    <Link href="/user/profile/stores">
                        <FaStore />
                        আমার দোকান
                    </Link>
                </li>

                <li className="mt-1 border-t border-base-300 pt-1">
                    <LogoutButton />
                </li>
            </ul>
        </div>
    );
}