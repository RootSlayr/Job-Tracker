"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Star, Briefcase, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
    { href: "/", label: "Upload", icon: Upload },
    { href: "/viewResult", label: "Recommendations", icon: Star },
    { href: "/trackAppl", label: "Job Tracker", icon: Briefcase },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl'
                : 'backdrop-blur-md bg-white/5 border-b border-white/10'
            }`}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 opacity-50"></div>

            {/* Floating orb effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-2 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-2 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-4">
                <nav className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30 animate-pulse"></div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                            RickRoll
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {links.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                                            : "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white backdrop-blur-sm border border-white/20 hover:border-white/30"
                                        }`}
                                >
                                    {/* Active indicator glow */}
                                    {isActive && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                                    )}

                                    {/* Icon */}
                                    <Icon className={`w-4 h-4 relative z-10 transition-transform group-hover:rotate-12 ${isActive ? 'text-white' : 'text-purple-300'
                                        }`} />

                                    {/* Label */}
                                    <span className="relative z-10 text-sm">{label}</span>

                                    {/* Hover shimmer effect */}
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side accent */}
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-500"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping animation-delay-1000"></div>
                    </div>
                </nav>
            </div>

            <style jsx>{`
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </header>
    );
}