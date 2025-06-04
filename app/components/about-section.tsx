"use client";

import React, { useState } from "react";

interface DropdownData {
  id: string;
  title: string;
  content: string;
}

const dropdownData: DropdownData[] = [
  {
    id: "data-science",
    title: "Data Science & Analytics",
    content:
      "Extracting actionable insights from complex datasets using Python, SQL, R, and advanced statistical modeling. Specialized in machine learning, data visualization, and predictive analytics to drive data-informed decision making.",
  },
  {
    id: "full-stack",
    title: "Full-Stack Development",
    content:
      "Building end-to-end applications with React, Next.js, Node.js, and cloud technologies. Creating seamless user experiences that integrate data science insights with modern web development practices for maximum impact.",
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    content:
      "Developing intelligent systems using TensorFlow, PyTorch, and LLMs. From creating AI-powered learning platforms to implementing statistical models that solve real-world problems and enhance user experiences.",
  },
];

export default function AboutSection() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div
      className="w-full bg-whitebg dark:bg-blackbg"
      style={{ paddingTop: "164px" }}
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6" id="about">
        {/* Section Title */}
        <div className="mb-12">
          <h2
            className="text-gray-900 dark:text-gray-100 font-normal leading-tight text-3xl sm:text-4xl lg:text-5xl"
            style={{ fontSize: "clamp(2rem, 4vw, 45.063px)" }}
          >
            About Me
          </h2>
          <div
            className="bg-gray-900 dark:bg-gray-100 w-full h-0.5 rounded-full"
            style={{ marginTop: "27px" }}
          ></div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left Column - About Text */}
          <div>
            <p
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg sm:text-xl lg:text-2xl"
              style={{
                fontSize: "clamp(1.125rem, 3vw, 30px)",
                lineHeight: "1.4",
              }}
            >
              I'm a data-focused technologist with dual majors in Computer
              Science and Data Science. I specialize in extracting actionable
              insights from complex datasets while building tools and
              applications that turn those insights into real-world solutions.
            </p>
          </div>

          {/* Right Column - Collapsible Sections */}
          <div
            className="relative"
            style={{ minHeight: "500px" }} // Fixed height to prevent layout shift
          >
            <div className="space-y-6">
              {dropdownData.map((item) => (
                <div
                  key={item.id}
                  className="group border-b-2 border-gray-800 dark:border-gray-200"
                >
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="w-full flex items-center justify-between cursor-pointer p-4 bg-whitebg dark:bg-blackbg"
                  >
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100 text-lg sm:text-xl lg:text-2xl text-left"
                      style={{ fontSize: "clamp(1.125rem, 3vw, 30px)" }}
                    >
                      {item.title}
                    </span>
                    <svg
                      className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                        openDropdown === item.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openDropdown === item.id && (
                    <div className="p-4 pt-2 bg-whitebg dark:bg-blackbg rounded-b-lg">
                      <p
                        className="text-gray-600 dark:text-gray-400 leading-relaxed"
                        style={{ fontSize: "clamp(1rem, 2.5vw, 20px)" }}
                      >
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Skills Ticker - Full Width */}
        <div className="relative overflow-hidden bg-whitebg dark:bg-blackbg rounded-lg py-6 lg:py-8">
          <div className="flex animate-marquee whitespace-nowrap">
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Python
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              React
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Next.js
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              SQL
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Tableau
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              AWS
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Machine Learning
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              TypeScript
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Docker
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              TensorFlow
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Python
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              React
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Next.js
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              SQL
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              Tableau
            </span>
            <span
              className="mx-6 lg:mx-8 text-gray-700 dark:text-gray-300"
              style={{ fontSize: "clamp(1rem, 2.5vw, 24px)" }}
            >
              AWS
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
