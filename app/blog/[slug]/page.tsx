import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";

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
    <div
      className="w-full bg-whitebg dark:bg-blackbg"
      style={{ paddingTop: "174px" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 md:pb-32">
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

        {/* Article Header */}
        <header className="mb-12">
          {/* Date */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {formatDate(post.metadata.publishedAt)}
          </p>

          {/* Title */}
          <h1
            className="font-medium text-gray-900 dark:text-gray-100 mb-6 leading-tight text-3xl sm:text-4xl lg:text-5xl"
            style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
          >
            {post.metadata.title}
          </h1>

          {/* Summary */}
          {post.metadata.summary && (
            <p
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg sm:text-xl"
              style={{ fontSize: "clamp(1.125rem, 2.5vw, 20px)" }}
            >
              {post.metadata.summary}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.metadata.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="px-3 py-2 bg-primaryLight text-primary rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span className="text-sm font-medium">{tag.trim()}</span>
                </div>
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
          <CustomMDX source={post.content} />
        </article>
      </div>
    </div>
  );
}
