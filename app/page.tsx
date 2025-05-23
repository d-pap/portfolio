import Image from "next/image";
import { socialLinks } from "./config";
import Link from "next/link";
import { projects } from "./projects/project-data";
import { getBlogPosts, formatDate } from "./lib/posts";
import Hero from "./components/hero";

export default function Page() {
  // Get the latest blog posts for the featured section
  const featuredPosts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 4); // Get the 4 most recent posts

  // Debug log to check post metadata
  console.log(
    "Featured Posts Metadata:",
    featuredPosts.map((post) => ({
      title: post.metadata.title,
      image: post.metadata.image,
    }))
  );

  return (
    <>
      <Hero />

      {/* Latest Works Section */}
      <div className="w-full bg-white dark:bg-gray-900">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="portfolio"
        >
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Works</span>
                </div>
                <h2 className="text-2xl font-light">
                  Selected projects I've worked on
                </h2>
              </div>
            </div>

            {/* Project List - Right side on desktop */}
            <div className="md:col-span-8 md:col-start-5">
              <div className="space-y-12">
                {featuredPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="col-span-2">
                        <div className="aspect-square relative overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={post.metadata.image || "/profile.png"}
                            alt={post.metadata.title}
                            className="object-cover grayscale"
                            fill
                            sizes="(max-width: 768px) 25vw, 20vw"
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="inline-flex items-center space-x-2 text-sm">
                          <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                            <div className="flex items-center space-x-2">
                              <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                              <span>{post.metadata.category || "Project"}</span>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-light mt-2 mb-1">
                          {post.metadata.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(post.metadata.publishedAt)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#2D6960] transition-colors"
                >
                  View all projects
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Experiences Section */}
      <div className="w-full bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Experience</span>
                </div>
                <h2 className="text-2xl font-light">Places I've worked at</h2>
              </div>
            </div>

            {/* Experience List - Right side on desktop */}
            <div className="md:col-span-8 md:col-start-5">
              <div className="space-y-12">
                {/* Full Stack Developer */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        May 2024 - January 2025
                      </p>
                    </div>
                    <div className="col-span-6">
                      <div className="inline-flex items-center space-x-2 text-sm">
                        <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                          <div className="flex items-center space-x-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                            <span>Development</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-light mt-2">
                        Full Stack Developer
                      </h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-2">
                        Code Coach
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Created an AI-powered learning platform for ACM students
                        to solve coding problems and prepare for programming
                        competitions and technical interviews.
                      </p>
                    </div>
                  </article>
                </div>

                {/* Data Analyst */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        October 2023 - February 2024
                      </p>
                    </div>
                    <div className="col-span-6">
                      <div className="inline-flex items-center space-x-2 text-sm">
                        <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                          <div className="flex items-center space-x-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                            <span>Analytics</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-light mt-2">Data Analyst</h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-2">
                        iLabs, Center of Innovative Research
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Analyzed data from the Center of Innovative Research to
                        provide insights and recommendations for the center.
                      </p>
                    </div>
                  </article>
                </div>

                {/* Math Tutor */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        February 2023 - April 2024
                      </p>
                    </div>
                    <div className="col-span-6">
                      <div className="inline-flex items-center space-x-2 text-sm">
                        <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                          <div className="flex items-center space-x-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                            <span>Education</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-light mt-2">Math Tutor</h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-2">
                        UM-Dearborn
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tutored students in linear algebra, calculus, and
                        statistics.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <div className="w-full bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4 font-mono">
              <span className="text-blue-600 dark:text-blue-400">$</span> ls
              about/
            </span>
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              The Developer Behind the Code
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Combining analytical thinking with creative problem-solving to
              build meaningful digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            <div className="md:col-span-4 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl -rotate-6"></div>
                <div className="relative aspect-square w-full max-w-[256px] mx-auto">
                  <Image
                    src="/final-linkedin2.PNG"
                    alt="Derek Papierski"
                    fill
                    className="object-cover rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    3+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    10+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Projects Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-8">
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-xl mb-6">
                  Data Scientist with Full-Stack Development Experience.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Leveraging analytical rigor and technical versatility to solve
                  complex problems across data and software systems.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Data Science
                    </span>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      AI
                    </span>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Web Development
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Design Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      UI/UX Design
                    </span>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Design Systems
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Read My Blog
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative">
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold tracking-tight mb-4">
                Let's Work Together
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Whether you need help with data science, web development, or
                want to discuss a potential collaboration, I'm always open to
                new opportunities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="mailto:derekpap@umich.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Send me an email
                </a>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-8 py-4 rounded-full border-2 border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  View my blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
