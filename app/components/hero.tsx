import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-black">
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-6 min-h-screen flex items-stretch relative">
        <div className="w-full grid md:grid-cols-12 gap-8 py-20 sm:py-24 md:py-16">
          {/* Left side - Main content */}
          <div className="md:col-span-7 flex flex-col justify-between min-h-[80vh] md:min-h-[85vh]">
            {/* Top - Name and title */}
            <div className="space-y-6 pt-4 sm:pt-8 md:pt-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none text-gray-900 dark:text-gray-100">
                Derek
                <br />
                Papierski
              </h1>
              <p className="text-sm sm:text-base font-medium tracking-wider uppercase text-gray-600 dark:text-gray-400">
                Data Analysis & Development
              </p>
            </div>

            {/* Center - Main message */}
            <div className="flex-1 flex items-center py-8 md:py-12">
              <div className="max-w-sm">
                <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  I turn complexity into clarity through data science and
                  elegant code.
                </p>
              </div>
            </div>

            {/* Bottom - Contact info */}
            <div className="space-y-3 pb-4 sm:pb-8 md:pb-12">
              <p className="text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400 font-medium">
                Michigan, USA
              </p>
              <Link
                href="mailto:derek@derekpapierski.com"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-[#2D6960] transition-colors"
              >
                derek@derekpapierski.com
              </Link>
            </div>
          </div>

          {/* Right side - Visual element positioned at bottom (hidden on mobile) */}
          <div className="hidden md:block md:col-span-5 relative">
            <div className="absolute bottom-0 right-0 md:bottom-8 md:right-0">
              {/* Geometric pattern */}
              <div className="w-64 h-72 lg:w-72 lg:h-80 relative">
                {/* Grid pattern background */}
                <div className="absolute inset-0 opacity-8 dark:opacity-15">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, #2D6960 1px, transparent 0)`,
                      backgroundSize: "8px 8px",
                    }}
                  ></div>
                </div>

                {/* Overlapping geometric shapes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-40 h-52">
                    {/* Large rectangle */}
                    <div className="absolute inset-0 border-2 border-[#2D6960] opacity-25"></div>

                    {/* Offset rectangle */}
                    <div className="absolute inset-0 border-2 border-[#2D6960] opacity-45 translate-x-3 translate-y-3"></div>

                    {/* Inner shapes */}
                    <div className="absolute top-6 left-6 w-12 h-12 bg-[#2D6960] opacity-15"></div>
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-[#2D6960] opacity-35"></div>

                    {/* Dots pattern */}
                    <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-[#2D6960] rounded-full opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#2D6960] rounded-full opacity-70"></div>
                    <div className="absolute top-2/3 left-2/3 w-2 h-2 border border-[#2D6960] rounded-full opacity-40"></div>
                  </div>
                </div>

                {/* Data visualization lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-full h-full opacity-20"
                    viewBox="0 0 200 250"
                  >
                    <path
                      d="M20 40 Q100 20 180 60 T180 130 Q100 150 20 110 T20 210"
                      stroke="#2D6960"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.5"
                    />
                    <path
                      d="M30 70 L170 110 L30 140 L170 180"
                      stroke="#2D6960"
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-600">
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-0.5 h-0.5 bg-[#2D6960] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
