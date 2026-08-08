"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartPie, FaCog, FaStore, FaUserCircle } from "react-icons/fa";

const navigation = [
  { href: "/user/profile/stores", label: "স্টোর সমূহ", icon: FaChartPie },
  { href: "/user/profile", label: "প্রোফাইল", icon: FaUserCircle },
];

export default function ProfileShell({ children, user }) {
  const pathname = usePathname();
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-base-200">
      <header className="border-b border-base-300 bg-base-100">
        <div className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6">
          <div className="navbar-start">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-box bg-neutral text-lg text-neutral-content">
                <FaStore aria-hidden="true" />
              </span>
              <span>হিসাব খাতা</span>
            </Link>
          </div>
          <div className="navbar-end gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user.name || "আপনার অ্যাকাউন্ট"}
              </p>
              <p className="text-xs text-base-content/55">{user.email}</p>
            </div>
            <div className="avatar avatar-placeholder">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span>{initial}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-10">
        <aside className="rounded-box border border-base-300 bg-base-100 p-3 lg:h-fit">
          <ul className="menu menu-horizontal w-full gap-1 p-0 lg:menu-vertical">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/user/profile"
                  ? pathname === href
                  : pathname.startsWith(href);

              return (
                <li key={href} className="flex-1">
                  <Link className={active ? "menu-active" : ""} href={href}>
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
