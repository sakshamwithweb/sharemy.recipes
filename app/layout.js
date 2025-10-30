import { Advent_Pro } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const adventPro = Advent_Pro({
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "Share My Recipes",
  description: "Upload cooking video, get a shareable recipe fast",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${adventPro.className}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
