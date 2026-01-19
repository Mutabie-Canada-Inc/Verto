"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                V
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-900">Verto</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                            About & History
                        </Link>
                        <a
                            href="https://mutabie.ca/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 text-sm"
                        >
                            Feedback
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-500 hover:text-slate-900 p-2 rounded-md focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            href="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About & History
                        </Link>
                        <a
                            href="https://mutabie.ca/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Feedback
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
