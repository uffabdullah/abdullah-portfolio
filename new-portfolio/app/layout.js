import "./globals.css";

export const metadata = {
  title: "Abdullah Asger Ali — iOS & AI Developer",
  description:
    "Abdullah Asger Ali is a student developer building thoughtful iOS experiences and AI-powered systems.",
  openGraph: {
    title: "Abdullah Asger Ali — iOS & AI Developer",
    description:
      "Thoughtful iOS experiences, AI systems, and practical software products.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
