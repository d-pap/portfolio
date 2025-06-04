import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";
import { EB_Garamond } from "next/font/google";

const garamond = EB_Garamond({ subsets: ["latin"] });

export default function Hero() {
  return (
    <div className="w-full bg-whitebg dark:bg-blackbg min-h-screen flex flex-col">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 relative flex flex-col flex-grow">
        {/* Main hero content */}
        <div
          className="w-full grid lg:grid-cols-12 gap-8 lg:gap-16 flex-grow"
          style={{ paddingTop: "174px" }}
        >
          {/* Left side - Main content */}
          <div
            className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1"
            style={{ paddingTop: "18px" }}
          >
            <div className="space-y-6">
              <h1
                className="tracking-tight leading-none text-gray-900 dark:text-gray-100 font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ lineHeight: "1.1" }}
              >
                I'm Derek Papierski, a data scientist & developer based in
                Michigan.{" "}
                <span className="underline decoration-2 underline-offset-4">
                  Available
                </span>{" "}
                for freelance & collaborations.
              </h1>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-start order-1 lg:order-2">
            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 w-full max-w-md lg:max-w-none"
              style={{
                aspectRatio: "606/564",
                maxWidth: "606px",
              }}
            >
              {/* Placeholder for now - will be replaced with chosen image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primaryLight/30">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                    🦅
                  </div>
                  <p className="text-xs sm:text-sm">
                    Placeholder for hero image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with contact info */}
        <div className="py-12 md:py-16">
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="uppercase tracking-wide font-medium mb-2">
                Michigan, USA
              </p>
              <Link
                href="mailto:derek@derekpapierski.com"
                className="hover:text-primary transition-colors"
              >
                derek@derekpapierski.com
              </Link>
            </div>
            <div className="sm:text-right">
              <p className="uppercase tracking-wide font-medium">
                Currently available for new projects
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
