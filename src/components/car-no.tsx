/**
 * Car-number badge — temporarily hidden by request. The call sites still pass
 * `n` / `driver`, and src/lib/manufacturers.ts still holds the alignment, so
 * re-enabling is just restoring this component's body.
 */
export function CarNo(_props: {
  n: number | null | undefined;
  driver?: string | null;
  className?: string;
}) {
  return null;
}
