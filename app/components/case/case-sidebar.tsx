import type { Heading } from "app/lib/headings";
import { SectionNav } from "./section-nav";

export function CaseSidebar({ title, sections }: { title: string; sections: Heading[] }) {
  return (
    <aside className="case-sidebar" aria-label="Project navigation">
      <h1>{title}</h1>
      <SectionNav sections={sections} />
    </aside>
  );
}
