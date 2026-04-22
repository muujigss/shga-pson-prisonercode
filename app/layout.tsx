import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Хоригдогчийн систем",
  description: "Хоригдогчийн мэдээллийн систем",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
