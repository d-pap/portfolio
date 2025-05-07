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
    .slice(0, 2); // Get the 2 most recent posts

  return (
    <>
      <Hero />

      {/* FEATURED BLOG POSTS */}
      <div className="w-full bg-gray-500 dark:bg-gray-800">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-8 text-2xl font-bold">Featured Blog Posts</h2>
          <div className="space-y-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition"
                href={`/blog/${post.slug}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{post.metadata.title}</h3>
                  <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                    {formatDate(post.metadata.publishedAt, false)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.metadata.summary}</p>
              </Link>
            ))}
          </div>
          <Link href="/blog" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-6">
            Read all posts &rarr;
          </Link>
        </section>
      </div>

      {/* FEATURED PROJECTS */}
      <div className="w-full bg-blue-500 dark:bg-gray-900">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-8 text-2xl font-bold">Featured Projects</h2>
          <div>
            {projects.slice(0, 2).map((project, index) => (
              <Link
                key={index}
                href={project.url}
                className="block mb-6 p-6 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{project.title}</span>
                  <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">{project.year}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-4">
            View all projects &rarr;
          </Link> 
          {/* <Link href="/projects" className="text-blue-600 hover:underline mt-4 block">
            View all projects &rarr;
          </Link> */}
        </section>
      </div>

      {/* ABOUT ME */}
      <div className="w-full">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-8 text-2xl font-bold">About Me</h2>
          <div className="prose prose-neutral dark:prose-invert">
            <p>
              <a
                href="https://www.linkedin.com/in/derek-papierski/"
                target="_blank"
              >
                LinkedIn
              </a>{" "}
              your Nextfolio site with Vercel in minutes and follow the set up
              instructions in the{" "}
              <a href="/blog/getting-started">Getting Started</a> post.
            </p>
            <p>
              Built and maintained by{" "}
              <a href="https://imsirius.xyz/" target="_blank">
                Sirius
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      {/* CONTACT ME */}
      <div className="w-full bg-blue-500 dark:bg-blue-900/20">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <h2 className="mb-6 text-2xl font-bold">Contact Me</h2>
          <p className="mb-6 text-lg">
            Feel free to reach out via email or connect with me on LinkedIn. I'm always open to discussing new projects and opportunities.
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
