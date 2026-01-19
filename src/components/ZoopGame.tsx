"use client";

import React, { useState, useEffect } from 'react';
import { generatePuzzle, Difficulty, Board, GRID_SIZE, TOTAL_CELLS } from '@/lib/game-logic';
import { submitScore } from '@/actions/game-actions';

export default function ZoopGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [board, setBoard] = useState<Board>([]);
    const [userPath, setUserPath] = useState<{ x: number, y: number, value: number }[]>([]);
    const [isWon, setIsWon] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [validationMsg, setValidationMsg] = useState<string>("");

    useEffect(() => {
        startNewGame(difficulty);
    }, []);

    const startNewGame = (diff: Difficulty) => {
        setDifficulty(diff);
        const newBoard = generatePuzzle(diff);
        setBoard(newBoard);
        setIsWon(false);
        setUserPath([]);
        setValidationMsg("");

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (newBoard[y][x].value === 1) {
                    setUserPath([{ x, y, value: 1 }]);
                    return;
                }
            }
        }
    };

    const currentHead = userPath[userPath.length - 1];

    const tryMove = (x: number, y: number) => {
        if (isWon || !currentHead) return;

        if (userPath.length > 1) {
            const prev = userPath[userPath.length - 2];
            if (prev.x === x && prev.y === y) {
                setUserPath(prevPath => prevPath.slice(0, -1));
                return;
            }
        }

        const dist = Math.abs(x - currentHead.x) + Math.abs(y - currentHead.y);
        if (dist !== 1) return;

        const nextVal = currentHead.value + 1;
        const fixedCell = board[y][x];

        if (fixedCell.isFixed) {
            if (fixedCell.value !== nextVal) return;
        } else {
            if (userPath.some(p => p.x === x && p.y === y)) return;
        }

        const newPath = [...userPath, { x, y, value: nextVal }];
        setUserPath(newPath);

        if (newPath.length === TOTAL_CELLS) {
            setIsWon(true);
            setValidationMsg("Verifying...");
            submitScore(newPath).then(res => {
                setValidationMsg(res.message);
            }).catch(() => {
                setValidationMsg("Verification failed.");
            });
        }
    };

    const handlePointerDown = (x: number, y: number, e: React.PointerEvent) => {
        e.preventDefault();
        if (currentHead && x === currentHead.x && y === currentHead.y) {
            setIsDragging(true);
        } else if (!isWon) {
            tryMove(x, y);
            setIsDragging(true);
        }
    };

    const handlePointerEnter = (x: number, y: number) => {
        if (isDragging) tryMove(x, y);
    };

    const handlePointerUp = () => setIsDragging(false);

    useEffect(() => {
        window.addEventListener('pointerup', handlePointerUp);
        return () => window.removeEventListener('pointerup', handlePointerUp);
    }, []);

    const getCellDisplay = (x: number, y: number) => {
        const pathNode = userPath.find(p => p.x === x && p.y === y);
        if (pathNode) return pathNode.value;
        if (board[y]?.[x].isFixed) return board[y][x].value;
        return null;
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full max-w-md select-none touch-none">
            {/* Controls */}
            <div className="flex gap-4 items-center w-full justify-between">
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                        <button
                            key={d}
                            onClick={() => startNewGame(d)}
                            className={`
                        px-3 py-1 text-sm font-medium rounded-md capitalize transition-colors
                        ${difficulty === d ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}
                    `}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => startNewGame(difficulty)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Grid */}
            <div
                className="grid gap-1 bg-slate-200 p-2 rounded-xl shadow-inner w-full aspect-square"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
                {Array.from({ length: GRID_SIZE }).map((_, y) =>
                    Array.from({ length: GRID_SIZE }).map((_, x) => {
                        const val = getCellDisplay(x, y);
                        const isFixed = board[y]?.[x].isFixed;
                        const isHead = currentHead?.x === x && currentHead?.y === y;
                        const inPath = !!userPath.find(p => p.x === x && p.y === y);

                        let cellClass = "bg-white text-slate-400"; // default empty

                        if (isWon && inPath) {
                            cellClass = "bg-green-500 text-white scale-95 rounded-lg shadow-sm";
                        } else if (isHead) {
                            cellClass = "bg-blue-600 text-white shadow-md z-10 scale-105 rounded-lg ring-2 ring-blue-600/30";
                        } else if (inPath) {
                            if (isFixed) {
                                cellClass = "bg-blue-100 text-blue-900 border-2 border-blue-200"; // Fixed cell when visited
                            } else {
                                cellClass = "bg-blue-50 text-blue-700"; // Normal visited cell
                            }
                        } else if (isFixed) {
                            cellClass = "bg-slate-100 text-slate-800 font-bold border-2 border-slate-200"; // Fixed but not visited?
                            // Wait, logic says fixed cells must be part of path. They are just pre-filled visible numbers.
                            // If not yet visited, they are just number hints.
                            if (!inPath) {
                                // Should we show the number? Yes.
                                cellClass = "bg-slate-200/50 text-slate-800 font-bold";
                            }
                        }

                        return (
                            <div
                                key={`${x}-${y}`}
                                onPointerDown={(e) => handlePointerDown(x, y, e)}
                                onPointerEnter={() => handlePointerEnter(x, y)}
                                className={`
                    flex items-center justify-center 
                    text-base sm:text-lg md:text-xl rounded-md cursor-pointer
                    transition-all duration-200 ${cellClass}
                 `}
                            >
                                {val}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Status */}
            <div className="text-center h-16 w-full flex items-center justify-center">
                {isWon ? (
                    <div className="flex flex-col gap-1 items-center animate-bounce">
                        <div className="text-xl font-bold text-green-600">
                            Puzzle Completed! 🎉
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                            {validationMsg}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-black text-slate-900">
                            {userPath.length} / {TOTAL_CELLS}
                        </div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Progress
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
