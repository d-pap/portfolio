import React from "react";
import Link from "next/link";
import { getBlogPosts } from "app/lib/posts";
import { socialLinks } from "app/config";

export default async function Footer() {
  const posts = await getBlogPosts();

  return (
    <footer className="w-full bg-tertiary dark:bg-tertiary border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Quick Links
            </h3>
            <div className="space-y-3">
              <Link
                href="/#portfolio"
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href={socialLinks.email}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                hi@derekpapierski.com
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                LinkedIn
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Latest Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Latest Posts
            </h3>
            <div className="space-y-3">
              {posts
                .sort(
                  (a, b) =>
                    new Date(b.metadata.publishedAt).getTime() -
                    new Date(a.metadata.publishedAt).getTime()
                )
                .slice(0, 3)
                .map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.metadata.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Derek Papierski. Built with Next.js and
            Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
