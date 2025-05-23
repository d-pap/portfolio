import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[70vh] md:min-h-[70vh] flex items-center">
        <div className="w-full">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16 items-center">
            {/* Left side content - Hidden on mobile */}
            <div className="hidden md:block md:col-span-3">
              <div className="space-y-4 md:sticky md:top-24">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Hello</span>
                </div>
                <h2 className="text-2xl font-light">
                  Welcome to my creative space
                </h2>
              </div>
            </div>

            {/* Main content - Right side */}
            <div className="w-full md:col-span-8 md:col-start-5">
              <div className="space-y-24">
                {/* Name and Title */}
                <div>
                  <div className="inline-flex items-center space-x-2 text-sm mb-8">
                    <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960]">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                        <span>whoami</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                      Derek Papierski
                    </h1>
                    <p className="text-xl font-light text-gray-600 dark:text-gray-400 max-w-xl">
                      Data Scientist × Developer crafting intelligent solutions
                      at the intersection of data science and software
                      development.
                    </p>
                  </div>
                </div>

                {/* Actions and Links */}
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-6">
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
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-[#2D6960] rounded-full animate-pulse"></span>
                    <span className="font-light">Scroll to explore_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
