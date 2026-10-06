import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unideals — Buy, Sell & Connect on Campus",
  description:
    "Unideals is the campus marketplace. You have something to sell. Someone's looking for it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
