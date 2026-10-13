"use client";

import { useEffect, useState } from "react";

export type ReaderItem = { slug: string; title: string; sub: string; group: string | null };

/**
 * The filters and the list. What a filter hides is CSS keyed on <html data-filter> (reader.tsx), which app/boot/filter.js
 * sets from ?filter= before the first paint, so the list never redraws after hydration. This component changes the
 * filter on click, keeps it in the URL so a filtered list can be linked, and carries it into the row links.
 */
export function ReaderList({ room, items, filters, openSlug }: { room: string; items: ReaderItem[]; filters: string[]; openSlug: string }) {
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const current = document.documentElement.dataset.filter;
    if (current && filters.includes(current)) setFilter(current);
  }, [filters]);

  function choose(next: string) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") {
      delete document.documentElement.dataset.filter;
      url.searchParams.delete("filter");
    } else {
      document.documentElement.dataset.filter = next;
      url.searchParams.set("filter", next);
    }
    window.history.replaceState(window.history.state, "", url);
  }

  const query = filter === "all" ? "" : `?filter=${filter}`;
  return (
    <div className="reader-side">
      <div className="reader-filters label">
        {filters.map((name) => (
          <button key={name} type="button" data-filter={name} onClick={() => choose(name)}>{name}</button>
        ))}
      </div>
      <ul className="reader-list">
        {items.map((item) => (
          <li key={item.slug} data-group={item.group ?? undefined}>
            <a className={item.slug === openSlug ? "reader-row on" : "reader-row"} href={`/${room}/${item.slug}${query}`}>
              <span className="reader-row-title">{item.title}</span>
              <span className="reader-row-sub">{item.sub}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
