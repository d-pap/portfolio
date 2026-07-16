import Image from "next/image";
import { socialLinks } from "./config";
import Link from "next/link";
import { getFeaturedPosts } from "./lib/posts";
import Hero from "./components/hero";

export default function Page() {
  const featuredPosts = getFeaturedPosts();

  return (
    <>
      <Hero />

      {/* Latest Works Section */}
      <div className="w-full bg-white dark:bg-black">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="portfolio"
        >
          <div
            className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16"
            // id="portfolio"
          >
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Works</span>
                </div>
                <h2 className="text-xl font-light">
                  Products, systems, and sites I've built
                </h2>
              </div>
            </div>

            {/* Project List - Right side on desktop */}
            <div className="md:col-span-8 md:col-start-5">
              <div className="space-y-12">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="col-span-2">
                        <div className="aspect-square relative overflow-hidden rounded bg-white dark:bg-white">
                          <Image
                            src={post.metadata.image || "/profile.png"}
                            alt={post.metadata.title}
                            className="object-contain"
                            fill
                            sizes="(max-width: 768px) 25vw, 20vw"
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        {/* Post Title */}
                        <h3 className="text-base mb-4 group-hover:text-[#2D6960] transition-colors">
                          {post.metadata.title}
                        </h3>

                        {/* Post Summary */}
                        {post.metadata.summary && (
                          <p className="text-xs md:text-sm mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
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

              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                >
                  View all projects
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Experiences Section */}
      <div className="w-full bg-white dark:bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Experience</span>
                </div>
                <h2 className="text-xl font-light">
                  Where I've worked
                </h2>
              </div>
            </div>

            {/* Experience List - Right side on desktop */}
            <div className="md:col-span-8 md:col-start-5">
              <div className="space-y-12">
                {/* App Developer */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        September 2025 - Present
                      </p>
                    </div>
                    <div className="col-span-6">
                      {/* Job Title */}
                      <h3 className="text-base group-hover:text-[#2D6960] transition-colors">
                        App Developer
                      </h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-4">
                        Michigan Medicine
                      </h4>

                      {/* Job Description */}
                      <p className="text-xs md:text-sm mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        I own the RENEW scleroderma app — framework and React
                        upgrades, a token-based design system and UI redesign,
                        security hardening, and App Store and Play Store
                        releases.
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Mobile
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          React Native
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Expo
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          TypeScript
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          UI/UX
                        </span>
                      </div>
                    </div>
                  </article>
                </div>

                {/* AI Engineer */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        June 2025 - Present
                      </p>
                    </div>
                    <div className="col-span-6">
                      {/* Job Title */}
                      <h3 className="text-base group-hover:text-[#2D6960] transition-colors">
                        AI Engineer
                      </h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-4">
                        Michigan Medicine
                      </h4>

                      {/* Job Description */}
                      <p className="text-xs md:text-sm mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        Designed and built Sprout, the RAG service behind
                        RENEW's AI health coach — hybrid retrieval, a
                        personalization memory layer, and the evaluation
                        systems that measure it.
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          RAG
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Python
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          FastAPI
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          LangGraph
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Evals
                        </span>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Full Stack Developer */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        May 2024 - January 2025
                      </p>
                    </div>
                    <div className="col-span-6">
                      {/* Job Title */}
                      <h3 className="text-base group-hover:text-[#2D6960] transition-colors">
                        Full Stack Developer
                      </h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-4">
                        Code Coach
                      </h4>

                      {/* Job Description */}
                      <p className="text-xs md:text-sm mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        Created an AI-powered learning platform for ACM students
                        to solve coding problems and prepare for programming
                        competitions and technical interviews.
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          AI
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          React
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          AWS
                        </span>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Data Analyst */}
                <div className="group">
                  <article className="grid grid-cols-8 gap-4 items-start py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        October 2023 - February 2024
                      </p>
                    </div>
                    <div className="col-span-6">
                      {/* Job Title */}
                      <h3 className="text-base group-hover:text-[#2D6960] transition-colors">
                        Data Analyst
                      </h3>
                      <h4 className="text-base text-gray-600 dark:text-gray-400 mb-4">
                        iLabs, Center of Innovative Research
                      </h4>

                      {/* Job Description */}
                      <p className="text-xs md:text-sm mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        Analyzed student engagement data and reported
                        recommendations to university stakeholders.
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Data Analysis
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          Python
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] text-xs group-hover:bg-[#D8E5E3] transition-colors">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960] mr-2"></span>
                          SQL
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Research Section */}
      <div className="w-full bg-white dark:bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Research</span>
                </div>
                <h2 className="text-xl font-light">Published work</h2>
              </div>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
                  Shah N, Buis L, Papierski D, Castellanos A, Mlakha M, Murphy
                  S.{" "}
                  <a
                    href="https://doi.org/10.2196/79302"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-[#2D6960] transition-colors"
                  >
                    A Beginner&apos;s Guide to Applying Large Language Models
                    in Behavioral Interventions.
                  </a>{" "}
                  <em>JMIR mHealth and uHealth.</em> 2026;14:e79302.
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  This paper documents the approach behind the LLM work in
                  RENEW.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <div className="w-full bg-white dark:bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>About</span>
                </div>
                <h2 className="text-xl font-light">
                  The story behind the code
                </h2>
              </div>
            </div>

            {/* About Content - Right side */}
            <div className="md:col-span-8 md:col-start-5 space-y-12">
              {/* Profile Image and Bio */}
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4">
                  <div className="relative aspect-[4/5] w-full max-w-[200px] sm:max-w-[220px] md:max-w-none mx-auto">
                    <Image
                      src="/final-linkedin2.PNG"
                      alt="Derek Papierski"
                      fill
                      className="object-cover rounded-lg shadow-lg grayscale"
                      sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 25vw"
                      priority
                    />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <div className="prose prose-lg dark:prose-invert">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Software developer, AI engineer, and designer
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      I build AI products end to end at Michigan Medicine: the
                      retrieval service behind an AI health coach, the mobile
                      app it lives in, and the interface people use to talk to
                      it. Before this I worked in data analysis, which still
                      shapes how I approach problems — measure first, then
                      build.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      I care as much about how software feels as how it works.
                      The projects I take on tend to involve both: rebuilding
                      an app's design system and redesigning a nonprofit's
                      website are design problems and engineering problems at
                      the same time, and I like owning both halves.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      A lot of my current work is evaluation. Shipping a
                      medical chatbot is one thing; knowing it's good is
                      another. I spend much of my time on that second problem —
                      from retrieval metrics to multi-turn conversation evals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills and Expertise */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                      Technical Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          AI / LLM Systems
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          RAG, LangGraph, LangChain, pgvector, hybrid
                          retrieval, prompt engineering
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          Evaluation
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Retrieval metrics, LLM-as-judge, multi-turn evals,
                          DeepEval, promptfoo
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          Web & App Development
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          TypeScript, React, React Native, Expo, Next.js,
                          Astro, Python, FastAPI
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          Design & Infrastructure
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          UI/UX, design systems, Figma, PostgreSQL, Docker,
                          CI/CD
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                      Areas of Focus
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          AI Products
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Building LLM-powered features that are grounded,
                          safe, and actually useful — retrieval, memory, and
                          personalization
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          Evaluation
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Measuring AI systems honestly, from retrieval metrics
                          to multi-turn conversation quality for a consumer
                          medical chatbot
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium md:text-base text-gray-900 dark:text-gray-100 mb-2">
                          Design Engineering
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Design systems, accessible interfaces, and the craft
                          details that make software feel considered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-white dark:bg-black">
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32"
          id="contact"
        >
          <div className="md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
            {/* Section Title - Left side on desktop */}
            <div className="md:col-span-3 mb-12 md:mb-0 md:sticky md:top-24 self-start">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  <span>Connect</span>
                </div>
                <h2 className="text-xl font-light">Let's chat about tech</h2>
              </div>
            </div>

            {/* Content - Right side */}
            <div className="md:col-span-8 md:col-start-5 space-y-12">
              <div className="space-y-8">
                {/* Email Contact */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960]"></span>
                          <span className="text-xs md:text-sm">Email</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs md:text-sm">
                      Whether you want to talk about a role, a freelance
                      project, or AI systems in general, I'm happy to connect.
                      I also take on select freelance web design and build
                      work.
                    </p>
                    <a
                      href="mailto:derek@derekpapierski.com"
                      className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                    >
                      derek@derekpapierski.com →
                    </a>
                  </div>
                </div>

                {/* Blog */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960]"></span>
                          <span className="text-xs md:text-sm">Blog</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs md:text-sm">
                      I write about what I'm building — AI systems,
                      evaluation, and web development.
                    </p>
                    <Link
                      href="/blog"
                      className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                    >
                      Read my blog →
                    </Link>
                  </div>
                </div>

                {/* Social Links */}
                <div className="group">
                  <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center space-x-2 text-sm mb-4">
                      <div className="px-3 py-1 rounded-full bg-[#E7F0EE] text-[#2D6960] group-hover:bg-[#D8E5E3] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2D6960]"></span>
                          <span className="text-xs md:text-sm">Social</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs md:text-sm">
                      Follow my journey and connect with me on other platforms.
                      I regularly share updates and insights about my work.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com/d-pap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                      >
                        GitHub →
                      </a>
                      <a
                        href="https://linkedin.com/in/derekpapierski"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-[#2D6960] dark:hover:text-[#2D6960] transition-colors"
                      >
                        LinkedIn →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
