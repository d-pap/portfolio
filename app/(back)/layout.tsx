import { Frame } from "app/components/frame";

export default function BackLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Frame plane="back" />
      <main id="main" className="room">{children}</main>
    </>
  );
}
