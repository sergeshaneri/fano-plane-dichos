import { FUNCTIONS, DICHOTOMIES } from '../data/socionics';
import type { PaletteColors } from '../themes/palettes';

const mix = (hex: string, pct: number) =>
  `color-mix(in srgb, ${hex} ${pct}%, transparent)`;

export function HadamardMatrix({
  selectedNodes = [],
  productNode = null,
  colors,
}: {
  selectedNodes?: number[];
  productNode?: number | null;
  colors: PaletteColors;
}) {
  const sortedFunctions = [...FUNCTIONS].sort((a, b) => a.order - b.order);
  const highlighted = new Set<number>([
    ...selectedNodes,
    ...(productNode !== null ? [productNode] : []),
  ]);

  return (
    <div className="w-full">
      <table className="w-full text-center border-collapse table-fixed">
        <colgroup>
          <col style={{ width: '38%' }} />
          <col style={{ width: '10%' }} />
          {DICHOTOMIES.map(d => (
            <col key={d.id} style={{ width: `${52 / DICHOTOMIES.length}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-white/15">
            <th className="p-2 text-[11px] uppercase font-semibold tracking-wider text-left text-white/55">Функция</th>
            <th className="p-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.brand }} title="Базовая (identity)">
              Сущ
            </th>
            {DICHOTOMIES.map(d => {
              const isHl = highlighted.has(d.id);
              return (
                <th
                  key={d.id}
                  title={d.longName}
                  style={isHl
                    ? { color: colors.brand, backgroundColor: mix(colors.brand, 15), borderBottom: `2px solid ${colors.brand}` }
                    : { color: colors.brand }}
                  className="p-2 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  {d.id}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-base font-mono tabular-nums font-semibold">
          {sortedFunctions.map((f, i) => (
            <tr key={f.id} className={`hover:bg-white/5 transition-colors border-b border-white/5 ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
              <td className="p-2 text-left font-sans font-semibold text-white/90 text-[11px] uppercase tracking-wide truncate" title={f.name}>
                {f.name}
              </td>
              <td className="p-2" style={{ color: colors.brand }}>+</td>
              {DICHOTOMIES.map(d => {
                const val = f.dichotomies[d.id];
                const isHl = highlighted.has(d.id);
                return (
                  <td
                    key={d.id}
                    style={{
                      ...(isHl ? { backgroundColor: mix(colors.brand, 6) } : {}),
                      color: val === 1 ? colors.brand : 'rgba(255,255,255,0.4)',
                    }}
                    className="p-2 transition-colors"
                  >
                    {val === 1 ? '+' : '−'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Legend mapping ids to full dichotomy names */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-[10px] text-white/45">
        {DICHOTOMIES.map(d => (
          <div key={d.id} className="flex items-baseline gap-1.5">
            <span className="font-mono w-3 text-right" style={{ color: mix(colors.brand, 70) }}>{d.id}</span>
            <span className="uppercase tracking-wide truncate" title={d.longName}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
