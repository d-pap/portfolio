import type { ComponentType } from "react";
import type { DiagramName } from "app/lib/tiles";
import { EvalChecks } from "./eval-checks";
import { MemoryDiagram } from "./memory-diagram";
import { PlatformDiagram } from "./platform-diagram";
import { RoutingDiagram } from "./routing-diagram";

/** Diagrams a tile can show by name. The Record type makes tsc fail if a name in DIAGRAMS has no component. */
export const DIAGRAMS_BY_NAME: Record<DiagramName, ComponentType> = {
  routing: RoutingDiagram,
  "eval-checks": EvalChecks,
  platform: PlatformDiagram,
  memory: MemoryDiagram,
};
