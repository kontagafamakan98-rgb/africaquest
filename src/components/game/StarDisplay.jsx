import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "../i18n";

export default function StarDisplay({ count, max = 3, size = "md" }) {
  const t = useT();
  const sizeClass = size === "lg" ? "w-8 h-8" : size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} ${t.of} ${max} ${t.stars}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            sizeClass, "transition-all duration-300",
            i < count
              ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
              : "fill-transparent text-slate-500"
          )}
        />
      ))}
    </div>
  );
}
