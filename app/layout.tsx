import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClerkProvider } from "@/components/ConvexClerkProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HypeShelf — Collect and share the stuff you're hyped about",
  description:
    "HypeShelf is a shared recommendations hub where friends log in and post their favourite movies and shows. Discover what your crew is hyped about.",
  openGraph: {
    title: "HypeShelf",
    description: "Collect and share the stuff you're hyped about.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <ConvexClerkProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              theme="dark"
              closeButton
            />
          </ConvexClerkProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
