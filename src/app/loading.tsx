export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__core" aria-hidden="true" />
      <p>Acquiring signal…</p>
    </div>
  );
}
