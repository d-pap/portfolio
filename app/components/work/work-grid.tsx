import type { Grid } from "app/lib/grid";
import { SectionLinkTransitions } from "./section-link-transitions";
import { WorkTile } from "./work-tile";
import "./tile.css";

export function WorkGrid({ grid }: { grid: Grid }) {
  return (
    <>
      <SectionLinkTransitions />
      <div className="work-grid">
        {grid.map((tile, i) => <WorkTile key={tile.id} tile={tile} priority={i === 0} enter={i < 2 ? i + 2 : undefined} />)}
      </div>
    </>
  );
}
