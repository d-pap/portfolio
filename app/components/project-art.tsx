import Image from "next/image";

export function ProjectArt({ slug, priority = false }: { slug: string; priority?: boolean }) {
  const common = { priority, draggable: false };
  if (slug === "renew-app") return <div className="project-art art-renew">
    <span className="art-wordmark" aria-hidden="true">RENEW<span>fatigue self-management</span></span>
    <div className="phone-pair art-object">
      <Image {...common} className="phone-screen" src="/projects/renew-modules.webp" alt="RENEW learning modules" width={830} height={1800} sizes="(max-width: 700px) 30vw, 24vw" />
      <Image {...common} className="phone-screen" src="/projects/renew-module-detail.webp" alt="A lesson in the RENEW app" width={830} height={1800} sizes="(max-width: 700px) 30vw, 24vw" />
    </div>
  </div>;
  if (slug === "rag-api") return <div className="project-art art-sprout">
    <div className="sprout-caption" aria-hidden="true"><svg width="45" height="45" viewBox="0 0 48 48" fill="none"><path d="M24 40V23m0 7C9 30 7 19 8 11c11 0 17 6 16 19Zm0-7C24 11 31 7 41 7c0 12-6 18-17 16Z" stroke="currentColor" strokeWidth="1.5" /></svg><span>sprout</span><small>an AI health coach</small></div>
    <Image {...common} className="phone-screen sprout-screen art-object" src="/projects/sprout-chat.webp" alt="Sprout's welcome screen inside RENEW, April 2026" width={832} height={1800} sizes="(max-width: 700px) 40vw, 28vw" />
  </div>;
  if (slug === "stitches") return <div className="project-art art-stitches"><div className="browser-screen art-object"><Image {...common} src="/projects/stitches-home.webp" alt="Stitches Doll Project homepage development preview" width={1440} height={1080} sizes="(max-width: 700px) 92vw, 70vw" /></div></div>;
  if (slug === "codecoach") return <div className="project-art art-codecoach"><div className="browser-screen art-object"><Image {...common} src="/projects/cc-compiler.webp" alt="Code Coach workspace with problem statement and code editor" width={1440} height={930} sizes="(max-width: 700px) 92vw, 70vw" /></div></div>;
  if (slug === "twitter-nlp") return <div className="project-art art-analysis"><div className="chart-sheet"><Image {...common} src="/nlp-bar.png" alt="Negative sentiment by game in the analyzed tweets" width={562} height={550} sizes="(max-width: 700px) 85vw, 32vw" /></div></div>;
  return <div className="project-art art-bank"><div className="chart-sheet"><Image {...common} src="/projects/bank-churn-by-age.png" alt="Bank customer churn rate by age group from the project notebook" width={567} height={455} sizes="(max-width: 700px) 85vw, 32vw" /></div></div>;
}
