import React from "react";
import Link from "next/link";
import { getBlogPosts } from "app/lib/posts";
import { socialLinks } from "app/config";

export default async function Footer() {
  const posts = await getBlogPosts();

  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Quick Links
            </h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
              >
                Home
              </Link>

              <Link
                href="/blog"
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
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
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
              >
                derek@derekpapierski.com
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
              >
                LinkedIn
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
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
                    className="block text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors "
                  >
                    {post.metadata.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-900 dark:text-gray-100">
          <p>
            © {new Date().getFullYear()} Derek Papierski. Built with Next.js and
            Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
