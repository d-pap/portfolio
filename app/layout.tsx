import "./styles/tokens.css";
import "./styles/base.css";
import type { Metadata } from "next";
import "./styles/ascii.css";
import { AsciiField } from "./components/ascii/ascii-field";
import { MotionProvider } from "./components/ascii/motion";
import { SiteAnalytics } from "app/components/site-analytics";
import { metaData } from "./config";
import { bootScripts } from "app/boot/boot";

const SPECULATION = {
  prerender: [
    {
      where: {
        or: [
          { href_matches: "/work/*" },
          { href_matches: "/bookshelf" },
          { href_matches: "/bookshelf/*" },
          { href_matches: "/notes" },
          { href_matches: "/notes/*" },
        ],
      },
      eagerness: "moderate",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: { default: metaData.title, template: `%s | ${metaData.title}` },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: { title: metaData.name, card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {bootScripts().map((source, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: source }} />
        ))}
      </head>
      <body>
        <a className="skip-link" href="#main">
          skip to content
        </a>
        <MotionProvider>
          <AsciiField />
          {children}
        </MotionProvider>
        {/* Prerender a project or a room entry when the pointer rests on its link, so the transition starts on the next frame. */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SPECULATION) }}
        />
        <SiteAnalytics />
      </body>
    </html>
  );
}
