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

      {/* FEATURED BLOG POSTS */}
      <div className="w-full bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h2 className="mb-8 text-2xl font-bold">Featured Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <div
                key={post.slug}
                className="flex flex-col sm:flex-row bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Left side - Image and Chips */}
                <div className="w-full sm:w-2/5 flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[4/3] block"
                  >
                    <Image
                      src={post.metadata.image || "/profile.png"}
                      alt={post.metadata.title}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      priority
                    />
                  </Link>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-100 dark:bg-gray-700 h-full">
                    {post.metadata.tags?.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="w-full sm:w-3/5 p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {post.metadata.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {post.metadata.summary}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block text-sm font-medium hover:underline"
                  >
                    see project
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-block px-6 py-3 text-sm font-medium border-b-2 border-gray-900 dark:border-gray-100 hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
            >
              show more projects
            </Link>
          </div>
        </section>
      </div>

      {/* ABOUT ME */}
      <div className="w-full bg-fuchsia-500">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-8 text-2xl font-bold">About Me</h2>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 items-center justify-center flex">
              <Image
                src="/me-av.PNG"
                alt="Derek Papierski"
                width={160}
                height={160}
                className="rounded-full"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <h2 className="text-2xl font-bold">Derek Papierski</h2>
              <p>
                I'm a software engineer with a passion for building
                user-friendly and efficient applications.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="https://github.com/derek-papierski"
                  className="text-sm uppercase border-gray-900 dark:border-gray-100 hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/derek-papierski/"
                  className="text-sm uppercase border-gray-900 dark:border-gray-100 hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                >
                  LinkedIn
                </Link>
                <Link
                  href="mailto:derekpap@umich.edu"
                  className="text-sm uppercase border-gray-900 dark:border-gray-100 hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                >
                  Email
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <h3>Web Development</h3>
            <h3>Data Science</h3>
            <h3>Machine Learning</h3>
            <h3>AI</h3>
          </div>
        </section>
      </div>

      {/* CONTACT ME */}
      <div className="w-full bg-blue-500 dark:bg-blue-900/20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-6 text-2xl font-bold">Contact Me</h2>
          <p className="mb-6 text-lg">
            Feel free to reach out via email or connect with me on LinkedIn. I'm
            always open to discussing new projects and opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:derek.papierski@gmail.com"
              className="px-6 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
            >
              Email me
            </a>
            <a
              href={socialLinks.linkedin}
              className="px-6 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
