"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
    { href: "/", label: "UPLOAD", pixel: "📤" },
    // { href: "/viewResult", label: "QUESTS", pixel: "⭐" },
    { href: "/trackAppl", label: "TRACKER", pixel: "🎯" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setBlink(b => !b), 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b-4 border-green-400" style={{
            backgroundImage: `
                linear-gradient(90deg, transparent 50%, rgba(0, 255, 0, 0.03) 50%),
                linear-gradient(rgba(0, 255, 0, 0.03) 50%, transparent 50%)
            `,
            backgroundSize: '4px 4px'
        }}>
            {/* Scanlines effect */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
                animation: 'scanlines 0.1s linear infinite'
            }}></div>

            <div className="relative max-w-6xl mx-auto px-4 py-3">
                <nav className="flex items-center justify-between">
                    {/* Game Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black border-2 border-cyan-400 flex items-center justify-center relative" style={{
                            boxShadow: 'inset -2px -2px 0px rgba(0, 255, 255, 0.3)'
                        }}>
                            {/* <div className="text-cyan-400 text-lg animate-pulse">🎮</div> */}
                            <img
                                src="/quest.png"
                                alt="Game Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="font-mono text-green-400 text-xl font-bold tracking-wider relative">
                            <span className="drop-shadow-lg" style={{ textShadow: '2px 2px 0px #000' }}>
                                Class <span className="text-cyan-400">Job-Seeker</span>
                            </span>
                            {blink && <span className="text-green-400 animate-pulse">_</span>}
                        </div>
                    </div>

                    {/* Game Menu Navigation */}
                    <div className="flex items-center gap-1">
                        {links.map(({ href, label, pixel }, index) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`group relative font-mono text-sm font-bold tracking-wider transition-all duration-200 ${isActive
                                        ? "text-black bg-green-400 border-2 border-green-400"
                                        : "text-green-400 bg-black border-2 border-green-400 hover:bg-green-400 hover:text-black"
                                        }`}
                                    style={{
                                        clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
                                        boxShadow: isActive
                                            ? 'inset -2px -2px 0px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)'
                                            : 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)'
                                    }}
                                >
                                    <div className="px-4 py-2 flex items-center gap-2">
                                        <span className="text-base">{pixel}</span>
                                        <span style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.8)' }}>
                                            {label}
                                        </span>
                                        {isActive && (
                                            <span className="text-xs animate-pulse">◄</span>
                                        )}
                                    </div>

                                    {/* Button press effect */}
                                    <div className={`absolute inset-0 transition-all duration-100 ${isActive ? 'translate-x-0.5 translate-y-0.5' : 'group-active:translate-x-0.5 group-active:translate-y-0.5'
                                        }`} style={{
                                            background: isActive ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                                        }}></div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Game Status Indicators */}
                    {/* <div className="flex items-center gap-4">
                        <div className="font-mono text-xs text-cyan-400 flex items-center gap-2">
                            <span>LEVEL</span>
                            <div className="bg-black border border-cyan-400 px-2 py-1" style={{
                                boxShadow: 'inset -1px -1px 0px rgba(0, 255, 255, 0.3)'
                            }}>
                                <span className="text-green-400 font-bold">01</span>
                            </div>
                        </div>
                        <div className="font-mono text-xs text-magenta-400 flex items-center gap-2">
                            <span className="text-yellow-400">SCORE</span>
                            <div className="bg-black border border-yellow-400 px-2 py-1" style={{
                                boxShadow: 'inset -1px -1px 0px rgba(255, 255, 0, 0.3)'
                            }}>
                                <span className="text-green-400 font-bold animate-pulse">9999</span>
                            </div>
                        </div>
                    </div> */}
                </nav>
            </div>

            <style jsx>{`
                @keyframes scanlines {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(4px); }
                }
                
                .text-magenta-400 {
                    color: #ff00ff;
                }
            `}</style>
        </header>
    );
}