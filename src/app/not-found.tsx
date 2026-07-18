"use client";

import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr" data-theme="dark">
      <body>
        <main className="route-message">
          <p>404 · No signal here</p>
          <h1>This coordinate is outside the known system.</h1>
          <Link href="/">Return to the portfolio</Link>
        </main>
      </body>
    </html>
  );
}
