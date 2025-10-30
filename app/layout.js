import "./globals.css";

export const metadata = {
  title: "Share My Recipes",
  description: "Upload cooking video, get a shareable recipe fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
