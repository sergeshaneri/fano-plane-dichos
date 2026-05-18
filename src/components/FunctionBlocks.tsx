import { FunctionData, STANDARD_LAYOUT } from '../data/socionics';
import { cn } from '../utils/cn';

export function FunctionMatrix({
  dichotomyId,
  selectedNodes,
  productNode,
  compact = false
}: {
  dichotomyId: number | null;
  selectedNodes: number[];
  productNode: number | null;
  compact?: boolean;
}) {
  const getCellColor = (f: FunctionData) => {
    if (selectedNodes.length === 0 && dichotomyId === null) {
      return compact ? "bg-white/5 text-[#e2e2e7]" : "bg-[#0a0a0c] text-white/50";
    }

    if (dichotomyId !== null) {
      // Just illustrating a single dichotomy block
      const val = f.dichotomies[dichotomyId];
      return val === 1
        ? "bg-cyan-400 text-zinc-950 font-bold"
        : "bg-white/[0.03] text-white/30";
    }

    // Logic for main highlighted view based on selections
    const v1 = selectedNodes[0] ? f.dichotomies[selectedNodes[0]] : null;
    const v2 = selectedNodes[1] ? f.dichotomies[selectedNodes[1]] : null;

    if (v1 && !v2) {
      return v1 === 1
        ? "bg-cyan-400 text-zinc-950 font-bold shadow-[inset_0_0_0_1px_rgba(34,211,238,0.6)]"
        : "bg-white/[0.025] text-white/25";
    }

    if (v1 && v2) {
      if (v1 === 1 && v2 === 1) return "bg-blue-500 text-white"; // intersection
      if (v1 === 1 && v2 === -1) return "bg-red-500 text-white"; // only D1
      if (v1 === -1 && v2 === 1) return "bg-yellow-400 text-zinc-900"; // only D2
      return "bg-green-500 text-white"; // neither
    }

    return "bg-[#0a0a0c] text-white";
  };

  return (
    <div className={cn("grid grid-cols-2 gap-[1px] bg-white/10 border border-white/10 p-[1px]", compact ? "w-12 text-[8px] rounded-sm overflow-hidden" : "w-[340px] text-xs data-box")}>
      {STANDARD_LAYOUT.flat().map((f) => (
        <div
          key={f.id}
          className={cn(
            "flex items-center justify-center font-sans font-medium transition-colors duration-300",
            compact ? "h-6" : "h-16 px-2 text-center",
            getCellColor(f)
          )}
        >
          {compact ? f.id : f.name}
        </div>
      ))}
    </div>
  );
}
