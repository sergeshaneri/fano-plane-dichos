import { motion } from 'framer-motion';
import { FANO_LAYOUT, FANO_LINES, DICHOTOMIES } from '../data/socionics';
import { cn } from '../utils/cn';
import type { PaletteColors } from '../themes/palettes';

export function FanoPlane({
  selectedNodes,
  productNode,
  showLabels,
  onNodeClick,
  colors,
}: {
  selectedNodes: number[];
  productNode: number | null;
  showLabels: boolean;
  onNodeClick: (id: number) => void;
  colors: PaletteColors;
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
          const lineStroke = active ? colors.line : 'rgba(255,255,255,0.2)';

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
                stroke={lineStroke}
                style={{ transition: 'stroke 0.6s ease-out' }}
                animate={{ strokeWidth: active ? 1.5 : 0.5 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          }

          const pts = getLinePoints(line.nodes);
          const [start, , end] = pts;
          return (
            <motion.line
              key={line.id}
              x1={start[0]} y1={start[1]}
              x2={end[0]} y2={end[1]}
              stroke={lineStroke}
              style={{ transition: 'stroke 0.6s ease-out' }}
              animate={{ strokeWidth: active ? 1.5 : 0.5 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* Draw Nodes */}
        {DICHOTOMIES.map((d) => {
          const layout = FANO_LAYOUT[d.id as keyof typeof FANO_LAYOUT];
          const pos = layout.pos;
          const isSelectedPrimary = selectedNodes[0] === d.id;
          const isSelectedSecondary = selectedNodes[1] === d.id;
          const isProduct = productNode === d.id;
          
          let nodeFill: string = 'rgba(255,255,255,0.04)';
          let nodeStroke: string = 'rgba(255,255,255,0.5)';
          let nodeTextFill: string = 'rgba(255,255,255,0.8)';
          let circleScale = 1;

          if (isSelectedPrimary) {
            nodeFill = colors.d1.fill;
            nodeStroke = colors.d1.fill;
            nodeTextFill = colors.d1.text;
            circleScale = 1.25;
          } else if (isSelectedSecondary) {
            nodeFill = colors.d2.fill;
            nodeStroke = colors.d2.fill;
            nodeTextFill = colors.d2.text;
            circleScale = 1.25;
          } else if (isProduct) {
            nodeFill = colors.product.fill;
            nodeStroke = colors.product.fill;
            nodeTextFill = colors.product.text;
            circleScale = 1.25;
          } else if (selectedNodes.length > 0) {
            // Mute others — still visible, just dimmed
            nodeFill = 'rgba(255,255,255,0.03)';
            nodeStroke = 'rgba(255,255,255,0.25)';
            nodeTextFill = 'rgba(255,255,255,0.35)';
          }

          const ariaState = isSelectedPrimary
            ? 'выбрана первой'
            : isSelectedSecondary
              ? 'выбрана второй'
              : isProduct
                ? 'результат произведения'
                : 'не выбрана';
          const isPressed = isSelectedPrimary || isSelectedSecondary || isProduct;

          return (
            <motion.g
              key={d.id}
              transform={`translate(${pos[0]}, ${pos[1]})`}
              onClick={() => onNodeClick(d.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNodeClick(d.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Дихотомия ${d.longName}, ${ariaState}`}
              aria-pressed={isPressed}
              className="cursor-pointer group outline-none"
            >
              {/* Focus ring for keyboard users */}
              <circle
                r="4.5"
                fill="none"
                strokeDasharray="1 1"
                strokeWidth="0.4"
                className="stroke-cyan-400 opacity-0 group-focus-visible:opacity-100 transition-opacity pointer-events-none"
              />
              <motion.circle
                r="3"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth="0.5"
                whileHover={isPressed ? undefined : { scale: 1.2 }}
                animate={{ scale: circleScale }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              />
              {showLabels && (
                <text
                  y={layout.labelOffset.dy}
                  x={layout.labelOffset.dx}
                  textAnchor={layout.labelOffset.anchor}
                  alignmentBaseline="middle"
                  fill={nodeTextFill}
                  style={
                    isPressed
                      ? { paintOrder: 'stroke', stroke: '#0a0a0c', strokeWidth: 0.7 }
                      : undefined
                  }
                  className="font-sans text-[3.5px] uppercase tracking-wider font-bold pointer-events-none"
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
