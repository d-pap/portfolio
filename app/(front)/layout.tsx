import { BackPlane } from "app/components/back-plane/back-plane";
import { Frame } from "app/components/frame";
import { PlaneWatch } from "app/components/sheet/plane-watch";
import "app/components/sheet/sheet.css";

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
