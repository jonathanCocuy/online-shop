import type { Metadata } from "next";
import { Geist, Geist_Mono, Questrial } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "On-Shop",
  description: "On-Shop is a platform for buying and selling products online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${questrial.variable} antialiased`}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-7xl mt-4">
            <Navbar />
          </div>
          {children}
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
