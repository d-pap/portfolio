import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";

const navItems = {
  "/blog": { name: "Blog" },
  "/projects": { name: "Projects" },
  "/photos": { name: "Photos" },
};

export function Navbar() {
  return (
    <nav className="w-full py-4 bg-fuchsia-500">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* left: logo + nav links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold px-2 py-2 rounded-lg border border-gray-500 dark:border-gray-500 transition"
          >
            DP
          </Link>
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="text-base font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition"
            >
              {name}
            </Link>
          ))}
        </div>

        {/* right: contact button + theme switch */}
        <div className="flex items-center space-x-4">
          <Link
            href="#contact"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Contact Me
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
