'use server';

import { TOTAL_CELLS } from "@/lib/game-logic";

export async function submitScore(path: {x: number, y: number, value: number}[]) {
    if (path.length !== TOTAL_CELLS) {
        return { success: false, message: "Path is incomplete." };
    }
    
    const sortedPath = [...path].sort((a,b) => a.value - b.value);
    
    for (let i = 0; i < sortedPath.length - 1; i++) {
        const curr = sortedPath[i];
        const next = sortedPath[i+1];
        
        if (curr.value + 1 !== next.value) {
             return { success: false, message: "Path is broken (values not sequential)." };
        }
        
        const dx = Math.abs(curr.x - next.x);
        const dy = Math.abs(curr.y - next.y);
        
        if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
            return { success: false, message: "Invalid move (diagonal or jump detected)." };
        }
    }
    
    return { success: true, message: "Score verified! 100 points." };
}
