"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-message">
      <p>Signal interrupted</p>
      <h1>Something unexpected crossed the wire.</h1>
      <p>The rest of the site is safe. Try reconnecting this view.</p>
      <button type="button" onClick={reset}>
        Reconnect
      </button>
    </main>
  );
}
