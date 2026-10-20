import { Frame } from "app/components/frame";
import { PortfolioFooter } from "app/components/ascii/portfolio-footer";

export const revalidate = 3600;
export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Frame plane="front" />
      <main id="main" className="portfolio-main">
        {children}
      </main>
      <PortfolioFooter />
    </>
  );
}
