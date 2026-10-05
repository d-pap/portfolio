import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Figure } from "./case/figure";
import { EvalChecks } from "./evidence/eval-checks";
import { RoutingDiagram } from "./evidence/routing-diagram";

function MdxLink({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <a href={href} {...props}>{children}</a>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

const components = {
  a: MdxLink,
  h2: (props: ComponentProps<"h2">) => <h2 className="label flow-label" {...props} />,
  Figure,
  RoutingDiagram,
  EvalChecks,
};

export function CustomMDX({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ blockJS: false, blockDangerousJS: true }} />;
}
