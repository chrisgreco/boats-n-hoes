import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boats N' Hoes | A Prestige Worldwide Production",
  description: "The first word in Entertainment, Boat Rentals, Dating, and Maritime Excellence. A Prestige Worldwide Joint. Presented by Huff 'N Doback.",
  keywords: ["boats", "yacht rental", "boat party", "dating", "prestige worldwide", "boat rental marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
