import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";
import Image from "next/image";

export const metadata = {
  title: "Blog",
  description: "Blog",
};

export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="w-full bg-tertiary dark:bg-tertiary">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mb-16">
          <div className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm mb-8 font-mono">
            <span className="text-blue-600 dark:text-blue-400">{" > "}</span>
            <span>/blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Writing & Projects
          </h1>
          <p className="text-xl font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            Thoughts on development, data science, and building things that
            matter.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-32">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {allBlogs
            .sort((a, b) => {
              if (
                new Date(a.metadata.publishedAt) >
                new Date(b.metadata.publishedAt)
              ) {
                return -1;
              }
              return 1;
            })
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <article className="py-12 group">
                  <div className="flex gap-8">
                    {/* Image */}
                    <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={post.metadata.image || "/profile.png"}
                        alt={post.metadata.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 192px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Date */}
                      <div className="flex items-center gap-4 mb-4">
                        <time className="text-sm text-gray-500 dark:text-gray-400 tabular-nums font-mono">
                          {formatDate(post.metadata.publishedAt, false)}
                        </time>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        {post.metadata.title}
                      </h2>

                      {/* Summary */}
                      {post.metadata.summary && (
                        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                          {post.metadata.summary}
                        </p>
                      )}

                      {/* Tags */}
                      {post.metadata.tags && (
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
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
