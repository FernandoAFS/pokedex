import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HeaderLayout } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pokedex",
  description: "Local iteration of pokedex based on NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderLayout>
          <Link href="/">
            <Image src="/logo.png" width={500} height={50} alt="pokedex logo" />
          </Link>
        </HeaderLayout>
        <div className="grid grid-cols-4 gap-4 grid-flow-row auto-rows-max py-4 container mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
