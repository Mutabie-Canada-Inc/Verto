'use server';

/**
 * @file game-actions.ts
 * @description Server-side actions for Zoop game, handling secure score validation.
 * @author Mutabie Canada Inc.
 */

import { TOTAL_CELLS } from "@/lib/game-logic";

/**
 * Validates a submitted game path to ensure it meets all puzzle rules.
 * This runs on the server to prevent client-side manipulation.
 * 
 * Rules checked:
 * 1. Path length must equal total grid cells.
 * 2. Path values must be sequential (1, 2, 3...).
 * 3. Moves must be orthogonal (no diagonals/jumps).
 * 
 * @param path Array of path nodes submitted by client
 * @returns Object containing success status and message
 */
export async function submitScore(path: {x: number, y: number, value: number}[]) {
    if (path.length !== TOTAL_CELLS) {
        return { success: false, message: "Path is incomplete." };
    }
    
    // Sort logic to ensure sequence check works regardless of array order (though client sends in order)
    const sortedPath = [...path].sort((a,b) => a.value - b.value);
    
    for (let i = 0; i < sortedPath.length - 1; i++) {
        const curr = sortedPath[i];
        const next = sortedPath[i+1];
        
        // Sequential Check
        if (curr.value + 1 !== next.value) {
             return { success: false, message: "Path is broken (values not sequential)." };
        }
        
        // Adjacency Check
        const dx = Math.abs(curr.x - next.x);
        const dy = Math.abs(curr.y - next.y);
        
        if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
            return { success: false, message: "Invalid move (diagonal or jump detected)." };
        }
    }
    
    // In a production app, we would also verify against the server-generated seed 
    // to ensure the user didn't modify the "Fixed" cells.
    
    return { success: true, message: "Score verified! 100 points." };
}
