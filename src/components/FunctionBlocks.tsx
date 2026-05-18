import { FunctionData, STANDARD_LAYOUT } from '../data/socionics';
import { cn } from '../utils/cn';
import type { PaletteColors } from '../themes/palettes';

type CellStyle = { backgroundColor?: string; color?: string; fontWeight?: number; boxShadow?: string };

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
  const getCellStyle = (f: FunctionData): CellStyle => {
    if (selectedNodes.length === 0 && dichotomyId === null) {
      return compact
        ? { backgroundColor: 'rgba(255,255,255,0.05)', color: '#e2e2e7' }
        : { backgroundColor: '#0a0a0c', color: 'rgba(255,255,255,0.5)' };
    }

    if (dichotomyId !== null) {
      const val = f.dichotomies[dichotomyId];
      return val === 1
        ? { backgroundColor: colors.cellPlus.bg, color: colors.cellPlus.text, fontWeight: 700 }
        : { backgroundColor: colors.cellMinus.bg, color: colors.cellMinus.text };
    }

    const v1 = selectedNodes[0] ? f.dichotomies[selectedNodes[0]] : null;
    const v2 = selectedNodes[1] ? f.dichotomies[selectedNodes[1]] : null;

    if (v1 && !v2) {
      return v1 === 1
        ? {
            backgroundColor: colors.cellPlus.bg,
            color: colors.cellPlus.text,
            fontWeight: 700,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
          }
        : { backgroundColor: colors.cellMinus.bg, color: colors.cellMinus.text };
    }

    if (v1 && v2) {
      if (v1 === 1 && v2 === 1) {
        return { backgroundColor: colors.intersection, color: colors.cellTextOnDark, fontWeight: 600 };
      }
      if (v1 === 1 && v2 === -1) {
        return { backgroundColor: colors.onlyD1, color: colors.cellPlus.text, fontWeight: 600 };
      }
      if (v1 === -1 && v2 === 1) {
        return { backgroundColor: colors.onlyD2, color: colors.cellTextOnDark, fontWeight: 600 };
      }
      return { backgroundColor: colors.neither, color: colors.cellTextOnDark, fontWeight: 600 };
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
