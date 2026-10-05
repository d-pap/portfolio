import { MDXRemote } from "next-mdx-remote/rsc";
import { EvalChecks } from "app/components/evidence/eval-checks";
import { EvidenceMedia } from "app/components/evidence/evidence-media";
import { RoutingDiagram } from "app/components/evidence/routing-diagram";
import { getHomeSource } from "app/lib/content";
import { checkIntroPairs } from "app/lib/home-intro";
import { CitedIntro } from "./cited-intro";
import { Claim } from "./claim";
import { Note } from "./note";

export function HomeIntro() {
  const source = getHomeSource();
  checkIntroPairs(source);
  return (
    <section aria-label="Introduction">
      <CitedIntro>
        <MDXRemote source={source} components={{ Claim, Note, RoutingDiagram, EvalChecks, EvidenceMedia }} options={{ blockJS: false, blockDangerousJS: true }} />
      </CitedIntro>
    </section>
  );
}
