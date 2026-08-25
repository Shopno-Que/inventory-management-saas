"use client";
import {
    FiBarChart2,
    FiHome,
    FiPackage,
    FiSettings,
    FiShoppingCart,
    FiUsers,
} from "react-icons/fi";

export const storeNavigation = [
    { label: "Overview", icon: FiHome, href: "" },
    { label: "Sales", icon: FiShoppingCart, href: "/sales" },
    { label: "Products", icon: FiPackage, href: "/products" },
    { label: "Customers", icon: FiUsers, href: "/customers" },
    { label: "Expenses", icon: FiBarChart2, href: "/expenses" },
    { label: "Reports", icon: FiBarChart2 },
    { label: "Staff", icon: FiUsers, href: "/staff" },
    { label: "Plan", icon: FiSettings, href: "/plan" },
    { label: "Settings", icon: FiSettings, href: "/settings" },
];