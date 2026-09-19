import Link from "next/link";
export const metadata = { title: "Page not found" };
export default function NotFound() {
  return <section className="site-shell empty-page"><p className="eyebrow">404</p><h1>nothing here.</h1><p>This page may have moved.</p><Link className="text-link" href="/">back home <span aria-hidden="true">↗</span></Link></section>;
}
