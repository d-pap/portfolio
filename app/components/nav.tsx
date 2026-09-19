"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";

export function Navbar() {
  const pathname = usePathname();
  const isProject = pathname.startsWith("/work/") || pathname.startsWith("/blog/");
  return <header className="site-header site-shell">
    <Link className="site-name" href="/" aria-label="Derek Papierski — home">derek papierski<span className="name-dot" aria-hidden="true">.</span></Link>
    <p className="header-role">AI & software engineer</p>
    <div className="header-end">
      <span className="header-location">Michigan, USA</span>
      <div className="header-controls"><ThemeSwitch />{isProject && <Link className="close-project" href="/" aria-label="Close project and return home"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.3" /></svg></Link>}</div>
    </div>
  </header>;
}
