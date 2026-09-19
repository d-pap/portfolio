import { socialLinks } from "./config";
import { getProjects } from "./lib/posts";
import { InlineNote } from "./components/inline-note";
import { ProjectGrid } from "./components/project-grid";
import { Arrow } from "./components/arrow";

export default function Page() {
  return (
    <div className="site-shell">
      <section className="introduction" aria-labelledby="about-heading">
        <div className="intro-copy">
          <h1 id="about-heading" className="eyebrow">a little about me</h1>
          <div className="intro-text">
            <p>I’m Derek, an AI & software engineer in Michigan. I build and evaluate AI systems, and design the apps and interfaces around them.</p>
            <p>At <InlineNote label="Michigan Medicine">
              <span className="note-heading">work so far</span>
              <span className="note-row"><strong>Michigan Medicine</strong><span>app developer · sep 2025–present<br />AI engineer · jun 2025–present</span></span>
              <span className="note-row"><strong>Code Coach</strong><span>full stack developer · may 2024–jan 2025</span></span>
              <span className="note-row"><strong>iLabs, U-M Dearborn</strong><span>data analyst · oct 2023–feb 2024</span></span>
            </InlineNote>, I work on Sprout, an AI health coach, and the RENEW app. Much of my work is figuring out how to apply LLMs in health research and how to evaluate them. I also do freelance <InlineNote label="app development & design">
              <span className="note-heading">what i work on</span>
              <span className="note-row"><strong>AI systems</strong><span>retrieval, memory, and evaluation</span></span>
              <span className="note-row"><strong>web & mobile</strong><span>from the API to the interface</span></span>
              <span className="note-row"><strong>interface design</strong><span>layouts, design systems, and the small interactions</span></span>
            </InlineNote>, using <InlineNote label="these tools">
              <span className="note-heading">tools i reach for</span>
              <span className="note-row"><strong>interfaces</strong><span>TypeScript, React, React Native, Expo, Astro</span></span>
              <span className="note-row"><strong>AI & backend</strong><span>Python, FastAPI, LangGraph, PostgreSQL</span></span>
              <span className="note-row"><strong>design & evaluation</strong><span>Figma, DeepEval</span></span>
            </InlineNote>.</p>
          </div>
        </div>
        <div className="intro-aside">
          <h2 className="eyebrow">experience</h2>
          <ul className="experience-list"><li>Michigan Medicine</li><li>Freelance</li><li>U-M Dearborn ACM</li><li>iLabs</li></ul>
        </div>
        <div className="intro-links">
          <h2 className="eyebrow">elsewhere</h2>
          <a className="text-link" href={socialLinks.email}>email <Arrow /></a>
          <a className="text-link" href={socialLinks.github} target="_blank" rel="noreferrer">github <Arrow /></a>
          <a className="text-link" href={socialLinks.linkedin} target="_blank" rel="noreferrer">linkedin <Arrow /></a>
          <a className="text-link" href="https://doi.org/10.2196/79302" target="_blank" rel="noreferrer">research paper <Arrow /></a>
        </div>
      </section>
      <section className="selected-work" id="work" aria-labelledby="work-heading">
        <div className="section-heading"><h2 id="work-heading" className="eyebrow">work</h2></div>
        <ProjectGrid posts={getProjects()} />
      </section>
    </div>
  );
}
