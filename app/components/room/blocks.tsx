import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { highlight } from "sugar-high";
import { Arrow } from "app/components/arrow";
import { metaData } from "app/config";
import { optimizable } from "app/lib/notion/images";
import type { Block, Inline } from "app/lib/notion/blocks";

const SITE = new URL(metaData.baseUrl).origin;
const OWN = new Set([SITE, ...metaData.aliases.map((url) => new URL(url).origin)]);

/** A link within the site opens in place, like every other link on it; anything else opens a new tab. */
function opens(href: string): { target?: string; rel?: string } {
  try {
    if (OWN.has(new URL(href, SITE).origin)) return {};
  } catch {
    // Not a URL the browser could follow either; treat it as outside.
  }
  return { target: "_blank", rel: "noreferrer" };
}

function Text({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        let node: ReactNode = part.text;
        if (part.code) node = <code>{node}</code>;
        if (part.bold) node = <strong>{node}</strong>;
        if (part.italic) node = <em>{node}</em>;
        if (part.strike) node = <s>{node}</s>;
        if (part.underline) node = <u>{node}</u>;
        if (part.href) node = <a href={part.href} {...opens(part.href)}>{node}</a>;
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

const plain = (parts: Inline[]) => parts.map((part) => part.text).join("");

function Caption({ parts }: { parts: Inline[] }) {
  return parts.length > 0 ? <figcaption className="label"><Text parts={parts} /></figcaption> : null;
}

function One({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return block.text.length ? <p><Text parts={block.text} /></p> : null;
    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4";
      return <Tag><Text parts={block.text} /></Tag>;
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag>{block.items.map((item, i) => <li key={i}><Text parts={item.text} />{item.children.length > 0 && <Blocks blocks={item.children} bare />}</li>)}</Tag>;
    }
    case "quote":
      return <blockquote><p><Text parts={block.text} /></p>{block.children.length > 0 && <Blocks blocks={block.children} bare />}</blockquote>;
    case "callout":
      return <aside className="callout">{block.icon && <span className="callout-icon">{block.icon}</span>}<div><p><Text parts={block.text} /></p>{block.children.length > 0 && <Blocks blocks={block.children} bare />}</div></aside>;
    case "toggle":
      return <details open><summary><Text parts={block.summary} /></summary><Blocks blocks={block.children} bare /></details>;
    case "code":
      // sugar-high escapes the source text; its spans carry token colors set in reader.css.
      return <figure className="code"><pre data-language={block.language}><code dangerouslySetInnerHTML={{ __html: highlight(block.code) }} /></pre><Caption parts={block.caption} /></figure>;
    case "image": {
      const alt = plain(block.caption);
      // With its size known the page reserves the space, so nothing below moves when the image arrives.
      const image = block.width && block.height
        ? <Image className="arrive" suppressHydrationWarning src={block.src} alt={alt} width={block.width} height={block.height} sizes="(max-width: 899px) 100vw, 620px" unoptimized={!optimizable(block.src)} />
        : <img className="arrive" suppressHydrationWarning src={block.src} alt={alt} loading="lazy" decoding="async" />;
      return <figure className="entry-image">{image}<Caption parts={block.caption} /></figure>;
    }
    case "divider":
      return <hr />;
    case "link":
      return <p className="link-block"><a href={block.href} {...opens(block.href)}>{plain(block.caption) || block.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}<Arrow /></a></p>;
  }
}

export function Blocks({ blocks, bare = false }: { blocks: Block[]; bare?: boolean }) {
  const content = blocks.map((block, i) => <One key={i} block={block} />);
  return bare ? <>{content}</> : <div className="prose">{content}</div>;
}
