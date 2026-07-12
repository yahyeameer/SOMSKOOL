import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/actions/auth";
import { getPageSettings } from "@/lib/actions/admin";
import { LanguageProvider } from "@/contexts/LanguageContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SomSkool — Barashada Online",
  description: "Learn without limits. The #1 premium e-learning platform in Somalia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const pageSettings = await getPageSettings();

  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <LanguageProvider>
          <Navbar user={user} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer settings={pageSettings} />
        </LanguageProvider>
      </body>
    </html>
  );
}


