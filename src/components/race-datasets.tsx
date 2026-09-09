import datasets from "@/lib/race-datasets.json";

interface DataSet {
  title: string;
  file: string;
  headers: string[];
  rows: string[][];
}
interface RaceData {
  label: string;
  sets: DataSet[];
}

const ALL = datasets as Record<string, RaceData>;

function isNumeric(v: string) {
  return v !== "" && !Number.isNaN(Number(v));
}

function Table({ set, open }: { set: DataSet; open: boolean }) {
  return (
    <details open={open} className="rounded-lg border border-border/70 bg-card">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium marker:content-none">
        <span className="mr-2 text-muted-foreground">▸</span>
        {set.title}
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {set.file} · {set.rows.length} rows
        </span>
      </summary>
      <div className="max-h-[28rem] overflow-auto border-t border-border/70">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur">
            <tr>
              {set.headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-2.5 py-1.5 text-left font-medium text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {set.rows.map((r, i) => (
              <tr key={i} className="border-t border-border/50">
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className={
                      "whitespace-nowrap px-2.5 py-1 " +
                      (j === 0
                        ? "font-medium"
                        : isNumeric(cell)
                          ? "tabular text-right text-muted-foreground"
                          : "text-muted-foreground")
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function RaceDatasets({ round }: { round: number }) {
  const data = ALL[String(round)];
  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">
        Raw datasets will appear here once this race&apos;s models are built.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        The exact CSVs behind both models for {data.label}: each driver&apos;s
        track history since 2022 and their current-season form at comparable
        tracks. The models blend the two (see the header for the ratio) and train
        on the full season-form field.
      </p>
      {data.sets.map((s, i) => (
        <Table key={s.file} set={s} open={i === 0} />
      ))}
    </div>
  );
}
