"use client";

import React, { useState, useEffect } from 'react';

/**
 * HowToPlayModal Component
 * Displays instructions on how to play Verto.
 * Uses localStorage to persist "seen" state so it doesn't annoy returning users,
 * but can be reopened manually.
 */
export default function HowToPlayModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen the tutorial
        const hasSeen = localStorage.getItem('verto_tutorial_seen');
        if (!hasSeen) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('verto_tutorial_seen', 'true');
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="fixed bottom-4 right-4 z-40 bg-white/80 backdrop-blur text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-sm border border-slate-200 transition-colors"
                title="How to Play"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>

                <article className="prose prose-slate prose-sm md:prose-base">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                        How to Play Verto
                    </h2>
                    <p className="lead text-slate-500 font-medium mb-6">
                        Connect every number. Leave no cell behind. One single path to victory.
                    </p>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">1</span>
                                Sequential Flow
                            </h3>
                            <p className="text-slate-600">
                                Start at <strong>1</strong> and connect numbers in ascending order (1 → 2 → 3...). Drag with your mouse or finger to draw the path.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">2</span>
                                Complete the Grid
                            </h3>
                            <p className="text-slate-600">
                                <strong>Every single cell</strong> on the board must be visited. You cannot skip cells or cross your own path.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">3</span>
                                The Hamiltonian Rule
                            </h3>
                            <p className="text-slate-600">
                                Moves must be <strong>orthogonal</strong> (up, down, left, right). No diagonals. No backtracking.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            <strong>Why Verto?</strong> Powered by <span className="font-semibold text-slate-600">Mutabie Canada Inc.</span> constraint logic, every puzzle is unique and solvable.
                            Built with Next.js 16 for zero-latency play.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-95"
                    >
                        Start Playing
                    </button>
                </article>
            </div>
        </div>
    );
}
