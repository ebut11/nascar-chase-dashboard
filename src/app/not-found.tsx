import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="checkers h-10 w-10 rounded-sm" aria-hidden />
      <h1 className="text-2xl font-bold">Off the track</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        That page isn&apos;t part of the Chase. Head back to the standings.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-lg bg-speed px-4 text-sm font-medium text-black"
      >
        Back to standings
      </Link>
    </div>
  );
}
