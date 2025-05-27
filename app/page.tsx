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
      <div className="w-full bg-secondary dark:bg-secondary">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="portfolio"
        >
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4 font-mono">
              <span className="text-blue-600 dark:text-blue-400">{" > "}</span>{" "}
              /projects
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Latest Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Exploring the intersection of data and code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative block overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={post.metadata.image || "/profile.png"}
                    alt={post.metadata.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">
                    {post.metadata.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.metadata.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 text-sm border-2 border-gray-900 dark:border-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </section>
      </div>
      {/* Experiences Section */}
      <div className="w-full bg-tertiary dark:bg-tertiary">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="mb-16">
            <span className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4 font-mono">
              <span className="text-blue-600 dark:text-blue-400">{" > "}</span>{" "}
              /experiences
            </span>
            <div className="flex justify-between items-start">
              <h2 className="text-5xl font-bold tracking-tight max-w-md">
                Journey So Far
              </h2>
              <div className="max-w-md">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Exploring the boundaries of technology through data science
                  and development.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Schedule a Call →
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-bold">Full Stack Developer</h3>
                  <h4 className="text-lg mb-2 text-gray-600 dark:text-gray-400">
                    Code Coach
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    May 2024 - January 2025
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Created an AI-powered learning platform for ACM students to
                    solve coding problems and prepare for programming
                    competitions and technical interviews.
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-start gap-2">
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Web Dev
                  </span>
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    LLM
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-bold">Data Analyst</h3>
                  <h4 className="text-lg mb-2 text-gray-600 dark:text-gray-400">
                    iLabs, Center of Innovative Research
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    October 2023 - February 2024
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Analyzed data from the Center of Innovative Research to
                    provide insights and recommendations for the center.
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-start gap-2">
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Data Analysis
                  </span>
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Visualization
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-bold">Math Tutor</h3>
                  <h4 className="text-lg mb-2 text-gray-600 dark:text-gray-400">
                    UM-Dearborn
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    February 2023 - April 2024
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Tutored students in linear algebra, calculus, and
                    statistics.
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-start gap-2">
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Statistics
                  </span>
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Calculus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <div className="w-full bg-secondary dark:bg-secondary">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4 font-mono">
              <span className="text-blue-600 dark:text-blue-400">{" > "}</span>{" "}
              /about
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
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Python
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      SQL
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      R
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Tableau
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      TensorFlow
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      AWS
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Git
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Data Science
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Data Viz
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Machine Learning
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      Web Dev
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      NLP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Connect Section */}
      <div className="w-full bg-tertiary dark:bg-tertiary">
        <section
          id="contact"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
        >
          {/* Important Chip */}
          <div className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-8 font-mono">
            <span className="text-blue-600 dark:text-blue-400">{" > "}</span>{" "}
            /contact
          </div>

          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Let's Connect
          </h2>

          {/* Subheading */}
          <p className="max-w-xl text-xl font-light text-gray-600 dark:text-gray-400 mb-12">
            Interested in working together, have a question, or just want to say
            hi? I'd love to hear from you.
          </p>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="mailto:hi@derekpapierski.com"
              className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
            >
              Email Me
            </a>
            <Link
              href="https://www.linkedin.com/in/derekpapierski"
              target="_blank"
              className="px-8 py-4 border-2 border-gray-900 dark:border-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Connect on LinkedIn
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
