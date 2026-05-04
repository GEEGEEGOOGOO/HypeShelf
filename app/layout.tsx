import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClerkProvider } from "@/components/ConvexClerkProvider";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const sans = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HypeShelf - Collect and share the stuff you're hyped about",
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
          className={`${display.variable} ${sans.variable} min-h-screen bg-background text-foreground antialiased`}
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
