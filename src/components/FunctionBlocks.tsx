import { FunctionData, STANDARD_LAYOUT } from '../data/socionics';
import { cn } from '../utils/cn';
import type { PaletteColors } from '../themes/palettes';

type CellStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  color?: string;
  fontWeight?: number;
  boxShadow?: string;
};

export function FunctionMatrix({
  dichotomyId,
  selectedNodes,
  productNode,
  colors,
  compact = false,
}: {
  dichotomyId: number | null;
  selectedNodes: number[];
  productNode: number | null;
  colors: PaletteColors;
  compact?: boolean;
}) {
  // Premium accent style: solid bg + diagonal sheen + top inner highlight = "lit surface"
  const lit = (bg: string, color: string, fontWeight = 600): CellStyle => ({
    backgroundColor: bg,
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 48%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.22)',
    color,
    fontWeight,
  });

  const muted: CellStyle = {
    backgroundColor: 'rgba(255,255,255,0.02)',
    color: 'rgba(255,255,255,0.28)',
  };

  const getCellStyle = (f: FunctionData): CellStyle => {
    if (selectedNodes.length === 0 && dichotomyId === null) {
      return compact
        ? { backgroundColor: 'rgba(255,255,255,0.05)', color: '#e2e2e7' }
        : { backgroundColor: '#0a0a0c', color: 'rgba(255,255,255,0.5)' };
    }

    if (dichotomyId !== null) {
      const val = f.dichotomies[dichotomyId];
      return val === 1
        ? lit(colors.cellPlus.bg, colors.cellPlus.text, 700)
        : muted;
    }

    const v1 = selectedNodes[0] ? f.dichotomies[selectedNodes[0]] : null;
    const v2 = selectedNodes[1] ? f.dichotomies[selectedNodes[1]] : null;

    if (v1 && !v2) {
      return v1 === 1 ? lit(colors.cellPlus.bg, colors.cellPlus.text, 700) : muted;
    }

    if (v1 && v2) {
      if (v1 === 1 && v2 === 1) return lit(colors.intersection, colors.cellTextOnDark);
      if (v1 === 1 && v2 === -1) return lit(colors.onlyD1, colors.cellPlus.text);
      if (v1 === -1 && v2 === 1) return lit(colors.onlyD2, colors.cellTextOnDark);
      return lit(colors.neither, colors.cellTextOnDark);
    }

    return { backgroundColor: '#0a0a0c', color: '#fff' };
  };

  return (
    <div className={cn(
      "grid grid-cols-2 gap-[1px] bg-white/10 border border-white/10 p-[1px]",
      compact ? "w-12 text-[8px] rounded-sm overflow-hidden" : "w-[340px] text-xs data-box"
    )}>
      {STANDARD_LAYOUT.flat().map((f) => (
        <div
          key={f.id}
          style={{ ...getCellStyle(f), transition: 'background-color 0.3s, color 0.3s' }}
          className={cn(
            "flex items-center justify-center font-sans font-medium",
            compact ? "h-6" : "h-16 px-2 text-center"
          )}
        >
          {compact ? f.id : f.name}
        </div>
      ))}
    </div>
  );
}
