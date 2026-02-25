import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRT Editor",
  description: "Upload and edit .srt subtitle files in the browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
