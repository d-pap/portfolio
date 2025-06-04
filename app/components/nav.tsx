"use client";

import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { useState, useEffect, useRef } from "react";

const navItems = {
  "/": { name: "Work" },
  "/#about": { name: "About" },
  "/#contact": { name: "Contact" },
  "/blog": { name: "Other" },
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header when at the top
      if (currentScrollY < 50) {
        setIsVisible(true);
        return;
      }

      // Show header when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        // Hide after 2 seconds of no scrolling up
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (currentScrollY > 100) {
            setIsVisible(false);
          }
        }, 2000);
      } else {
        // Hide when scrolling down
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 bg-whitebg/80 dark:bg-blackbg/80 backdrop-blur-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ height: "110px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors font-medium"
        >
          derekpapierski
        </Link>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden lg:flex items-center" style={{ gap: "27.35px" }}>
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors"
              style={{ fontSize: "24.867px" }}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="relative lg:hidden">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group p-2"
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-900 dark:text-gray-100"
              >
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full right-0 mt-2 w-48 bg-whitebg dark:bg-blackbg border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
              >
                <div className="py-1">
                  {Object.entries(navItems).map(([path, { name }]) => (
                    <Link
                      key={path}
                      href={path}
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
