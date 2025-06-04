import React from "react";
import Link from "next/link";
import { getBlogPosts } from "app/lib/posts";
import { socialLinks } from "app/config";

export default async function Footer() {
  const posts = await getBlogPosts();

  return (
    <footer
      className="w-full bg-whitebg dark:bg-blackbg border-t border-gray-200 dark:border-gray-800"
      style={{ marginTop: "164px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-gray-100">
              Derek Papierski
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Data scientist & developer turning complexity into clarity through
              elegant code.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-6 text-gray-900 dark:text-gray-100">
              Navigation
            </h3>
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#about"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-base font-medium mb-6 text-gray-900 dark:text-gray-100">
              Connect
            </h3>
            <div className="space-y-4">
              <a
                href={socialLinks.email}
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Email
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Latest Posts */}
          <div>
            <h3 className="text-base font-medium mb-6 text-gray-900 dark:text-gray-100">
              Recent Work
            </h3>
            <div className="space-y-4">
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
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {post.metadata.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} Derek Papierski. All rights reserved.
            </p>
            <p className="mt-4 md:mt-0">Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
