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
      <div className="w-full bg-white dark:bg-black">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="portfolio"
        >
          <div
            className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16"
            // id="portfolio"
          >
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
                            className="object-cover"
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
                  className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
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
      <div className="w-full bg-white dark:bg-black">
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
      <div className="w-full bg-white dark:bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>About</span>
                </div>
                <h2 className="text-2xl font-light">
                  The story behind the code
                </h2>
              </div>
            </div>

            {/* About Content - Right side */}
            <div className="md:col-span-8 md:col-start-5 space-y-12">
              {/* Profile Image and Bio */}
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4">
                  <div className="relative aspect-[4/5] w-full max-w-[200px] sm:max-w-[220px] md:max-w-none mx-auto">
                    <Image
                      src="/final-linkedin2.PNG"
                      alt="Derek Papierski"
                      fill
                      className="object-cover rounded-lg shadow-lg grayscale"
                      sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 25vw"
                      priority
                    />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <div className="prose prose-lg dark:prose-invert">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Data Scientist & Full-Stack Developer
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      With a unique blend of analytical thinking and creative
                      problem-solving, I bridge the gap between data science and
                      web development. My journey began in mathematics and
                      statistics, which naturally led me to explore the
                      fascinating world of data science and machine learning.
                      Along the way, I discovered my passion for creating
                      intuitive web applications that make complex data
                      accessible and meaningful.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Today, I focus on building data-driven applications that
                      combine robust backend systems with elegant frontend
                      interfaces. Whether I'm developing machine learning
                      models, creating interactive data visualizations, or
                      architecting full-stack applications, I'm always driven by
                      the desire to make technology more accessible and
                      impactful.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills and Expertise */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Technical Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Data Science & Analytics
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Python, SQL, R, Tableau, Excel, Apache Spark
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Web Development
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          React, Next.js, Node.js, TypeScript, JavaScript
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Machine Learning & AI
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scikit-learn, TensorFlow, PyTorch, Statistical
                          Modeling
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Tools & Infrastructure
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          AWS, Docker, Git, Linux, CI/CD
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Areas of Focus
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Data Visualization
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Creating intuitive and interactive data stories that
                          make complex information accessible
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          AI Applications
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Building practical AI solutions that solve real-world
                          problems and drive business value
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Full-Stack Development
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Developing end-to-end applications that seamlessly
                          integrate data science with user experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-white dark:bg-black">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="contact"
        >
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Connect</span>
                </div>
                <h2 className="text-2xl font-light">Let's chat about tech</h2>
              </div>
            </div>

            {/* Content - Right side */}
            <div className="md:col-span-8 md:col-start-5 space-y-12">
              <div className="space-y-8">
                {/* Email Contact */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                          <span>Email</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Whether you want to discuss a potential project, share
                      ideas about data science, or just talk tech, I'm always
                      happy to connect.
                    </p>
                    <a
                      href="mailto:derek@derekpapierski.com"
                      className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                    >
                      derek@derekpapierski.com →
                    </a>
                  </div>
                </div>

                {/* Blog */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                          <span>Blog</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      I write about my experiences in data science, web
                      development, and the intersection of both. Check out my
                      latest thoughts and learnings.
                    </p>
                    <Link
                      href="/blog"
                      className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                    >
                      Read my blog →
                    </Link>
                  </div>
                </div>

                {/* Social Links */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-[#2D6960]"></span>
                          <span>Social</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Follow my journey and connect with me on other platforms.
                      I regularly share updates and insights about my work.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com/d-pap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                      >
                        GitHub →
                      </a>
                      <a
                        href="https://linkedin.com/in/derekpapierski"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                      >
                        LinkedIn →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
