import Image from "next/image";
import { socialLinks } from "./config";
import Link from "next/link";
import { projects } from "./projects/project-data";
import { getBlogPosts, formatDate } from "./lib/posts";
import Hero from "./components/hero";
import AboutSection from "./components/about-section";

export default function Page() {
  // Get the latest blog posts for the featured section
  const featuredPosts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 6); // Get more posts for the grid

  return (
    <>
      <Hero />

      {/* Projects Section */}
      <div
        className="w-full bg-whitebg dark:bg-blackbg"
        style={{ paddingTop: "164px" }}
      >
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="portfolio">
          {/* Section Title */}
          <div className="mb-12">
            <h2
              className="text-gray-900 dark:text-gray-100 font-normal leading-tight text-3xl sm:text-4xl lg:text-5xl"
              style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
            >
              Projects
            </h2>
            <div
              className="bg-gray-900 dark:bg-gray-100 w-full h-0.5 rounded-full"
              style={{ marginTop: "27px" }}
            ></div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {featuredPosts.map((post) => (
              <div key={post.slug} className="space-y-4">
                <h3
                  className="font-medium text-gray-900 dark:text-gray-100 leading-tight text-xl lg:text-2xl"
                  style={{ fontSize: "clamp(1.25rem, 3vw, 30px)" }}
                >
                  {post.metadata.title}
                </h3>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block relative overflow-hidden rounded-lg"
                  style={{ aspectRatio: "370/558" }}
                >
                  {/* Project Image */}
                  <div className="relative w-full h-full bg-whitebg dark:bg-blackbg">
                    <Image
                      src={post.metadata.image || "/profile.png"}
                      alt={post.metadata.title}
                      fill
                      className="object-contain transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex flex-col justify-end p-4 lg:p-6 opacity-0 group-hover:opacity-100">
                      <div className="text-white">
                        {post.metadata.summary && (
                          <p className="text-sm mb-4 text-gray-200 leading-relaxed">
                            {post.metadata.summary}
                          </p>
                        )}

                        {post.metadata.tags && (
                          <div className="flex flex-wrap gap-2">
                            {post.metadata.tags.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <AboutSection />

      {/* Experiences Section */}
      <div
        className="w-full bg-whitebg dark:bg-blackbg"
        style={{ paddingTop: "164px" }}
      >
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Title */}
          <div className="mb-12">
            <h2
              className="text-gray-900 dark:text-gray-100 font-normal leading-tight text-3xl sm:text-4xl lg:text-5xl"
              style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
            >
              Experience
            </h2>
            <div
              className="bg-gray-900 dark:bg-gray-100 w-full h-0.5 rounded-full"
              style={{ marginTop: "27px" }}
            ></div>
          </div>

          {/* Experience List - Grid Layout */}
          <div className="grid gap-8 lg:gap-12">
            {/* Full Stack Developer */}
            <div className="bg-whitebg dark:bg-blackbg rounded-lg p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3
                    className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-xl lg:text-2xl"
                    style={{ fontSize: "clamp(1.25rem, 3vw, 30px)" }}
                  >
                    Full Stack Developer
                  </h3>
                  <h4 className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    Code Coach
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                  May 2024 - January 2025
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Created an AI-powered learning platform for ACM students to
                solve coding problems and prepare for programming competitions
                and technical interviews.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  AWS
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  LLMs
                </span>
              </div>
            </div>

            {/* Data Analyst */}
            <div className="bg-whitebg dark:bg-blackbg rounded-lg p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3
                    className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-xl lg:text-2xl"
                    style={{ fontSize: "clamp(1.25rem, 3vw, 30px)" }}
                  >
                    Data Analyst
                  </h3>
                  <h4 className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    iLabs, Center of Innovative Research
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                  October 2023 - February 2024
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Gathered and analyzed University of Michigan-Dearborn student
                data to provide insights about student engagement and made
                recommendations to university stakeholders.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Python
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  SQL
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Tableau
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Excel
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  SPSS
                </span>
              </div>
            </div>

            {/* Math Tutor */}
            <div className="bg-whitebg dark:bg-blackbg rounded-lg p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3
                    className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-xl lg:text-2xl"
                    style={{ fontSize: "clamp(1.25rem, 3vw, 30px)" }}
                  >
                    Math Tutor
                  </h3>
                  <h4 className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    UM-Dearborn
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                  February 2023 - April 2024
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Tutored first and second year students in linear algebra,
                calculus, and statistics to help them succeed.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Linear Algebra
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Calculus
                </span>
                <span className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm">
                  Statistics
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action - Centered */}
      <div
        className="w-full bg-whitebg dark:bg-blackbg"
        style={{ paddingTop: "164px" }}
      >
        <section
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
          id="contact"
        >
          {/* Section Title */}
          <div className="mb-12">
            <h2
              className="text-gray-900 dark:text-gray-100 font-normal leading-tight text-3xl sm:text-4xl lg:text-5xl"
              style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
            >
              Let's Work Together
            </h2>
            <div
              className="bg-gray-900 dark:bg-gray-100 w-full h-0.5 rounded-full mx-auto"
              style={{ marginTop: "27px", maxWidth: "200px" }}
            ></div>
          </div>

          <div>
            <p
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg sm:text-xl lg:text-2xl"
              style={{
                fontSize: "clamp(1.125rem, 3vw, 30px)",
                lineHeight: "1.4",
              }}
            >
              Whether you want to discuss a potential project, share ideas about
              data science, or just talk tech, I'm always happy to connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="mailto:derek@derekpapierski.com"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Get in touch →
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-black transition-colors text-lg font-medium"
              >
                Read my blog →
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
