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

      <div className="w-full bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4">
              Portfolio
            </span>
            <h2 className="text-4xl font-bold">Latest Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative block overflow-hidden rounded-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={post.metadata.image || "/profile.png"}
                    alt={post.metadata.title}
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {post.metadata.title}
                  </h3>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(post.metadata.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/blog" className="inline-flex items-center text-sm">
              <span className="mr-2">Check out More</span>
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>
      </div>

      {/* EXPERIENCES */}
      <div className="w-full bg-[#FDFAF6] dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="mb-12">
            <span className="inline-block text-sm mb-4">• Experiences</span>
            <div className="flex justify-between items-start">
              <h2 className="text-5xl font-normal max-w-md">
                Explore My Journey
              </h2>
              <div className="max-w-md">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Over the past 4+ years, I've had the opportunity to work on a
                  wide range of design projects, collaborating with diverse
                  teams and clients to bring creative visions to life.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-black dark:text-white hover:opacity-80"
                >
                  Book A Call <span className="ml-1">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* work experience */}
          <div className="space-y-12">
            {/* experience 1 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl mb-2">
                    Code Coach, Full Stack Developer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    May 2024 - January 2025
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Created a web platform for students to learn coding and
                    prepare for programming competitions and technical
                    interviews for a client.
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Web Dev
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    AWS
                  </span>
                </div>
              </div>
            </div>

            {/* experience 2 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl mb-2">iLabs, Data Analyst</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    October 2023 - February 2024
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Led UX/UI, San Francisco . Crafting tomorrow's experiences
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    UI/UX
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Branding
                  </span>
                </div>
              </div>
            </div>

            {/* experience 3 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3">
                  <h3 className="text-xl mb-2">UM-Dearborn, Math Tutor</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    February 2022 - Present
                  </p>
                </div>
                <div className="md:w-1/3">
                  <p className="text-gray-600 dark:text-gray-300">
                    Principal Designer, Berlin, Crafting tomorrow's experiences
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-wrap justify-end items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Branding
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    UI/UX
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ABOUT ME */}
      <div className="w-full bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4">
              About Me
            </span>
            <h2 className="text-4xl font-bold mb-4">
              The Developer Behind the Code
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate about creating elegant solutions to complex problems
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/3">
              <div className="relative aspect-square w-full max-w-[256px] mx-auto">
                <Image
                  src="/final-linkedin2.PNG"
                  alt="Derek Papierski"
                  fill
                  className="object-cover rounded-2xl shadow-xl grayscale"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>

            <div className="md:w-2/3 space-y-6">
              <div className="prose prose-lg dark:prose-invert">
                <p>
                  Hi, I'm Derek Papierski, a data scientist and software
                  engineer who specializes in simplifying technical concepts and
                  creating elegant solutions to complex problems. I enjoy
                  building tools that help people - whether that means creating
                  beautifully-designed applications, automating processes, or
                  finding patterns in messy datasets. My sweet spot is anything
                  that lives at the intersection of code, data, and design.
                </p>
                <p>
                  I specialize in data science, web development, and artificial
                  intelligence, bringing a unique blend of technical expertise
                  and creative problem-solving to every project. and creative
                  problem-solving to every project.
                </p>
                <p>
                  With experience in both frontend and backend development, I
                  enjoy creating seamless user experiences while ensuring robust
                  and scalable architectures. My approach combines modern best
                  practices with innovative solutions to deliver exceptional
                  results.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                  Data Science
                </span>
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                  AI
                </span>
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                  Web Development
                </span>
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                  Design
                </span>
              </div>

              <div className="flex gap-4 pt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Read My Blog
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-gray-900 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>

          {/* TECH AND TOOLS */}
          <div className="mt-24 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-4">
                Tech Stack
              </span>
              <h3 className="text-3xl font-bold">Technologies & Tools</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Languages */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Python
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                    JavaScript
                  </span>
                  <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                    TypeScript
                  </span>
                  <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    C++
                  </span>
                  <span className="px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-full text-sm">
                    SQL
                  </span>
                </div>
              </div>

              {/* Frontend */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Frontend
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                    Tailwind
                  </span>
                  <span className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 rounded-full text-sm">
                    HTML/CSS
                  </span>
                </div>
              </div>

              {/* Backend */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Backend
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">
                    Node.js
                  </span>
                  <span className="px-3 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 rounded-full text-sm">
                    Express
                  </span>
                  <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm">
                    MongoDB
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    PostgreSQL
                  </span>
                </div>
              </div>

              {/* Tools */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                    Git
                  </span>
                  <span className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 rounded-full text-sm">
                    Docker
                  </span>
                  <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                    AWS
                  </span>
                  <span className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full text-sm">
                    Linux
                  </span>
                </div>
              </div>

              {/* Data Science */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Data Science
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    NumPy
                  </span>
                  <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                    Pandas
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                    TensorFlow
                  </span>
                  <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    PyTorch
                  </span>
                </div>
              </div>

              {/* Other */}
              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                  Other
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    REST APIs
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                    CI/CD
                  </span>
                  <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-full text-sm">
                    Agile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
