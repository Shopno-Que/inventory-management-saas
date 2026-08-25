"use client";
import {
    FiHome,
    FiSettings,
    FiShoppingBag,
    FiUsers,
} from "react-icons/fi";
import { LuUsersRound } from "react-icons/lu";

export const adminNavigation = [
    {
        label: "Overview",
        icon: FiHome,
        href: "",
    },
    {
        label: "Users",
        icon: FiUsers,
        href: "/users",
    },
    {
        label: "Stores",
        icon: FiShoppingBag,
        href: "/stores",
    },
    {
        label: "Staff",
        icon: LuUsersRound,
        href: "/staff",
        children: [
            {
                label: "Users",
                href: "/staff/users",
            },
            {
                label: "Roles",
                href: "/staff/roles",
            },
            {
                label: "Invitations",
                href: "/staff/invitations",
            },
        ],
    },
    {
        label: "Settings",
        icon: FiSettings,
        href: "/settings",
    },
];