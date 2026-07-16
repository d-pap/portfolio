import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full bg-white dark:bg-black">
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-6 min-h-screen flex items-stretch relative">
        <div className="w-full grid md:grid-cols-12 gap-8 py-20 sm:py-24 md:py-16">
          {/* Left side - Main content */}
          <div className="md:col-span-8 flex flex-col justify-between min-h-[80vh] md:min-h-[85vh]">
            {/* Top - Name and title */}
            <div className="space-y-6 pt-4 sm:pt-8 md:pt-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none text-gray-900 dark:text-gray-100">
                Derek
                <br />
                Papierski
              </h1>
              <p className="text-sm sm:text-base font-medium tracking-wider uppercase text-gray-600 dark:text-gray-400">
                Software Developer & AI Engineer
              </p>
            </div>

            {/* Center - Main message */}
            <div className="flex-1 flex items-center py-8 md:py-12">
              <div className="max-w-sm">
                <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  I build, design, and evaluate AI products — currently an
                  LLM-powered health app used in clinical research at Michigan
                  Medicine.
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
