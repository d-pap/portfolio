import { socialLinks } from "app/config";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full">
      {" "}
      {/* //! div needed for section background color to span full width  */}
      <section className="max-w-7xl min-h-[80vh] mx-auto px-4 sm:px-6 py-12 md:py-32 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {/* <a href={socialLinks.twitter} target="_blank">
            <Image
              src="/final-linkedin2.png"
              alt="Profile photo"
              className="rounded-full border-solid border-2 border-red-500 block hover:grayscale-0 transition"
              unoptimized
              width={160}
              height={160}
              priority
            />
          </a> */}
          <h1 className="mt-10 text-3xl font-bold text-center">
            Hello, I'm Derek.
          </h1>
          <h2 className="mt-4 mb-8 text-2xl font-bold">
            Data Scientist + Developer
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition mt-6"
          >
            Check me out &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
