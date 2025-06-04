import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export default function PageWrapper({
  children,
  className = "",
  backgroundColor = "bg-whitebg dark:bg-blackbg",
}: PageWrapperProps) {
  return (
    <div
      className={`w-full ${backgroundColor}`}
      style={{ paddingTop: "110px" }}
    >
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
