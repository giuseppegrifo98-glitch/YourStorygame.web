import type { Metadata } from "next";
import "./globals.css";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Your Story · Erinnerungen zum Mitspielen",
  description: "Ein interaktives Webprojekt über die Momente, die bleiben. Entdecke die spielbare Geschichte in fünf Kapiteln und das persönliche Geschichtenstudio.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
