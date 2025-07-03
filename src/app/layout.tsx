import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { PageTextProvider } from "@/context/PagetextContent";
import SessionInit from "./sessionInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Class: Job seeker - RPG-style job application tracker",
  description: "Turn your job hunt into an RPG quest. Accept job quests, track applications, and level up your career without the copy-paste hell.",
  keywords: "job application tracker, job search, RPG job hunting, gamified job search, cover letter generator",
  openGraph: {
    title: "Class: Job seeker - Your job hunt RPG",
    description: "Accept job quests, track applications, generate tailored cover letters. Because job hunting shouldn't feel like grinding.",
    type: "website",
    url: "https://class-job-seeker.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Class: Job seeker - RPG job hunting",
    description: "Turn job applications into RPG quests. Less soul-crushing, more quest-completing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-zinc-900 dark:text-white`}
      >
        <Navbar />
        {/* <GooeyNav /> */}
        <SessionInit>
          <PageTextProvider>
            {children}
          </PageTextProvider>
        </SessionInit>
      </body>
    </html >
  );
}