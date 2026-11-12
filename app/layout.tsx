import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Russelle & Rosie — Our Wedding Journey",
  description:
    "An invitation to celebrate the wedding of Russelle & Rosie on March 21, 2027.",
  metadataBase: new URL(process.env.APP_ORIGIN || "https://example.com"),
  openGraph: {
    title: "Russelle & Rosie — Our Wedding Journey",
    description: "March 21, 2027 · Quezon City, Philippines",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
