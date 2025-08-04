import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/firebase"; // Import Firebase configuration
import { ToastProvider } from "@/context/ToastContext";
import { AuthUserProvider } from "@/context/AuthContext";
import { GroupProvider } from "@/context/GroupContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense & Household Tracker",
  description: "Easily track expenses, daily notes, and household activities like cylinder refills, maid payments, and more.",
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
              {children}
            </GroupProvider>
          </AuthUserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
