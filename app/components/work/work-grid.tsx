import { readingOrder, type Grid } from "app/lib/grid";
import { SectionLinkTransitions } from "./section-link-transitions";
import { WorkTile } from "./work-tile";
import "./tile.css";

/**
 * At 900px and up: three hand-placed columns from content/grid.yml. Below that: one column in reading order.
 * The inactive layout is display: none, so it's never focused or announced, and its lazy images never load.
 */
export function WorkGrid({ grid }: { grid: Grid }) {
  return (
    <>
      <SectionLinkTransitions />
      <div className="work-grid">
        {grid.map((column, i) => (
          <div key={i} className="work-col">
            {column.map((tile, k) => <WorkTile key={tile.id} tile={tile} priority={k === 0} />)}
          </div>
        ))}
      </div>
      <div className="work-list">
        {readingOrder(grid).map((tile) => <WorkTile key={tile.id} tile={tile} />)}
      </div>
    </>
  );
}
