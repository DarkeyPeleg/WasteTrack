import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WasteTrack Ghana",
  description: "Request and track household waste collection online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <AppHeader />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
