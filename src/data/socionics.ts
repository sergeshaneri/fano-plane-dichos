export type FunctionData = {
  id: number;
  name: string;
  order: number;
  layoutPos: [number, number]; // [row, col]
  dichotomies: Record<number, number>; // Maps dichotomy ID (1-7) to 1 or -1
};

export type Dichotomy = {
  id: number;
  name: string;
  longName: string;
};

// As derived from the user's specific table
// F1(1), F5(5), F6(6), F2(2), F8(8), F4(4), F3(3), F7(7)
export const FUNCTIONS: FunctionData[] = [
  { id: 1, name: 'Программная (1)', order: 1, layoutPos: [0, 0], dichotomies: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { id: 2, name: 'Творческая (2)', order: 4, layoutPos: [0, 1], dichotomies: { 1: -1, 2: -1, 3: 1, 4: 1, 5: -1, 6: -1, 7: 1 } },
  { id: 3, name: 'Ролевая (3)', order: 7, layoutPos: [1, 1], dichotomies: { 1: 1, 2: -1, 3: -1, 4: -1, 5: -1, 6: 1, 7: 1 } },
  { id: 4, name: 'Болевая (4)', order: 6, layoutPos: [1, 0], dichotomies: { 1: -1, 2: 1, 3: -1, 4: -1, 5: 1, 6: -1, 7: 1 } },
  { id: 5, name: 'Суггестивная (5)', order: 2, layoutPos: [2, 1], dichotomies: { 1: -1, 2: 1, 3: -1, 4: 1, 5: -1, 6: 1, 7: -1 } },
  { id: 6, name: 'Активационная (6)', order: 3, layoutPos: [2, 0], dichotomies: { 1: 1, 2: -1, 3: -1, 4: 1, 5: 1, 6: -1, 7: -1 } },
  { id: 7, name: 'Ограничительная (7)', order: 8, layoutPos: [3, 0], dichotomies: { 1: -1, 2: -1, 3: 1, 4: -1, 5: 1, 6: 1, 7: -1 } },
  { id: 8, name: 'Фоновая (8)', order: 5, layoutPos: [3, 1], dichotomies: { 1: 1, 2: 1, 3: 1, 4: -1, 5: -1, 6: -1, 7: -1 } },
];

export const STANDARD_LAYOUT = [
  [FUNCTIONS.find(f => f.id === 1)!, FUNCTIONS.find(f => f.id === 2)!],
  [FUNCTIONS.find(f => f.id === 4)!, FUNCTIONS.find(f => f.id === 3)!],
  [FUNCTIONS.find(f => f.id === 6)!, FUNCTIONS.find(f => f.id === 5)!],
  [FUNCTIONS.find(f => f.id === 7)!, FUNCTIONS.find(f => f.id === 8)!],
];

export const DICHOTOMIES: Dichotomy[] = [
  { id: 1, name: "Экстра/Интро", longName: "Экстравертные / Интровертные" },
  { id: 2, name: "Оц/Сит", longName: "Оценочность / Ситуативность" },
  { id: 3, name: "Сл/Слаб", longName: "Сила / Слабость" },
  { id: 4, name: "Вб/Лб", longName: "Вербальность / Лаборность" },
  { id: 5, name: "Ин/Кт", longName: "Инертность / Контактность" },
  { id: 6, name: "Акц/Прод", longName: "Акцептность / Продуктивность" },
  { id: 7, name: "Мент/Вит", longName: "Ментальность / Витальность" },
];

// Fano Plane layout mapping points (1-7) to physical layout
// Mathematical perfectly equilateral triangle centered at (50,54)
export const FANO_LAYOUT = {
  1: { id: 1, pos: [50, 14], labelOffset: { dx: 0, dy: -9, anchor: 'middle' } }, // Top
  2: { id: 2, pos: [50, 74], labelOffset: { dx: 0, dy: 10, anchor: 'middle' } }, // Bottom Mid
  3: { id: 3, pos: [50, 54], labelOffset: { dx: 5, dy: -5, anchor: 'start' } }, // Center
  4: { id: 4, pos: [84.641, 74], labelOffset: { dx: 8, dy: 6, anchor: 'start' } }, // Bottom Right
  5: { id: 5, pos: [67.3205, 44], labelOffset: { dx: 8, dy: -2, anchor: 'start' } }, // Mid Right
  6: { id: 6, pos: [15.359, 74], labelOffset: { dx: -8, dy: 6, anchor: 'end' } }, // Bottom Left
  7: { id: 7, pos: [32.6795, 44], labelOffset: { dx: -8, dy: -2, anchor: 'end' } }, // Mid Left
};

// Lines define groups of 3 elements that multiply to identity
export const FANO_LINES = [
  { id: 'L1', nodes: [1, 5, 4], name: 'Длинный вертикальный блок' }, // Right edge
  { id: 'L2', nodes: [1, 7, 6], name: 'Диагональный императив Шепетько' }, // Left edge
  { id: 'L3', nodes: [6, 2, 4], name: 'Дуальный блок' }, // Bottom edge
  { id: 'L4', nodes: [1, 3, 2], name: 'Мерности Букалова' }, // Altitude 1 (vertical)
  { id: 'L5', nodes: [6, 3, 5], name: 'Такты Аушры' }, // Altitude 2
  { id: 'L6', nodes: [4, 3, 7], name: 'Горизонтальные блоки Аушры' }, // Altitude 3
  { id: 'L7', nodes: [7, 2, 5], name: 'Вертикальный блок', isCircle: true }, // Inscribed circle
];
