import { cn } from "@/lib/utils";
import { MODEL_LABEL } from "@/lib/format";

/** Small identity chip for a model. Colour = entity, never rank. */
export function ModelChip({
  model,
  className,
  showDot = true,
}: {
  model: "basic" | "advanced";
  className?: string;
  showDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        model === "basic"
          ? "border-basic/40 text-basic"
          : "border-advanced/40 text-advanced",
        className,
      )}
    >
      {showDot && (
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            model === "basic" ? "bg-basic" : "bg-advanced",
          )}
        />
      )}
      {MODEL_LABEL[model]}
    </span>
  );
}
