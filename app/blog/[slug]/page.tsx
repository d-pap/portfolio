import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";
import PageWrapper from "app/components/page-wrapper";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${metaData.baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-tertiary dark:bg-tertiary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-24 pb-16">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.metadata.title,
                datePublished: post.metadata.publishedAt,
                dateModified: post.metadata.publishedAt,
                description: post.metadata.summary,
                image: post.metadata.image
                  ? `${metaData.baseUrl}${post.metadata.image}`
                  : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                url: `${metaData.baseUrl}/blog/${post.slug}`,
                author: {
                  "@type": "Person",
                  name: metaData.name,
                },
              }),
            }}
          />
          <h1 className="title mb-3 font-bold text-2xl">
            {post.metadata.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 mb-2">
            {/* Date */}
            <p className="text-gray-500 dark:text-gray-400 tabular-nums">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.metadata.tags.split(",").map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{tag.trim()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-16">
          <article className="prose prose-quoteless prose-neutral dark:prose-invert">
            <CustomMDX source={post.content} />
          </article>
        </div>
      </div>
    </div>
  );
}
