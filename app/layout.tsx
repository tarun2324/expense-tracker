import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/firebase"; // Import Firebase configuration
import { ToastProvider } from "@/context/ToastContext";
import { AuthUserProvider } from "@/context/AuthContext";
import { GroupProvider } from "@/context/GroupContext";
import Settings from "@/components/Settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_DOMAIN_NAME || "https://expense-tracker-5cb10.web.app/"),
  title: "Expense & Household Tracker",
  description: "Easily track expenses, daily notes, and household activities like cylinder refills, maid payments, and more.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/favicon.ico"]
  },
  manifest: "/site.webmanifest",
  applicationName: "Expense & Household Tracker",
  generator: "Next.js",
  keywords: [
    "expense tracker",
    "household tracker",
    "budget",
    "notes",
    "cylinder refill",
    "maid payment",
    "finance",
    "personal finance",
    "family management"
  ],
  authors: [{ name: "Tarun Jain" }],
  creator: "Tarun Jain",
  publisher: "Tarun Jain",
  category: "productivity",
  openGraph: {
    title: "Expense & Household Tracker",
    description:
      "Easily track expenses, daily notes, and household activities like cylinder refills, maid payments, and more.",
    url: process.env.NEXT_PUBLIC_BASE_DOMAIN_NAME || "https://expense-tracker-5cb10.web.app/",
    siteName: "Expense & Household Tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Expense & Household Tracker"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense & Household Tracker",
    description:
      "Easily track expenses, daily notes, and household activities like cylinder refills, maid payments, and more.",
    images: ["/og-image.png"]
  }
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
        <ToastProvider>
          <AuthUserProvider>
            <GroupProvider>
              <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 ">
                <Settings />
                {children}
              </div>
            </GroupProvider>
          </AuthUserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
