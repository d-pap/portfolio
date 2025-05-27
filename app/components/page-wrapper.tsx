import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export default function PageWrapper({
  children,
  className = "",
  backgroundColor = "bg-white dark:bg-black",
}: PageWrapperProps) {
  return (
    <div className={`w-full ${backgroundColor} pt-24 pb-12 md:pt-28 md:pb-16`}>
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}
