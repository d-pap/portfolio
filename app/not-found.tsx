import { Frame } from "app/components/frame";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Frame plane="front" />
      <section className="page empty-page">
        <p className="label">404</p>
        <h1>Nothing here.</h1>
        <p>This page may have moved.</p>
        <a className="text-link" href="/">back home</a>
      </section>
    </>
  );
}
