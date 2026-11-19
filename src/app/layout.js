

import "./globals.css";

export const metadata = {
  title: "JobPulse | Find Your Next Opportunity",
  description:
    "Discover fresher jobs with transparent listing information.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

