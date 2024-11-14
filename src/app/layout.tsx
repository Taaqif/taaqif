import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import FluidContainer from "@/components/FluidContainer";
import StickyCursor from "@/components/StickyCursor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tye Peck | Software Engineer",
  description: "Tye Peck | Senior Team Lead • Software Engineer",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcf6" },
    { media: "(prefers-color-scheme: dark)", color: "#11171c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pointer-events-none z-10 relative min-h-svh p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col">
          {children}
        </div>
        {/* <Loader /> */}
        <FluidContainer />
        <StickyCursor />
      </body>
    </html>
  );
}
