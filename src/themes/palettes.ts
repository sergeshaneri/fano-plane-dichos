export type PaletteName = 'vaporwave' | 'cyberpunk' | 'aurora';

export type PaletteColors = {
  d1: { fill: string; text: string };
  d2: { fill: string; text: string };
  product: { fill: string; text: string };
  line: string;            // active Fano line color
  brand: string;           // app accent (titles, dividers, badges)
  cellPlus: { bg: string; text: string };  // single-dichotomy +1 cells
  cellMinus: { bg: string; text: string }; // single-dichotomy −1 cells
  intersection: string;    // both +1
  onlyD1: string;          // D1=+, D2=−
  onlyD2: string;          // D1=−, D2=+
  neither: string;         // both −1
  cellTextOnDark: string;
};

const dark = '#0a0a0c';

export const PALETTES: Record<PaletteName, PaletteColors> = {
  vaporwave: {
    d1:      { fill: '#00e5ff', text: dark },
    d2:      { fill: '#ff2d92', text: '#fff' },
    product: { fill: '#c6ff00', text: dark },
    line:    '#00e5ff',
    brand:   '#00e5ff',
    cellPlus:  { bg: '#00e5ff', text: dark },
    cellMinus: { bg: 'rgba(255,255,255,0.025)', text: 'rgba(255,255,255,0.25)' },
    intersection: '#0ea5e9', // deep electric blue
    onlyD1:       '#00e5ff',
    onlyD2:       '#ff2d92',
    neither:      '#5b21b6', // deep violet
    cellTextOnDark: '#fff',
  },
  cyberpunk: {
    d1:      { fill: '#00f5ff', text: dark },
    d2:      { fill: '#ff5c1f', text: '#fff' },
    product: { fill: '#ffd60a', text: dark },
    line:    '#00f5ff',
    brand:   '#00f5ff',
    cellPlus:  { bg: '#00f5ff', text: dark },
    cellMinus: { bg: 'rgba(255,255,255,0.025)', text: 'rgba(255,255,255,0.25)' },
    intersection: '#0284c7',
    onlyD1:       '#00f5ff',
    onlyD2:       '#ff5c1f',
    neither:      '#7c2d12', // burnt sienna
    cellTextOnDark: '#fff',
  },
  aurora: {
    d1:      { fill: '#14b8a6', text: '#fff' },
    d2:      { fill: '#a855f7', text: '#fff' },
    product: { fill: '#3b82f6', text: '#fff' },
    line:    '#14b8a6',
    brand:   '#14b8a6',
    cellPlus:  { bg: '#14b8a6', text: '#fff' },
    cellMinus: { bg: 'rgba(255,255,255,0.025)', text: 'rgba(255,255,255,0.25)' },
    intersection: '#0d9488',
    onlyD1:       '#14b8a6',
    onlyD2:       '#a855f7',
    neither:      '#1e3a8a',
    cellTextOnDark: '#fff',
  },
};

export const PALETTE_LABELS: Record<PaletteName, string> = {
  vaporwave: 'Vaporwave',
  cyberpunk: 'Cyberpunk',
  aurora: 'Aurora',
};
