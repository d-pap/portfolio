import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[90vh] relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center">
          <div className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-8 font-mono">
            <span className="text-blue-600 dark:text-blue-400">$</span> whoami
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Derek Papierski
            <span className="block text-2xl md:text-3xl mt-4 text-gray-600 dark:text-gray-400 font-normal">
              Data Scientist × Developer
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400 mb-12 font-mono">
            Crafting intelligent solutions at the intersection of data science
            and software development.
          </p>

          <div className="flex gap-6">
            <Link
              href="#portfolio"
              className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border-2 border-gray-900 dark:border-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Me
            </Link>
          </div>

          {/* Terminal-style typing animation */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>ready for new challenges_</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
