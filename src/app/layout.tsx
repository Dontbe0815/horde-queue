import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HORDE HOPEFUL - The Queue Waiting Game",
  description: "A satirical game for World of Warcraft players waiting to create Horde characters. Practice your /rude emotes, sharpen your axe, and collect Warchief wisdom while you wait!",
  keywords: ["World of Warcraft", "WoW", "Horde", "Queue", "Waiting Game", "Satire", "Thrall", "Orgrimmar"],
  authors: [{ name: "Horde Hopeful Team" }],
  icons: {
    icon: "/assets/images/horde-logo.png",
  },
  openGraph: {
    title: "HORDE HOPEFUL - The Queue Waiting Game",
    description: "A satirical game for WoW players waiting in the faction queue. For the Horde!",
    url: "https://horde-hopeful.game",
    siteName: "Horde Hopeful",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HORDE HOPEFUL - The Queue Waiting Game",
    description: "A satirical game for WoW players waiting in the faction queue. For the Horde!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
