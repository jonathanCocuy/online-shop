import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";


const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "On-Shop",
  description: "On-Shop is a platform for buying and selling products online",
};

export default function RootLayout({children} : {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${questrial.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
