import type { Metadata, Viewport } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";


const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "On-Shop",
  description: "On-Shop is a platform for buying and selling products online",
};

export default function RootLayout({children} : {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${questrial.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
