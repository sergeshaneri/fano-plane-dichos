import { motion } from 'framer-motion';
import { FANO_LAYOUT, FANO_LINES, DICHOTOMIES } from '../data/socionics';
import { cn } from '../utils/cn';
import type { PaletteColors } from '../themes/palettes';

const lightMix = (hex: string, pct: number) =>
  `color-mix(in srgb, ${hex} ${100 - pct}%, white)`;

type NodeRole = 'd1' | 'd2' | 'product' | null;

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
    if (selectedNodes.length === 2 && productNode !== null) {
      const activeSet = new Set([...selectedNodes, productNode]);
      return line.nodes.every(n => activeSet.has(n));
    }
    return false;
  };

  const getLinePoints = (nodes: number[]) => {
    return nodes.map(n => FANO_LAYOUT[n as keyof typeof FANO_LAYOUT].pos);
  };

  // Role helpers for premium per-node treatment
  const roleOf = (id: number): NodeRole => {
    if (selectedNodes[0] === id) return 'd1';
    if (selectedNodes[1] === id) return 'd2';
    if (productNode === id) return 'product';
    return null;
  };

  const roleColor = (role: NodeRole) => {
    if (role === 'd1') return colors.d1;
    if (role === 'd2') return colors.d2;
    if (role === 'product') return colors.product;
    return null;
  };

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto selection:bg-transparent">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          {/* Per-role radial gradient fills — gives nodes volumetric "lit sphere" feel */}
          {(['d1', 'd2', 'product'] as const).map(role => {
            const c = roleColor(role)!;
            return (
              <radialGradient key={`grad-${role}`} id={`grad-${role}`} cx="32%" cy="28%" r="78%">
                <stop offset="0%" stopColor={lightMix(c.fill, 55)} />
                <stop offset="55%" stopColor={c.fill} />
                <stop offset="100%" stopColor={lightMix(c.fill, -25)} />
              </radialGradient>
            );
          })}

          {/* Per-role soft outer glow — radial fade-out for ambient halo */}
          {(['d1', 'd2', 'product'] as const).map(role => {
            const c = roleColor(role)!;
            return (
              <radialGradient key={`glow-${role}`} id={`glow-${role}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={c.fill} stopOpacity="0.55" />
                <stop offset="40%" stopColor={c.fill} stopOpacity="0.22" />
                <stop offset="75%" stopColor={c.fill} stopOpacity="0.06" />
                <stop offset="100%" stopColor={c.fill} stopOpacity="0" />
              </radialGradient>
            );
          })}

          {/* Subtle Gaussian-blur filter for selected node edges — soft falloff */}
          <filter id="node-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>

          {/* Gradient stroke along active line — gives sense of "current" flowing through */}
          <linearGradient id="line-active-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.line} stopOpacity="0.35" />
            <stop offset="50%" stopColor={colors.line} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.line} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Draw the geometric Fano Plane lines */}
        {FANO_LINES.map((line) => {
          const active = isLineActive(line);
          const lineStroke = active ? 'url(#line-active-grad)' : 'rgba(255,255,255,0.18)';

          if (line.isCircle) {
            const cx = 50;
            const cy = 54;
            const r = 20;

            return (
              <motion.circle
                key={line.id}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={active ? colors.line : 'rgba(255,255,255,0.18)'}
                style={{ transition: 'stroke 0.6s ease-out, opacity 0.6s ease-out', opacity: active ? 1 : 0.85 }}
                animate={{ strokeWidth: active ? 1.4 : 0.45 }}
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
              style={{ transition: 'stroke 0.6s ease-out, opacity 0.6s ease-out', opacity: active ? 1 : 0.85 }}
              animate={{ strokeWidth: active ? 1.4 : 0.45 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* Draw Nodes */}
        {DICHOTOMIES.map((d) => {
          const layout = FANO_LAYOUT[d.id as keyof typeof FANO_LAYOUT];
          const pos = layout.pos;
          const role = roleOf(d.id);
          const isPressed = role !== null;
          const someoneSelected = selectedNodes.length > 0;

          // Default unselected
          let nodeFill: string = 'rgba(255,255,255,0.05)';
          let nodeStroke: string = 'rgba(255,255,255,0.55)';
          let nodeTextFill: string = 'rgba(255,255,255,0.85)';
          let circleScale = 1;

          if (role) {
            const c = roleColor(role)!;
            nodeFill = `url(#grad-${role})`;
            nodeStroke = lightMix(c.fill, 30); // slightly lighter rim
            nodeTextFill = c.text;
            circleScale = 1.25;
          } else if (someoneSelected) {
            nodeFill = 'rgba(255,255,255,0.03)';
            nodeStroke = 'rgba(255,255,255,0.22)';
            nodeTextFill = 'rgba(255,255,255,0.35)';
          }

          const ariaState =
            role === 'd1' ? 'выбрана первой'
            : role === 'd2' ? 'выбрана второй'
            : role === 'product' ? 'результат произведения'
            : 'не выбрана';

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

              {/* Ambient outer glow for active nodes — premium soft halo, not CSS drop-shadow */}
              {role && (
                <motion.circle
                  r="10"
                  fill={`url(#glow-${role})`}
                  filter="url(#node-soft-glow)"
                  className="pointer-events-none"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}

              <motion.circle
                r="3"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth="0.4"
                whileHover={isPressed ? undefined : { scale: 1.2 }}
                animate={{ scale: circleScale }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              />

              {/* Tiny inner highlight on active nodes — emulates light source from top-left */}
              {role && (
                <circle
                  cx="-0.9" cy="-0.9" r="0.6"
                  fill="white"
                  opacity="0.55"
                  className="pointer-events-none"
                />
              )}

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
                  className={cn("font-sans text-[3.5px] uppercase tracking-wider font-bold pointer-events-none")}
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
