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
    <PageWrapper>
      <h1 className="mb-8 text-2xl font-bold">Blog Posts</h1>
      <div className="space-y-6">
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
              className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              href={`/blog/${post.slug}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {post.metadata.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </PageWrapper>
  );
}
