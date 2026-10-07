import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { slugify } from "app/lib/headings";
import { Figure } from "./case/figure";
import { EvalChecks } from "./evidence/eval-checks";
import { MemoryDiagram } from "./evidence/memory-diagram";
import { PlatformDiagram } from "./evidence/platform-diagram";
import { RoutingDiagram } from "./evidence/routing-diagram";

function MdxLink({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <a href={href} {...props}>{children}</a>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Section headings carry the id listHeadings() gives them, so tiles and the section list can link here. */
function SectionHeading({ children, ...props }: ComponentProps<"h2">) {
  return <h2 id={slugify(textOf(children))} className="label flow-label" {...props}>{children}</h2>;
}

const components = {
  a: MdxLink,
  h2: SectionHeading,
  Figure,
  RoutingDiagram,
  EvalChecks,
  PlatformDiagram,
  MemoryDiagram,
};

export function CustomMDX({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ blockJS: false, blockDangerousJS: true }} />;
}
