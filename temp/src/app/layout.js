import "./globals.css";

export const metadata = {
  title: "IEEEsoc'26 — Open-Source Fellowship Platform",
  description: "Official forum, project marketplace, and leaderboards for the 12-week IEEE student branch Open-Source Fellowship. Built on classical craftsmanship principles.",
  keywords: "IEEE, open source, fellowship, software engineering, Greek philosophy, GEHU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

