import type { ReactNode } from "react";
import { ReaderList, type ReaderItem } from "./reader-list";
import "./reader.css";

/** One layout for both rooms: the list, and the open entry. On phones an entry page shows only the entry. */
export function Reader({ room, items, filters, openSlug, view, children }: {
  room: string; items: ReaderItem[]; filters: string[]; openSlug: string; view: "index" | "entry"; children: ReactNode;
}) {
  // What each filter keeps, keyed on <html data-filter> (app/boot/filter.js). Only this room's filters get rules, so an
  // unknown ?filter= leaves every row showing under "all". The names come from the schema's fixed lists, never the URL.
  const rules = filters
    .filter((name) => name !== "all")
    .map((name) => [
      `html[data-filter="${name}"] .reader-list li:not([data-group="${name}"]) { display: none; }`,
      `html[data-filter="${name}"] .reader-filters [data-filter="all"]:not(:hover) { color: var(--plane-muted); text-decoration: none; }`,
      `html[data-filter="${name}"] .reader-filters [data-filter="${name}"] { color: var(--plane-ink); text-decoration: underline; }`,
    ].join("\n"))
    .join("\n");
  return (
    <>
      {/* Holds the first paint until the whole reader is parsed, so a switch between entries can scroll the new page
          to where the list was (app/boot/trip.js). Same pattern as room-layout.tsx. */}
      <link rel="expect" href="#reader-end" {...{ blocking: "render" }} />
      <div className="reader" data-view={view}>
        {rules && <style dangerouslySetInnerHTML={{ __html: rules }} />}
        <ReaderList room={room} items={items} filters={filters} openSlug={openSlug} />
        <div className="reader-entry">
          <a className="reader-back label" href={`/${room}`}>← {room}</a>
          {children}
        </div>
      </div>
      <span id="reader-end" />
    </>
  );
}
