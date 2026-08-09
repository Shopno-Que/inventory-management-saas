"use client";

import { useState } from "react";
import { FaList, FaStore, FaThLarge } from "react-icons/fa";

export default function StoreList({ stores }) {
  const [view, setView] = useState("grid");

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-base-content/55">স্টোর সমূহ</p>
          <h1 className="text-2xl font-bold">আপনার স্টোর অ্যাক্সেস</h1>
          <p className="mt-1 text-base-content/60">
            আপনি যেসব স্টোরের মালিক অথবা যাদের প্রবেশাধিকার আছে, সেগুলোর তালিকা দেখুন।
          </p>
        </div>

        <div className="btn-group">
          <button
            type="button"
            className={`btn ${view === "grid" ? "btn-primary" : "btn-outline"}`}
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <FaThLarge className="mr-2" aria-hidden="true" /> গ্রিড
          </button>
          <button
            type="button"
            className={`btn ${view === "list" ? "btn-primary" : "btn-outline"}`}
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <FaList className="mr-2" aria-hidden="true" /> লিস্ট
          </button>
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          <div>
            <FaStore className="text-xl" aria-hidden="true" />
            <span>
              আপনি কোনো স্টোরের মেম্বর বহন করছেন না। নতুন স্টোর তৈরি করে বা আমন্ত্রণ গ্রহণ করে শুরু করুন।
            </span>
          </div>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "grid gap-3"
          }
        >
          {stores.map((store) => (
            <article
              key={store.id}
              className={`card border border-base-300 bg-base-100 shadow-sm ${
                view === "list" ? "flex items-center gap-4 p-4" : ""
              }`}
            >
              <div className={view === "list" ? "flex items-center gap-4" : "p-5"}>
                <div className="avatar">
                  <div className="h-16 w-16 rounded-2xl bg-primary text-primary-content ring ring-primary/10">
                    {store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt={`${store.name} লোগো`}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xl font-bold">
                        {store.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="text-lg font-semibold">{store.name}</h2>
                  <p className="text-sm text-base-content/55">@{store.slug}</p>
                </div>

                <div className="grid gap-2 text-sm text-base-content/65 sm:grid-cols-2">
                  <div>
                    <p className="font-medium">মেম্বার স্ট্যাটাস</p>
                    <p>{store.status || "অজানা"}</p>
                  </div>
                  <div>
                    <p className="font-medium">কারেন্সি / টাইমজোন</p>
                    <p>
                      {store.currencyCode || "-"} • {store.timezone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">দেশ</p>
                    <p>{store.countryCode || "-"}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
