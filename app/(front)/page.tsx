import { getIndex } from "app/lib/content";
import { projectIndex } from "app/lib/project-index";
import { ProjectIndex } from "app/components/ascii/project-index";

export default function Home() {
  const { main, earlier } = getIndex();
  return (
    <div className="ascii-home">
      <section
        className="ascii-intro"
        aria-labelledby="intro-heading"
        id="info"
      >
        <h1 id="intro-heading" className="visually-hidden">
          Derek Papierski — AI &amp; software engineer
        </h1>
        <p>
          I’m Derek. I build software, care about design, and like figuring out
          how things work.
        </p>
      </section>
      <ProjectIndex groups={projectIndex(main, earlier)} />
    </div>
  );
}
