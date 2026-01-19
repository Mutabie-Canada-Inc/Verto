/**
 * @file game-logic.ts
 * @description Core game logic for the Zoop puzzle, including Hamiltonian path generation and puzzle board creation.
 * @author Mutabie Canada Inc.
 */

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

/**
 * Checks if a position is within the grid boundaries.
 * @param x X coordinate (0-indexed)
 * @param y Y coordinate (0-indexed)
 * @returns true if valid, false otherwise
 */
const isValidPos = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
};

/**
 * Generates a random Hamiltonian path on the grid.
 * A Hamiltonian path visits every node exactly once.
 * Uses a randomized Depth-First Search (DFS) with backtracking.
 * @returns A 2D array representing the path order (1 to TOTAL_CELLS), or null if failed.
 */
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

/**
 * Recursive DFS to find a path.
 * @param x Current X
 * @param y Current Y
 * @param step Current step number (value to place)
 * @param grid Reference to the grid
 * @returns true if a full path is found.
 */
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

/**
 * Generates a playable puzzle board based on difficulty.
 * @param difficulty 'easy', 'medium', or 'hard'
 * @returns A Board object with fixed cells revealed.
 */
export const generatePuzzle = (difficulty: Difficulty): Board => {
  let solution: number[][] | null = null;
  
  // Attempt to generate a valid path
  for (let i = 0; i < 100; i++) {
    solution = generateHamiltonianPath();
    if (solution) break;
  }
  
  // Fallback to a simple zigzag if generation fails (rare)
  if (!solution) {
    solution = Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => y * GRID_SIZE + x + 1)
    );
     for(let y=1; y<GRID_SIZE; y+=2) solution[y].reverse();
  }
  
  // Determine number of clues
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
  
  // Always reveal Start and End
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

/**
 * Validates if a move between two positions is legal (orthogonal and adjacent).
 * @param curr Current position
 * @param next Next position
 * @returns true if move is valid
 */
export const isValidMove = (curr: Position, next: Position): boolean => {
    const dx = Math.abs(curr.x - next.x);
    const dy = Math.abs(curr.y - next.y);
    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) return false;
    return isValidPos(next.x, next.y);
};
