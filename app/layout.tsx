import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Хоригдогчийн систем",
  description: "Хоригдогчийн мэдээллийн систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
