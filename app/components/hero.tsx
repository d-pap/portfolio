import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-3xl pt-16 md:pt-0">
          {/* Main content */}
          <div className="relative space-y-20 md:space-y-28">
            {/* Decorative elements */}
            <div className="absolute -inset-4 md:-inset-6 border border-gray-400 dark:border-gray-800 rounded-lg"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E7F0EE] rounded-full blur-3xl opacity-20 -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2D6960] rounded-full blur-3xl opacity-10 translate-y-12 -translate-x-12"></div>

            {/* Content with padding to account for border */}
            <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
              {/* Name and Title */}
              <div className="space-y-12">
                <div className="inline-flex items-center space-x-2 text-sm">
                  <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960]">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                      <span>whoami</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Data Specialist & Developer
                  </h1>
                  <p className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    Data Scientist × Developer crafting intelligent solutions at
                    the intersection of data science and software development.
                  </p>
                </div>
              </div>

              {/* Actions and Links */}
              <div className="space-y-12 mt-16">
                <div className="flex flex-wrap gap-8 justify-center">
                  <Link
                    href="#portfolio"
                    className="text-base text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                  >
                    View Projects →
                  </Link>
                  <Link
                    href="#contact"
                    className="text-base text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                  >
                    Contact Me →
                  </Link>
                </div>

                {/* Status - Scroll Indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-center">
                  <span className="w-2 h-2 bg-[#2D6960] rounded-full animate-pulse"></span>
                  <span className="font-light">Scroll to explore_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
