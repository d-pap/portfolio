import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "./project-data";
import PageWrapper from "app/components/page-wrapper";

export const metadata: Metadata = {
  title: "Projects",
  description: "Nextfolio Projects",
};

export default function Projects() {
  return (
    <PageWrapper>
      <h1 className="mb-8 text-2xl font-bold">Projects</h1>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.url}
            className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold text-black dark:text-white">{project.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {project.year}
              </p>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
