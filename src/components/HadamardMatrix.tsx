import { FUNCTIONS, DICHOTOMIES } from '../data/socionics';

export function HadamardMatrix({
  selectedNodes = [],
  productNode = null,
}: {
  selectedNodes?: number[];
  productNode?: number | null;
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
            <th className="p-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider" title="Базовая (identity)">
              Сущ
            </th>
            {DICHOTOMIES.map(d => {
              const isHl = highlighted.has(d.id);
              return (
                <th
                  key={d.id}
                  title={d.longName}
                  className={`p-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                    isHl
                      ? 'text-cyan-200 bg-cyan-400/15 border-b-2 border-cyan-400'
                      : 'text-cyan-400'
                  }`}
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
              <td className="p-2 text-cyan-300">+</td>
              {DICHOTOMIES.map(d => {
                const val = f.dichotomies[d.id];
                const isHl = highlighted.has(d.id);
                return (
                  <td
                    key={d.id}
                    className={`p-2 transition-colors ${isHl ? 'bg-cyan-400/[0.06]' : ''} ${
                      val === 1 ? 'text-cyan-300' : 'text-white/40'
                    }`}
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
            <span className="font-mono text-cyan-400/70 w-3 text-right">{d.id}</span>
            <span className="uppercase tracking-wide truncate" title={d.longName}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
