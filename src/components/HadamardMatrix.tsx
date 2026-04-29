import { FUNCTIONS, DICHOTOMIES } from '../data/socionics';

export function HadamardMatrix() {
  const sortedFunctions = [...FUNCTIONS].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl overflow-x-auto relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
      <table className="w-full text-center border-collapse relative z-10 min-w-[500px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-2 text-[10px] uppercase font-light text-left opacity-40">Функция</th>
            <th className="p-2 text-[9px] font-bold text-cyan-400">Сущ</th>
            {DICHOTOMIES.map(d => (
              <th key={d.id} className="p-2 text-[9px] font-bold text-cyan-400">
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs font-sans">
          {sortedFunctions.map((f, i) => (
            <tr key={f.id} className={`hover:bg-white/5 transition-colors border-b border-white/5 ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
              <td className="p-3 text-left font-serif italic text-white/80">{f.name}</td>
              <td className="p-3 text-cyan-400">+</td>
              {DICHOTOMIES.map(d => {
                const val = f.dichotomies[d.id];
                return (
                  <td key={d.id} className={`p-3 ${val === 1 ? 'text-cyan-400' : 'text-red-400 opacity-80'}`}>
                    {val === 1 ? '+' : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
