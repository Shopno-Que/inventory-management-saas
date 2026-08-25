"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DRAWER_ID = "dashboard-sidebar";

function isPathActive(pathname, href, baseUrl) {
    const fullPath = `${baseUrl}${href}`;

    if (href === "") {
        return pathname === baseUrl;
    }

    return (
        pathname === fullPath ||
        pathname.startsWith(`${fullPath}/`)
    );
}

function hasActiveChild(item, pathname, baseUrl) {
    return item.children?.some((child) =>
        isPathActive(pathname, child.href, baseUrl)
    );
}

function DashboardMark({ children, baseUrl }) {
    return (
        <Link href={baseUrl || "/"}  className="avatar avatar-placeholder">
            <div className="h-10 w-10 rounded-box bg-neutral text-neutral-content">
                <span className="text-sm font-bold">
                    {children}
                </span>
            </div>
        </Link>
    );
}

function SidebarItem({ item, baseUrl, pathname }) {
    const hasChildren = item.children?.length > 0;

    const active = isPathActive(
        pathname,
        item.href,
        baseUrl
    );

    const childActive = hasActiveChild(
        item,
        pathname,
        baseUrl
    );

    const Icon = item.icon;

    /*
     * Simple menu item without children
     */
    if (!hasChildren) {
        return (
            <li>
                {item.href !== undefined ? (
                    <Link
                        href={`${baseUrl}${item.href}`}
                        className={
                            active
                                ? "menu-active"
                                : undefined
                        }
                    >
                        {Icon && (
                            <Icon
                                size={18}
                                aria-hidden="true"
                            />
                        )}

                        {item.label}

                        {item.badge && (
                            <span className="badge badge-ghost badge-xs ml-auto">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ) : (
                    <span className="cursor-not-allowed text-base-content/50">
                        {Icon && (
                            <Icon
                                size={18}
                                aria-hidden="true"
                            />
                        )}

                        {item.label}

                        <span className="badge badge-ghost badge-xs ml-auto">
                            Soon
                        </span>
                    </span>
                )}
            </li>
        );
    }

    /*
     * Parent menu with children
     */
    return (
        <li>
            <Link
                href={`${baseUrl}${item.href}`}
                className={
                    active || childActive
                        ? "menu-active"
                        : undefined
                }
            >
                {Icon && (
                    <Icon
                        size={18}
                        aria-hidden="true"
                    />
                )}

                <span className="truncate">
                    {item.label}
                </span>
            </Link>

            {/*
             * Only show children when this parent section
             * is currently active.
             */}
            {(active || childActive) && (
                <ul className="ml-3 mt-1 border-l border-base-300 pl-2">
                    {item.children.map((child) => {
                        const childPathActive = isPathActive(
                            pathname,
                            child.href,
                            baseUrl
                        );

                        const ChildIcon = child.icon;

                        return (
                            <li key={child.label}>
                                <Link
                                    href={`${baseUrl}${child.href}`}
                                    className={
                                        childPathActive
                                            ? "menu-active"
                                            : undefined
                                    }
                                >
                                    {ChildIcon && (
                                        <ChildIcon
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {child.label}

                                    {child.badge && (
                                        <span className="badge badge-ghost badge-xs ml-auto">
                                            {child.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}

export default function DashboardSidebar({
    baseUrl = "",
    brand,
    navigation = [],
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile drawer state */}
            <input
                id={DRAWER_ID}
                type="checkbox"
                className="peer sr-only"
            />

            {/* Mobile overlay */}
            <label
                htmlFor={DRAWER_ID}
                aria-label="Close navigation"
                className="
                    pointer-events-none fixed inset-0 z-40
                    bg-black/40 opacity-0
                    transition-opacity
                    peer-checked:pointer-events-auto
                    peer-checked:opacity-100
                    lg:hidden
                "
            />

            <aside
                className="
                    fixed inset-y-0 left-0 z-50
                    flex w-72 -translate-x-full
                    flex-col border-r border-base-300
                    bg-base-200
                    transition-transform duration-200
                    peer-checked:translate-x-0
                    lg:translate-x-0
                "
            >
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-5">
                    <DashboardMark baseUrl={baseUrl}>
                        {brand.mark ??
                            brand.name?.charAt(0) ??
                            "D"}
                    </DashboardMark>

                    <div className="min-w-0">
                        <Link
                            href={baseUrl || "/"}
                            className="block truncate font-semibold"
                        >
                            {brand.name}
                        </Link>

                        {brand.handle && (
                            <p className="truncate text-sm text-base-content/60">
                                {brand.handle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav
                    className="flex-1 overflow-y-auto px-3 pb-5"
                    aria-label={
                        brand.navigationLabel ??
                        "Dashboard navigation"
                    }
                >
                    <ul className="menu w-full gap-1">
                        {navigation.map((item) => (
                            <SidebarItem
                                key={item.label}
                                item={item}
                                baseUrl={baseUrl}
                                pathname={pathname}
                            />
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}