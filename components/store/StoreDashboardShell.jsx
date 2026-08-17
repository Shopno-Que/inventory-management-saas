"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiBox,
  FiHome,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

const navigation = [
  { label: "Overview", icon: FiHome, href: "" },
  { label: "Sales", icon: FiShoppingCart },
  { label: "Products", icon: FiPackage, href: "/products" },
  { label: "Inventory", icon: FiBox },
  { label: "Reports", icon: FiBarChart2 },
  { label: "Team", icon: FiUsers },
  { label: "Settings", icon: FiSettings },
];

function StoreMark({ store }) {
  const initial = store.name.charAt(0).toUpperCase();

  return (
    <div className="avatar avatar-placeholder">
      <div className="h-10 w-10 rounded-box bg-neutral text-neutral-content">
        {store.logoUrl ? (
          // The onboarding flow accepts arbitrary remote logo URLs, so next/image cannot optimize safely.
          // biome-ignore lint/performance/noImgElement: Store logos may be hosted by user-selected domains.
          <img src={store.logoUrl} alt={`${store.name} logo`} />
        ) : (
          <span className="text-sm font-bold">{initial}</span>
        )}
      </div>
    </div>
  );
}

export default function StoreDashboardShell({ children, store, user }) {
  const drawerId = `store-dashboard-${store.slug}`;
  const storeUrl = `/stores/${store.slug}`;
  const pathname = usePathname();

  return (
    <div className="drawer lg:drawer-open">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content min-h-screen bg-base-100">
        <header className="navbar sticky top-0 z-10 border-b border-base-300 bg-base-100 px-4 sm:px-6">
          <div className="navbar-start gap-2">
            <label
              htmlFor={drawerId}
              aria-label="Open navigation"
              className="btn btn-ghost btn-square drawer-button lg:hidden"
            >
              <FiMenu size={20} aria-hidden="true" />
            </label>

            <div className="min-w-0 lg:hidden">
              <p className="truncate font-semibold">{store.name}</p>
              <p className="truncate text-xs text-base-content/60">
                @{store.slug}
              </p>
            </div>
          </div>

          <div className="navbar-end">
            <Link
              href="/user/profile"
              className="btn btn-ghost btn-sm max-w-52 truncate"
            >
              {user.email}
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
      </div>

      <div className="drawer-side">
        <label
          htmlFor={drawerId}
          aria-label="Close navigation"
          className="drawer-overlay"
        />

        <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-200">
          <div className="flex items-center gap-3 px-5 py-5">
            <StoreMark store={store} />
            <div className="min-w-0">
              <Link href={storeUrl} className="block truncate font-semibold">
                {store.name}
              </Link>
              <p className="truncate text-sm text-base-content/60">
                @{store.slug}
              </p>
            </div>
          </div>

          <nav className="px-3" aria-label="Store navigation">
            <ul className="menu w-full gap-1">
              {navigation.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  {href !== undefined ? (
                    <Link
                      href={`${storeUrl}${href}`}
                      className={
                        pathname === `${storeUrl}${href}` ||
                        (href && pathname.startsWith(`${storeUrl}${href}/`))
                          ? "menu-active"
                          : undefined
                      }
                    >
                      <Icon size={18} aria-hidden="true" />
                      {label}
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed text-base-content/50">
                      <Icon size={18} aria-hidden="true" />
                      {label}
                      <span className="badge badge-ghost badge-xs ml-auto">
                        Soon
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto border-t border-base-300 p-4">
            <Link
              href="/user/profile/stores"
              className="btn btn-ghost btn-sm w-full justify-start"
            >
              All stores
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
