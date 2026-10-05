import type { CSSProperties } from "react";
import { Media } from "app/components/media/media";
import "./evidence.css";

type EvidenceMediaProps = { frames: string[]; type?: "phones" | "screen"; tint: string; tintDark: string; label: string };

export function EvidenceMedia({ frames, type = "phones", tint, tintDark, label }: EvidenceMediaProps) {
  return (
    <div className="evidence-media" style={{ "--tint": tint, "--tint-dark": tintDark } as CSSProperties}>
      <Media hero={{ type, frames }} label={label} sizes="300px" />
    </div>
  );
}
