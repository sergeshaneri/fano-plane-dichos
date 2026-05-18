import { useState } from 'react';
import { FanoPlane } from './components/FanoPlane';
import { FunctionMatrix } from './components/FunctionBlocks';
import { HadamardMatrix } from './components/HadamardMatrix';
import { DICHOTOMIES, FANO_LINES } from './data/socionics';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'model_a' | 'hadamard';

export default function App() {
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('model_a');

  // The product in an elementary abelian group of order 8 
  // mapping to numbers 1-7 is their bitwise XOR
  const productNode = selectedNodes.length === 2 ? (selectedNodes[0] ^ selectedNodes[1]) : null;

  const handleNodeClick = (id: number) => {
    setSelectedNodes(prev => {
      if (prev.includes(id)) return prev.filter(n => n !== id);
      if (prev.length === 2) {
        if (id === productNode) return [];
        return [id];
      }
      return [...prev, id];
    });
  };

  const selectedD1 = DICHOTOMIES.find(d => d.id === selectedNodes[0]);
  const selectedD2 = DICHOTOMIES.find(d => d.id === selectedNodes[1]);
  const selectedProduct = productNode ? DICHOTOMIES.find(d => d.id === productNode) : null;
  const activeLine = selectedNodes.length === 2 && productNode !== null
    ? FANO_LINES.find(line => line.nodes.includes(selectedNodes[0]) && line.nodes.includes(selectedNodes[1]))
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e7] p-8 md:p-12 lg:p-16 flex flex-col font-sans overflow-x-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-12 flex-1 mb-12 max-w-7xl mx-auto w-full">

      {/* Header and Left content */}
      <div className="flex flex-col min-w-0">
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col gap-2">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] uppercase mb-2">
            Модель А <span className="font-serif italic font-normal text-cyan-500 opacity-80">× PG(2,2)</span>
          </h1>
          <p className="text-xs font-sans text-cyan-400 tracking-widest uppercase opacity-80 mb-2">
            Abelian Group G(Z₂³) • Hadamard Matrix Projection
          </p>
          <div className="flex gap-1 mt-4 mb-4 p-1 border border-white/10 bg-white/[0.02] rounded-sm w-fit" role="tablist" aria-label="Выбор представления">
            {([
              { id: 'model_a' as const, label: 'Интерактивная Модель А' },
              { id: 'hadamard' as const, label: 'Матрица Адамара' },
            ]).map(tab => {
              const active = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-pressed={active}
                  aria-selected={active}
                  onClick={() => setViewMode(tab.id)}
                  className={`relative text-[10px] uppercase font-sans tracking-widest px-4 py-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${active ? 'text-cyan-300' : 'text-white/55 hover:text-white/90'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-view-pill"
                      className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/60 rounded-[2px]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-white/60 leading-relaxed max-w-lg text-sm">
            Интерактивная визуализация 7 дихотомий и 8 функций соционики.
            Выберите узлы на графе, чтобы увидеть как они формируют группы.
          </p>
        </header>

        {/* Fano Plane Interactive Graph */}
        <div className="bg-white/5 data-border p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>
          <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
            Плоскость Фано (PG(2,2))
          </div>
          <div className="relative z-10">
            <FanoPlane 
              selectedNodes={selectedNodes} 
              productNode={productNode}
              showLabels={showLabels}
              onNodeClick={handleNodeClick}
            />
            
            <div className="h-6 mt-6 pb-2 mb-2 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {activeLine && selectedNodes.length === 2 && (
                  <motion.div
                    key={`line-${activeLine.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-cyan-400 text-xs font-bold uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(34,211,238,0.35)] text-center"
                  >
                    {activeLine.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4 relative z-10 flex-wrap">
            <button
              type="button"
              aria-pressed={showLabels}
              onClick={() => setShowLabels(!showLabels)}
              className="text-[10px] sm:text-xs uppercase font-sans tracking-widest px-4 py-2 border border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 transition-colors bg-white/5 hover:bg-cyan-400/10 cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              {showLabels ? 'Скрыть подписи' : 'Показать подписи'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedNodes([])}
              disabled={selectedNodes.length === 0}
              className="text-[10px] sm:text-xs uppercase font-sans tracking-widest px-4 py-2 border border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 transition-colors bg-white/5 hover:bg-cyan-400/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-white/60 disabled:hover:border-white/20 disabled:hover:bg-white/5 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Сбросить выделение
            </button>
          </div>
        </div>

        {/* Lines navigation — 7 lines as an explorable list */}
        <div className="pt-2">
          <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-4 flex items-baseline gap-2">
            <span>Прямые плоскости</span>
            <span className="text-white/25 font-mono">7</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {FANO_LINES.map(line => {
              const isActive = activeLine?.id === line.id;
              return (
                <button
                  key={line.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedNodes([line.nodes[0], line.nodes[1]])}
                  className={`text-left px-3 py-2 text-[11px] uppercase tracking-wider transition-colors rounded-sm cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-400/10'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <span className="font-mono text-white/30 mr-2 text-[10px]">
                    {line.nodes.join('·')}
                  </span>
                  {line.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Details and Matrices */}
      <div className="flex flex-col gap-8 min-w-0">
        
        {viewMode === 'hadamard' ? (
          <div className="data-box p-8 relative overflow-hidden mt-8 xl:mt-0">
            <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
              Матрица Адамара
            </div>
            <HadamardMatrix selectedNodes={selectedNodes} productNode={productNode} />
          </div>
        ) : (
          <>
            {/* Main interactive 8-block */}
            <div className="data-box p-8 relative overflow-hidden mt-8 xl:mt-0">
              <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
                Взаимодействие дихотомий
              </div>
              
              <div className="flex flex-col items-center mb-8 relative z-10 overflow-x-auto pb-4">
                <FunctionMatrix 
                  dichotomyId={null} 
                  selectedNodes={selectedNodes} 
                  productNode={productNode}
                />
              </div>

              <div className="space-y-4 relative z-10">
                {selectedNodes.length === 0 && (
                  <div className="text-center text-white/40 italic font-serif text-sm">
                    Выделите дихотомию на графе или в списке ниже.
                  </div>
                )}
                
                <AnimatePresence mode="popLayout">
                  {selectedD1 && (
                    <motion.div 
                      key={`d1-${selectedD1.id}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-xs font-medium uppercase tracking-wider">{selectedD1.name}</span>
                      </div>
                      <div className="text-white/50 text-xs hidden sm:block">{selectedD1.longName}</div>
                    </motion.div>
                  )}
                  {selectedD2 && (
                    <motion.div 
                      key={`d2-${selectedD2.id}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />
                        <span className="text-xs font-medium uppercase tracking-wider">{selectedD2.name}</span>
                      </div>
                      <div className="text-white/50 text-xs hidden sm:block">{selectedD2.longName}</div>
                    </motion.div>
                  )}
                  {selectedProduct && selectedD1 && selectedD2 && selectedNodes.length === 2 && (
                    <motion.div
                      key={`prod-${selectedProduct.id}`}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      className="mt-6 pt-5 border-t border-cyan-400/20"
                    >
                      <div className="text-[9px] uppercase font-bold tracking-[0.25em] text-cyan-500 mb-4 text-center">
                        Произведение
                      </div>
                      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 flex-wrap">
                        <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">{selectedD1.name}</span>
                        <span className="text-cyan-400/50 text-lg font-serif italic">×</span>
                        <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">{selectedD2.name}</span>
                        <span className="text-cyan-400/50 text-lg font-serif italic">=</span>
                        <span className="text-green-400 text-base font-bold uppercase tracking-wider">{selectedProduct.name}</span>
                      </div>
                      <div className="text-center text-white/55 text-xs italic font-serif">
                        {selectedProduct.longName}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Small multiples gallery — flat divider section, no card */}
            <div className="pt-2">
              <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-6">
                Все дихотомии
              </div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6"
                role="list"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {DICHOTOMIES.map(d => {
                  const isHighlighted = selectedNodes.includes(d.id) || productNode === d.id;
                  return (
                    <motion.button
                      key={d.id}
                      type="button"
                      role="listitem"
                      aria-pressed={isHighlighted}
                      aria-label={`Дихотомия ${d.longName}, ${isHighlighted ? 'выбрана' : 'не выбрана'}`}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { type: 'spring', stiffness: 220, damping: 24 },
                        },
                      }}
                      className={`flex flex-col items-center gap-4 cursor-pointer group p-3 rounded-lg transition-colors text-left focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${isHighlighted ? 'bg-cyan-500/[0.06]' : 'hover:bg-white/[0.03]'}`}
                      onClick={() => handleNodeClick(d.id)}
                    >
                      <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
                        <FunctionMatrix
                          dichotomyId={d.id}
                          selectedNodes={[]}
                          productNode={null}
                          compact
                        />
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider font-sans text-center transition-colors
                        ${isHighlighted ? 'text-cyan-400 font-bold' : 'text-white/40 group-hover:text-white/80'}
                      `}>
                        {d.longName}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </>
        )}
      </div>
      </div>

      <footer className="mt-auto flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 border-t border-white/10 w-full max-w-7xl mx-auto">
        <div className="flex gap-4 text-[10px] font-sans uppercase tracking-widest">
          <a 
            href="https://t.me/sergeyshaneri" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
          >
            <span>связаться с автором</span>
          </a>
          <a 
            href="https://sergeshaneri.github.io/socionics-wiki/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
          >
            <span>соционика вики</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
