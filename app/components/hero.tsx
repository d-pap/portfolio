import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          {/* Main content */}
          <div className="space-y-12">
            {/* Status indicator */}
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 bg-[#2D6960] rounded-full animate-pulse"></span>
              <span className="font-light tracking-wide">
                Available for opportunities
              </span>
            </div>

            {/* Name and Title */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 dark:text-gray-100">
                Derek Papierski
              </h1>
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400">
                  Data Scientist & Full-Stack Developer
                </p>
                <p className="text-lg font-light text-gray-500 dark:text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  Crafting intelligent solutions at the intersection of data
                  science and software development
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link
                href="#portfolio"
                className="group inline-flex items-center px-8 py-4 bg-[#2D6960] text-white rounded-full hover:bg-[#245650] transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">View My Work</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="#contact"
                className="group inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-[#2D6960] hover:text-[#2D6960] transition-all duration-300"
              >
                <span className="mr-2">Get In Touch</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="pt-16">
              <div className="flex flex-col items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                <span className="font-light tracking-wide">
                  Scroll to explore
                </span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
