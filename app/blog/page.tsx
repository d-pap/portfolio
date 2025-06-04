import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Blog",
};

export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div
      className="w-full bg-whitebg dark:bg-blackbg"
      style={{ paddingTop: "174px" }}
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-32">
        {/* Section Title */}
        <div className="mb-12">
          <h2
            className="text-gray-900 dark:text-gray-100 font-normal leading-tight text-3xl sm:text-4xl lg:text-5xl"
            style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
          >
            All Posts
          </h2>
          <div
            className="bg-gray-900 dark:bg-gray-100 w-full h-0.5 rounded-full"
            style={{ marginTop: "27px" }}
          ></div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 lg:gap-12">
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
                <article className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 lg:p-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      {/* Post Title */}
                      <h3
                        className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors mb-3 leading-tight text-xl lg:text-2xl"
                        style={{ fontSize: "clamp(1.25rem, 3vw, 30px)" }}
                      >
                        {post.metadata.title}
                      </h3>

                      {/* Post Summary */}
                      {post.metadata.summary && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {post.metadata.summary}
                        </p>
                      )}

                      {/* Tags */}
                      {post.metadata.tags && (
                        <div className="flex flex-wrap gap-2">
                          {post.metadata.tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primaryLight text-primary rounded-full text-sm group-hover:bg-primaryHover transition-colors"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Date */}
                    <div className="sm:text-right sm:ml-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(post.metadata.publishedAt, false)}
                      </p>
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
