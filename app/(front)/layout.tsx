import { BackPlane } from "app/components/back-plane/back-plane";
import { Frame } from "app/components/frame";
import { PlaneWatch } from "app/components/sheet/plane-watch";
import "app/components/sheet/sheet.css";

// The back plane reads the rooms from Notion: a webhook refreshes these pages by tag, and an hour is the safety net.
export const revalidate = 3600;

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The trip back lands on a doorway at the end of the page, so the first paint waits until it's parsed.
          `blocking` isn't in React's types yet, hence the spread. */}
      <link rel="expect" href="#back" {...{ blocking: "render" }} />
      <Frame plane="front" />
      <div className="sheet">
        <main id="main">{children}</main>
        <span className="sheet-end" aria-hidden="true" />
      </div>
      <BackPlane />
      <PlaneWatch />
    </>
  );
}
