"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
    { href: "/", label: "Upload" },
    { href: "/viewResult", label: "Recommendations" },
    { href: "/trackAppl", label: "Job Tracker" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");

        if (storedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else if (storedTheme === "light") {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setDarkMode(prefersDark);
            if (prefersDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, []);


    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };
    console.log(document.documentElement.classList)
    return (
        <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-md py-4">

            <div className="flex justify-center items-center gap-4">
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`px-4 py-2 rounded-full transition-colors duration-200 ${pathname === href
                            ? "bg-yellow-400 text-black font-semibold"
                            : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                    >
                        {label}
                    </Link>
                ))}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
        </header>
    );
}
