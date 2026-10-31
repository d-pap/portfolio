import { Fragment, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import katex from "katex";
import { Arrow } from "app/components/arrow";
import { metaData } from "app/config";
import { optimizable } from "app/lib/notion/images";
import type { Block, Inline } from "app/lib/notion/blocks";
import { NoteVideo } from "./note-video";

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

/** TeX as MathML, which browsers lay out on their own: no KaTeX stylesheet or fonts to load. A typo shows as red source. */
function math(expression: string, display: boolean): string {
  return katex.renderToString(expression, { output: "mathml", displayMode: display, throwOnError: false });
}

function Text({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        let node: ReactNode = part.math ? <span className="math" dangerouslySetInnerHTML={{ __html: math(part.text, false) }} /> : part.text;
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
      return <Tag id={block.anchor}><Text parts={block.text} /></Tag>;
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag>{block.items.map((item, i) => <li key={i}><Text parts={item.text} />{item.children.length > 0 && <Blocks blocks={item.children} bare />}</li>)}</Tag>;
    }
    case "todo":
      return <ul className="todo">{block.items.map((item, i) => <li key={i} className={item.checked ? "is-checked" : undefined}><span className="todo-box" aria-hidden="true" /><div><Text parts={item.text} />{item.children.length > 0 && <Blocks blocks={item.children} bare />}</div></li>)}</ul>;
    case "quote":
      return <blockquote><p><Text parts={block.text} /></p>{block.children.length > 0 && <Blocks blocks={block.children} bare />}</blockquote>;
    case "callout":
      return <aside className="callout">{block.icon && <span className="callout-icon">{block.icon}</span>}<div><p><Text parts={block.text} /></p>{block.children.length > 0 && <Blocks blocks={block.children} bare />}</div></aside>;
    case "toggle":
      return <details open><summary><Text parts={block.summary} /></summary><Blocks blocks={block.children} bare /></details>;
    case "code":
      // Shiki's HTML (highlight.ts) escapes the source and colors each token inline; a block it couldn't read shows plain.
      return <figure className="code" data-language={block.language}>
        {block.html ? <div dangerouslySetInnerHTML={{ __html: block.html }} /> : <pre><code>{block.code}</code></pre>}
        <Caption parts={block.caption} />
      </figure>;
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
    case "table": {
      const [first, ...rest] = block.rows;
      const body = block.header ? rest : block.rows;
      const cell = (parts: Inline[], j: number, key: number) => block.rowHeader && j === 0
        ? <th key={key} scope="row"><Text parts={parts} /></th>
        : <td key={key}><Text parts={parts} /></td>;
      // The wrapper scrolls sideways when a wide table meets a phone, so the page itself never does.
      return <div className="table">
        <table>
          {block.header && <thead><tr>{first.map((parts, j) => <th key={j} scope="col"><Text parts={parts} /></th>)}</tr></thead>}
          <tbody>{body.map((row, i) => <tr key={i}>{row.map((parts, j) => cell(parts, j, j))}</tr>)}</tbody>
        </table>
      </div>;
    }
    case "columns": {
      const ratios = block.columns.map((column) => column.ratio ?? 1 / block.columns.length);
      return <div className="columns" style={{ "--columns": ratios.map((r) => `minmax(0, ${r}fr)`).join(" ") } as CSSProperties}>
        {block.columns.map((column, i) => <div key={i}><Blocks blocks={column.children} bare /></div>)}
      </div>;
    }
    case "equation":
      return <div className="equation" dangerouslySetInnerHTML={{ __html: math(block.expression, true) }} />;
    case "video":
      return <figure className="entry-video"><NoteVideo src={block.src} label={plain(block.caption)} /><Caption parts={block.caption} /></figure>;
    case "toc":
      return block.items.length ? <nav className="toc" aria-label="On this page"><ul>{block.items.map((item) => <li key={item.anchor} data-level={item.level}><a href={`#${item.anchor}`}>{item.text}</a></li>)}</ul></nav> : null;
    case "link":
      return <p className="link-block"><a href={block.href} {...opens(block.href)}>{plain(block.caption) || block.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}<Arrow /></a></p>;
  }
}

export function Blocks({ blocks, bare = false }: { blocks: Block[]; bare?: boolean }) {
  const content = blocks.map((block, i) => <One key={i} block={block} />);
  return bare ? <>{content}</> : <div className="prose">{content}</div>;
}
