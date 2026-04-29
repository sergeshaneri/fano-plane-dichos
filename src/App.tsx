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
      <div className="flex flex-col xl:flex-row gap-12 flex-1 mb-12">
      
      {/* Header and Left content */}
      <div className="flex-1 max-w-2xl flex flex-col">
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            Модель А <span className="font-serif italic font-normal text-cyan-500 opacity-80">× PG(2,2)</span>
          </h1>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase opacity-80 mb-2">
            Abelian Group G(Z₂³) • Hadamard Matrix Projection
          </p>
          <div className="flex gap-2 mt-4 mb-4">
            <button 
              onClick={() => setViewMode('model_a')}
              className={`text-[10px] uppercase font-mono tracking-widest px-4 py-2 border transition-colors ${viewMode === 'model_a' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 bg-white/5 cursor-pointer'}`}
            >
              Интерактивная Модель А
            </button>
            <button 
              onClick={() => setViewMode('hadamard')}
              className={`text-[10px] uppercase font-mono tracking-widest px-4 py-2 border transition-colors ${viewMode === 'hadamard' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 bg-white/5 cursor-pointer'}`}
            >
              Матрица Адамара
            </button>
          </div>
          <p className="text-white/60 leading-relaxed max-w-lg text-sm">
            Интерактивная визуализация 7 дихотомий и 8 функций соционики.
            Выберите узлы на графе, чтобы увидеть как они формируют группы.
          </p>
        </header>

        {/* Fano Plane Interactive Graph */}
        <div className="bg-white/5 data-border p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
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
                    className="text-cyan-400 text-xs font-bold uppercase tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] text-center"
                  >
                    {activeLine.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4 relative z-10 flex-wrap">
            <button 
              onClick={() => setShowLabels(!showLabels)}
              className="text-[10px] sm:text-xs uppercase font-mono tracking-widest px-4 py-2 border border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 transition-colors bg-white/5 hover:bg-cyan-400/10 cursor-pointer"
            >
              {showLabels ? 'Скрыть подписи' : 'Показать подписи'}
            </button>
            <button 
              onClick={() => setSelectedNodes([])}
              className="text-[10px] sm:text-xs uppercase font-mono tracking-widest px-4 py-2 border border-white/20 text-white/60 hover:text-cyan-400 hover:border-cyan-400 transition-colors bg-white/5 hover:bg-cyan-400/10 cursor-pointer"
            >
              Сбросить выделение
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Details and Matrices */}
      <div className="flex-1 max-w-xl flex flex-col gap-8">
        
        {viewMode === 'hadamard' ? (
          <div className="data-box p-8 relative overflow-hidden mt-8 xl:mt-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
              Матрица Адамара
            </div>
            <HadamardMatrix />
          </div>
        ) : (
          <>
            {/* Main interactive 8-block */}
            <div className="data-box p-8 relative overflow-hidden mt-8 xl:mt-0">
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2 relative z-10">
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
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
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
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] shrink-0" />
                        <span className="text-xs font-medium uppercase tracking-wider">{selectedD2.name}</span>
                      </div>
                      <div className="text-white/50 text-xs hidden sm:block">{selectedD2.longName}</div>
                    </motion.div>
                  )}
                  {selectedProduct && selectedNodes.length === 2 && (
                    <motion.div 
                      key={`prod-${selectedProduct.id}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-6 pt-4 border-t border-white/10"
                    >
                      <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-cyan-500 mb-3">Составная дихотомия (пересечение)</div>
                      <div className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                          <span className="text-xs font-medium uppercase tracking-wider ml-1">{selectedProduct.name}</span>
                        </div>
                        <div className="text-white/50 text-xs hidden sm:block">{selectedProduct.longName}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Small multiples gallery */}
            <div className="data-box p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-2">
                Все дихотомии
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                {DICHOTOMIES.map(d => {
                  const isHighlighted = selectedNodes.includes(d.id) || productNode === d.id;
                  return (
                    <div 
                      key={d.id} 
                      className={`flex flex-col items-center gap-4 cursor-pointer group p-4 border rounded-xl transition-all ${isHighlighted ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/20'}`}
                      onClick={() => handleNodeClick(d.id)}
                    >
                      <div className="transition-all group-hover:-translate-y-1 group-hover:drop-shadow-[0_4px_12px_rgba(34,211,238,0.2)]">
                        <FunctionMatrix 
                          dichotomyId={d.id} 
                          selectedNodes={[]} 
                          productNode={null} 
                          compact 
                        />
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider font-mono text-center
                        ${isHighlighted ? 'text-cyan-400 font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]' : 'text-white/40 group-hover:text-white/80'}
                      `}>
                        {d.longName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      </div>

      <footer className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 w-full max-w-7xl mx-auto">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Mode: Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold">Schema: Hadamard_Canonical</span>
          </div>
        </div>
        <div className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] text-center sm:text-right">
          Cognitive Architecture Visualization <span className="text-cyan-400 opacity-60">v2.4.0</span>
        </div>
      </footer>
    </div>
  );
}
