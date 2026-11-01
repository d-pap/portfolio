import type { ReactNode } from "react";
import "./figure.css";

export function FigureGroup({ label, children }: { label: string; children: ReactNode }) {
  return <div className="figure-group" role="group" aria-label={label}>{children}</div>;
}
