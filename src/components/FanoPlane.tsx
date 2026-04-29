import { motion } from 'framer-motion';
import { FANO_LAYOUT, FANO_LINES, DICHOTOMIES } from '../data/socionics';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function FanoPlane({
  selectedNodes,
  productNode,
  showLabels,
  onNodeClick
}: {
  selectedNodes: number[];
  productNode: number | null;
  showLabels: boolean;
  onNodeClick: (id: number) => void;
}) {
  const isLineActive = (line: typeof FANO_LINES[0]) => {
    // A line is active if all its nodes are highlighted
    // which happens when 2 are selected and the 3rd is the product
    if (selectedNodes.length === 2 && productNode !== null) {
      const activeSet = new Set([...selectedNodes, productNode]);
      return line.nodes.every(n => activeSet.has(n));
    }
    return false;
  };

  const getLinePoints = (nodes: number[]) => {
    return nodes.map(n => FANO_LAYOUT[n as keyof typeof FANO_LAYOUT].pos);
  };

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto selection:bg-transparent">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Draw the geometric Fano Plane lines */}
        {FANO_LINES.map((line) => {
          const active = isLineActive(line);
          const strokeClass = active ? "stroke-cyan-400" : "stroke-white/20";
          const strokeWidth = active ? 1.5 : 0.5;

          if (line.isCircle) {
            // Draw perfectly calculated inscribed circle passing through nodes 7, 2, 5
            const cx = 50;
            const cy = 54;
            const r = 20;

            return (
              <motion.circle
                key={line.id}
                cx={cx} cy={cy} r={r}
                fill="none"
                className={cn("transition-colors duration-300", strokeClass)}
                strokeWidth={strokeWidth}
              />
            );
          }

          const pts = getLinePoints(line.nodes);
          // Standard lines form triangles and altitudes
          // If it's the bottom edge (6,5,3) it's straight
          // For edges, we just connect start to end, since midpoint is collinear
          const start = pts[0];
          const end = pts[2]; // assuming order is end-to-end
          // Special case: altitude passing through center
          
          return (
            <motion.line
              key={line.id}
              x1={pts[0][0]} y1={pts[0][1]}
              x2={pts[2][0]} y2={pts[2][1]}
              className={cn("transition-colors duration-300", strokeClass)}
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Draw Nodes */}
        {DICHOTOMIES.map((d) => {
          const pos = FANO_LAYOUT[d.id as keyof typeof FANO_LAYOUT].pos;
          const isSelectedPrimary = selectedNodes[0] === d.id;
          const isSelectedSecondary = selectedNodes[1] === d.id;
          const isProduct = productNode === d.id;
          
          let fillClass = "fill-[#0a0a0c]";
          let strokeClass = "stroke-white/40";
          let textClass = "fill-white/80";
          let circleScale = 1;

          if (isSelectedPrimary) {
            fillClass = "fill-blue-500";
            strokeClass = "stroke-blue-500";
            textClass = "fill-white drop-shadow-[0_0_4px_rgba(59,130,246,1)]";
            circleScale = 1.15;
          } else if (isSelectedSecondary) {
            fillClass = "fill-yellow-400";
            strokeClass = "stroke-yellow-400";
            textClass = "fill-white drop-shadow-[0_0_4px_rgba(250,204,21,1)]";
            circleScale = 1.15;
          } else if (isProduct) {
            fillClass = "fill-green-500";
            strokeClass = "stroke-green-500";
            textClass = "fill-white drop-shadow-[0_0_4px_rgba(34,197,94,1)]";
            circleScale = 1.15;
          } else if (selectedNodes.length > 0) {
            // Mute others
            fillClass = "fill-[#0a0a0c]";
            strokeClass = "stroke-white/20";
            textClass = "fill-white/30";
          }

          return (
            <motion.g
              key={d.id}
              transform={`translate(${pos[0]}, ${pos[1]})`}
              onClick={() => onNodeClick(d.id)}
              className="cursor-pointer group"
            >
              <motion.circle
                r="3"
                className={cn("transition-all duration-300", fillClass, strokeClass)}
                strokeWidth="0.5"
                whileHover={{ scale: 1.25 }}
                animate={{ scale: circleScale }}
              />
              {showLabels && (
                <text
                  y={(FANO_LAYOUT as any)[d.id].labelOffset.dy}
                  x={(FANO_LAYOUT as any)[d.id].labelOffset.dx}
                  textAnchor={(FANO_LAYOUT as any)[d.id].labelOffset.anchor}
                  alignmentBaseline="middle"
                  className={cn("font-sans text-[3.5px] uppercase tracking-wider font-bold transition-colors pointer-events-none drop-shadow-sm", textClass)}
                >
                  {d.name}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
