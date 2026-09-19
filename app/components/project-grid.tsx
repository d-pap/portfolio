import Link from "next/link";
import type { getBlogPosts } from "app/lib/posts";
import { ProjectArt } from "./project-art";
import { Arrow } from "./arrow";

export function ProjectGrid({ posts }: { posts: ReturnType<typeof getBlogPosts> }) {
  return <div className="project-grid">{posts.map((post, index) => <Link href={`/work/${post.slug}`} className="project-card" key={post.slug}>
    <ProjectArt slug={post.slug} priority={index < 2} />
    <div className="project-caption"><div><h3>{post.metadata.shortTitle || post.metadata.title}</h3><p>{post.metadata.context}</p></div><div className="project-caption-end"><span>{post.metadata.period}</span><Arrow /></div></div>
    <p className="project-summary">{post.metadata.summary}</p>
  </Link>)}</div>;
}
