/**
 * Verto - Daily Logic Puzzle
 * Copyright (C) 2026 Mutabie Canada Inc.
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
"use client";

/**
 * @file VertoGame.tsx
 * @description Main client-side game component. Handles user interaction, state, and rendering.
 * @author Mutabie Canada Inc.
 */

import React, { useState, useEffect } from 'react';
import { generatePuzzle, Difficulty, Board, GRID_SIZE, TOTAL_CELLS } from '@/lib/game-logic';
import { submitScore } from '@/actions/game-actions';
import GameTimer from './GameTimer';
import HowToPlayModal from './HowToPlayModal';
import confetti from 'canvas-confetti';

export default function VertoGame() {
    // Game State
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [board, setBoard] = useState<Board>([]);
    const [userPath, setUserPath] = useState<{ x: number, y: number, value: number }[]>([]);
    const [isWon, setIsWon] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [validationMsg, setValidationMsg] = useState<string>("");
    const [gameId, setGameId] = useState(0);

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            colors: ['#2563eb', '#3b82f6', '#60a5fa', '#ffffff'], // Blue theme
            ticks: 200,
            gravity: 1.2,
            decay: 0.92,
            startVelocity: 45,
        };

        const fire = (particleRatio: number, opts: any) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        };

        // Left Burst
        fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0, y: 0.6 }, angle: 60 });
        fire(0.2, { spread: 60, origin: { x: 0, y: 0.6 }, angle: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0, y: 0.6 }, angle: 60 });

        // Right Burst
        fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 1, y: 0.6 }, angle: 120 });
        fire(0.2, { spread: 60, origin: { x: 1, y: 0.6 }, angle: 120 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 1, y: 0.6 }, angle: 120 });
    };

    // Initialization
    useEffect(() => {
        startNewGame(difficulty);
    }, []);

    /**
     * Resets the game with a new puzzle of the specified difficulty.
     * @param diff 'easy' | 'medium' | 'hard'
     */
    const startNewGame = (diff: Difficulty) => {
        setDifficulty(diff);
        const newBoard = generatePuzzle(diff);
        setBoard(newBoard);
        setIsWon(false);
        setUserPath([]);
        setValidationMsg("");
        setGameId(prev => prev + 1);

        // Auto-select the '1' cell to start
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

    /**
     * Attempts to move/extend the path to coordinates (x,y).
     * Validates moves locally before updating state.
     */
    const tryMove = (x: number, y: number) => {
        if (isWon || !currentHead) return;

        // Undo Logic: Allow stepping back
        if (userPath.length > 1) {
            const prev = userPath[userPath.length - 2];
            if (prev.x === x && prev.y === y) {
                setUserPath(prevPath => prevPath.slice(0, -1));
                return;
            }
        }

        // Validity Check: Must be neighbor
        const dist = Math.abs(x - currentHead.x) + Math.abs(y - currentHead.y);
        if (dist !== 1) return;

        const nextVal = currentHead.value + 1;
        const fixedCell = board[y][x];

        // Constraint Check: Fixed cells must match sequence
        if (fixedCell.isFixed) {
            if (fixedCell.value !== nextVal) return;
        } else {
            // Constraint Check: Cannot cross own path
            if (userPath.some(p => p.x === x && p.y === y)) return;
        }

        const newPath = [...userPath, { x, y, value: nextVal }];
        setUserPath(newPath);

        // Win Condition
        if (newPath.length === TOTAL_CELLS) {
            setIsWon(true);
            setValidationMsg("Verifying...");
            triggerConfetti();
            submitScore(newPath).then(res => {
                setValidationMsg(res.message);
            }).catch(() => {
                setValidationMsg("Verification failed.");
            });
        }
    };

    // Pointer Handlers for Drag Interaction
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

    // Mobile Drag Support: Handle touchmove globally when dragging
    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            // Prevent scrolling ONLY when we are successfully dragging/interacting or on the grid
            // But usually we want to prevent default if we are in "drag mode"
            e.preventDefault();

            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const cell = target?.closest('[data-cell="true"]');

            if (cell) {
                const x = parseInt(cell.getAttribute('data-x') || '-1');
                const y = parseInt(cell.getAttribute('data-y') || '-1');
                if (x !== -1 && y !== -1) {
                    tryMove(x, y);
                }
            }
        };

        if (isDragging) {
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        }
        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isDragging, userPath]); // Re-bind when path updates to ensure tryMove has latest state

    const getCellDisplay = (x: number, y: number) => {
        const pathNode = userPath.find(p => p.x === x && p.y === y);
        if (pathNode) return pathNode.value;
        if (board[y]?.[x].isFixed) return board[y][x].value;
        return null;
    };

    // Helper: Determine visually connected neighbors for drawing lines
    const getConnectors = (x: number, y: number) => {
        const idx = userPath.findIndex(p => p.x === x && p.y === y);
        if (idx === -1) return [];

        const connectors: ('top' | 'bottom' | 'left' | 'right')[] = [];
        // const curr = userPath[idx]; // unused

        // Previous connection
        if (idx > 0) {
            const prev = userPath[idx - 1];
            if (prev.x === x && prev.y < y) connectors.push('top');
            if (prev.x === x && prev.y > y) connectors.push('bottom');
            if (prev.x < x && prev.y === y) connectors.push('left');
            if (prev.x > x && prev.y === y) connectors.push('right');
        }

        // Next connection
        if (idx < userPath.length - 1) {
            const next = userPath[idx + 1];
            if (next.x === x && next.y < y) connectors.push('top');
            if (next.x === x && next.y > y) connectors.push('bottom');
            if (next.x < x && next.y === y) connectors.push('left');
            if (next.x > x && next.y === y) connectors.push('right');
        }
        return connectors;
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full max-w-sm  sm:max-w-md  select-none">
            {/* Difficulty Controls */}
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

            {/* Game Grid */}
            <div
                className="grid gap-1 bg-verto-grid-bg p-2 rounded-xl shadow-inner w-[92vw] sm:w-full aspect-square text-md touch-none"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
                {Array.from({ length: GRID_SIZE }).map((_, y) =>
                    Array.from({ length: GRID_SIZE }).map((_, x) => {
                        const val = getCellDisplay(x, y);
                        const isFixed = board[y]?.[x].isFixed;
                        const isHead = currentHead?.x === x && currentHead?.y === y;
                        const inPath = !!userPath.find(p => p.x === x && p.y === y);
                        const connectors = getConnectors(x, y);

                        // Styling Logic: Using standard utilities for reliability
                        let cellClass = "bg-white text-slate-400";

                        if (isWon && inPath) {
                            cellClass = "bg-green-500 text-white scale-95 rounded-lg shadow-sm";
                        } else if (isHead) {
                            cellClass = "bg-blue-600 text-white shadow-md z-20 scale-105 rounded-lg ring-2 ring-blue-600/30 font-bold";
                        } else if (inPath) {
                            cellClass = "bg-blue-50 text-blue-600 font-semibold";
                        } else if (isFixed) {
                            cellClass = "bg-slate-200/50 text-slate-800 font-bold";
                        }

                        // Determine connector color
                        const connectorColor = isWon ? "bg-green-500" : "bg-blue-600";

                        return (
                            <div
                                key={`${x}-${y}`}
                                data-cell="true"
                                data-x={x}
                                data-y={y}
                                onPointerDown={(e) => handlePointerDown(x, y, e)}
                                onPointerEnter={() => handlePointerEnter(x, y)}
                                className={`
                                    relative flex items-center justify-center 
                                    aspect-square min-h-[44px]
                                    text-base sm:text-lg md:text-xl rounded-md cursor-pointer
                                    transition-all duration-200 overflow-hidden ${cellClass}
                                 `}
                            >
                                {/* Path Connectors */}
                                {inPath && !isWon && (
                                    <>
                                        {connectors.includes('top') && (
                                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-1/2 ${connectorColor} z-0`} />
                                        )}
                                        {connectors.includes('bottom') && (
                                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-1/2 ${connectorColor} z-0`} />
                                        )}
                                        {connectors.includes('left') && (
                                            <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-2.5 ${connectorColor} z-0`} />
                                        )}
                                        {connectors.includes('right') && (
                                            <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-2.5 ${connectorColor} z-0`} />
                                        )}
                                        {/* Corner Joint / Under-Bead Filler */}
                                        {connectors.length > 0 && (
                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ${connectorColor} z-0`} />
                                        )}
                                    </>
                                )}

                                <span className={`z-10 relative ${inPath && !isHead && !isWon ? 'flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-sm' : ''}`}>
                                    {val}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Timer */}
            <div className="flex justify-center py-2 h-10 w-full">
                <GameTimer key={gameId} isRunning={!isWon} />
            </div>

            {/* Game Status / Progress */}
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

            <HowToPlayModal />
        </div>
    );
}
