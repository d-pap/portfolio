import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export default function PageWrapper({ 
  children, 
  className = "", 
  backgroundColor = "bg-white dark:bg-black"
}: PageWrapperProps) {
  return (
    <div className={`w-full ${backgroundColor} py-12 md:py-16`}>
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 ${className}`}>
        {children}
      </div>
    </div>
  );
} 