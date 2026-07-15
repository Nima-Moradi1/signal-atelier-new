import Link from "next/link";

export default function NotFound() {
  return (
    <main className="route-message">
      <p>404 · No signal here</p>
      <h1>This coordinate is outside the known system.</h1>
      <Link href="/">Return to the portfolio</Link>
    </main>
  );
}
