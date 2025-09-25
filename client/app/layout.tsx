import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

// Load Press Start 2P font
const pressStart = Press_Start_2P({
  weight: "400", // only available weight
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "ECO Play",
  description: "Gamified environmental education platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
