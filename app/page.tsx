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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
              Featured Work
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A selection of projects that showcase my expertise in data science
              and development
            </p>
          </div>

          <div className="grid gap-8">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="grid md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-4">
                      <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
                        <Image
                          src={post.metadata.image || "/profile.png"}
                          alt={post.metadata.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {post.metadata.category || "Project"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.metadata.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#2D6960] transition-colors">
                        {post.metadata.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {post.metadata.summary ||
                          "Explore this project to learn more about the implementation and results."}
                      </p>
                      <div className="flex items-center text-[#2D6960] font-medium group-hover:text-[#245650] transition-colors">
                        <span className="mr-2">View Project</span>
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
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">View All Projects</span>
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
        </section>
      </div>

      {/* Experiences Section */}
      <div className="w-full bg-gray-50 dark:bg-gray-800/50">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
              Professional Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A timeline of experiences that shaped my expertise in data science
              and development
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-[#2D6960] via-gray-300 to-transparent dark:via-gray-600"></div>

            <div className="space-y-16">
              {/* Full Stack Developer */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        Development
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Full Stack Developer
                    </h3>
                    <h4 className="text-[#2D6960] font-medium mb-2">
                      Code Coach
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Created an AI-powered learning platform for ACM students
                      to solve coding problems and prepare for programming
                      competitions and technical interviews.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2D6960] rounded-full border-4 border-white dark:border-gray-900"></div>
                <div className="w-1/2 pl-8">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    May 2024 - January 2025
                  </span>
                </div>
              </div>

              {/* Data Analyst */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    October 2023 - February 2024
                  </span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2D6960] rounded-full border-4 border-white dark:border-gray-900"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                        Analytics
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Data Analyst
                    </h3>
                    <h4 className="text-[#2D6960] font-medium mb-2">
                      iLabs, Center of Innovative Research
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Analyzed data from the Center of Innovative Research to
                      provide insights and recommendations for the center.
                    </p>
                  </div>
                </div>
              </div>

              {/* Math Tutor */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        Education
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Math Tutor
                    </h3>
                    <h4 className="text-[#2D6960] font-medium mb-2">
                      UM-Dearborn
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Tutored students in linear algebra, calculus, and
                      statistics.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2D6960] rounded-full border-4 border-white dark:border-gray-900"></div>
                <div className="w-1/2 pl-8">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    February 2023 - April 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <div className="w-full bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
              About Me
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The story behind the code and the passion that drives my work
            </p>
          </div>

          {/* Profile and Story */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-xl font-light text-gray-900 dark:text-gray-100 leading-relaxed">
                    With a unique blend of analytical thinking and creative
                    problem-solving, I bridge the gap between data science and
                    web development.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    My journey began in mathematics and statistics, which
                    naturally led me to explore the fascinating world of data
                    science and machine learning. Along the way, I discovered my
                    passion for creating intuitive web applications that make
                    complex data accessible and meaningful.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Today, I focus on building data-driven applications that
                    combine robust backend systems with elegant frontend
                    interfaces. Whether I'm developing machine learning models,
                    creating interactive data visualizations, or architecting
                    full-stack applications, I'm always driven by the desire to
                    make technology more accessible and impactful.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto">
                <Image
                  src="/final-linkedin2.PNG"
                  alt="Derek Papierski"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  sizes="(max-width: 1024px) 400px, 50vw"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Technical Expertise
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                A comprehensive toolkit for building modern data-driven
                applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Data Science
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Statistical analysis and insights
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Python
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    SQL
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    R
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Tableau
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Web Development
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Modern web applications
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                    React
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                    Next.js
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                    Node.js
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Machine Learning
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  AI and predictive models
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded">
                    Scikit-learn
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded">
                    TensorFlow
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Tools & DevOps
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Infrastructure and deployment
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded">
                    AWS
                  </span>
                  <span className="px-2 py-1 text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded">
                    Docker
                  </span>
                  <span className="px-2 py-1 text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded">
                    Git
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div className="mt-20 space-y-12">
            <div className="text-center">
              <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Current Focus
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Areas where I'm actively exploring and building innovative
                solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#2D6960] rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Data Visualization
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Creating intuitive and interactive data stories that transform
                  complex datasets into actionable insights through compelling
                  visual narratives.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#2D6960] rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    AI Applications
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Building practical AI solutions for real-world problems,
                  focusing on applications that enhance productivity and
                  decision-making processes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Connect Section */}
      <div className="w-full bg-gradient-to-br from-[#2D6960] via-[#245650] to-[#1a3d37] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-40 relative"
          id="contact"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Let's Build Something Amazing
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Whether you have a project in mind, want to discuss data science,
              or just chat about technology, I'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Email Me</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Drop me a line for project discussions, collaborations, or
                  just to say hello.
                </p>
                <a
                  href="mailto:derekpap@umich.edu"
                  className="inline-flex items-center text-white font-medium hover:text-green-200 transition-colors group"
                >
                  <span className="mr-2">derekpap@umich.edu</span>
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
                </a>
              </div>
            </div>

            {/* Blog */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Read My Blog</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Insights on data science, web development, and the
                  intersection of both fields.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center text-white font-medium hover:text-green-200 transition-colors group"
                >
                  <span className="mr-2">Explore Articles</span>
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
            </div>

            {/* Social */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Connect Online</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Follow my journey and connect with me on professional
                  platforms.
                </p>
                <div className="space-y-3">
                  <a
                    href="https://github.com/d-pap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white font-medium hover:text-green-200 transition-colors group"
                  >
                    <span className="mr-2">GitHub</span>
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
                  </a>
                  <a
                    href="https://linkedin.com/in/derekpapierski"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white font-medium hover:text-green-200 transition-colors group"
                  >
                    <span className="mr-2">LinkedIn</span>
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
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-green-200 mb-4">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              <span className="text-sm font-light tracking-wide">
                Currently available for new opportunities
              </span>
            </div>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Ready to turn ideas into reality? Let's start a conversation.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
