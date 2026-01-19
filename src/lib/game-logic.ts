export const GRID_SIZE = 6;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Position = { x: number; y: number };
export type Cell = { value: number; isFixed: boolean };
export type Board = Cell[][];

const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

const isValidPos = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
};

const generateHamiltonianPath = (): number[][] | null => {
  const grid: number[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  const startX = Math.floor(Math.random() * GRID_SIZE);
  const startY = Math.floor(Math.random() * GRID_SIZE);
  
  grid[startY][startX] = 1;
  
  if (dfs(startX, startY, 2, grid)) {
    return grid;
  }
  return null;
};

const dfs = (x: number, y: number, step: number, grid: number[][]): boolean => {
  if (step > TOTAL_CELLS) return true;
  
  const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
  
  for (const dir of shuffledDirs) {
    const nx = x + dir.x;
    const ny = y + dir.y;
    
    if (isValidPos(nx, ny) && grid[ny][nx] === 0) {
      grid[ny][nx] = step;
      if (dfs(nx, ny, step + 1, grid)) return true;
      grid[ny][nx] = 0;
    }
  }
  return false;
};

export const generatePuzzle = (difficulty: Difficulty): Board => {
  let solution: number[][] | null = null;
  
  for (let i = 0; i < 100; i++) {
    solution = generateHamiltonianPath();
    if (solution) break;
  }
  
  if (!solution) {
    solution = Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => y * GRID_SIZE + x + 1)
    );
     for(let y=1; y<GRID_SIZE; y+=2) solution[y].reverse();
  }
  
  let cellsToKeep = 18;
  if (difficulty === 'medium') cellsToKeep = 12;
  if (difficulty === 'hard') cellsToKeep = 6;
  
  const board: Board = [];
  const coords: Position[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      coords.push({ x, y });
    }
  }
  
  const keepIndices = new Set<number>();
  let startIdx = 0;
  let endIdx = 0;
  
  coords.forEach((pos, idx) => {
     if (solution![pos.y][pos.x] === 1) startIdx = idx;
     if (solution![pos.y][pos.x] === TOTAL_CELLS) endIdx = idx;
  });
  
  keepIndices.add(startIdx);
  keepIndices.add(endIdx);
  
  while (keepIndices.size < cellsToKeep) {
    const idx = Math.floor(Math.random() * coords.length);
    keepIndices.add(idx);
  }
  
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const flatIdx = y * GRID_SIZE + x;
      const val = solution[y][x];
      
      if (keepIndices.has(flatIdx)) {
        row.push({ value: val, isFixed: true });
      } else {
        row.push({ value: 0, isFixed: false });
      }
    }
    board.push(row);
  }
  
  return board;
};

export const isValidMove = (curr: Position, next: Position): boolean => {
    const dx = Math.abs(curr.x - next.x);
    const dy = Math.abs(curr.y - next.y);
    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) return false;
    return isValidPos(next.x, next.y);
};
