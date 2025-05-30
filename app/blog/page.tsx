import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";
import PageWrapper from "app/components/page-wrapper";

export const metadata = {
  title: "Blog",
  description: "Blog",
};

export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="w-full bg-white dark:bg-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Blog Posts Grid */}
        <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16 pb-24 md:pb-32">
          {/* Section Title - Left side on desktop */}
          <div className="md:col-span-3 mb-8 md:mb-0 md:sticky md:top-24 self-start">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                <span>All Posts</span>
              </div>
              <h2 className="text-xl font-light">
                Latest thoughts and projects
              </h2>
            </div>
          </div>

          {/* Posts List - Right side on desktop */}
          <div className="md:col-span-8 md:col-start-5">
            <div className="space-y-8">
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
                    className="block group"
                  >
                    <article className="py-6 md:py-8 border-t border-gray-200 dark:border-gray-800 first:border-t-0">
                      <div className="space-y-4">
                        {/* Post Date */}
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(post.metadata.publishedAt, false)}
                        </p>

                        {/* Post Title */}
                        <h3 className="text-base group-hover:text-[#2D6960] transition-colors">
                          {post.metadata.title}
                        </h3>

                        {/* Post Summary */}
                        {post.metadata.summary && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {post.metadata.summary}
                          </p>
                        )}

                        {/* Tags */}
                        {post.metadata.tags && (
                          <div className="flex flex-wrap gap-2">
                            {post.metadata.tags.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors"
                              >
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
