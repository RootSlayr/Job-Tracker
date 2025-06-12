"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import GooeyNav from "./GooeyNav";

interface NavLink {
    href: string;
    label: string;
}

export default function Navbar() {
    const path = usePathname();
    const items = [
        { href: "/upload", label: "Upload" },
        { href: "/recommendations", label: "Recommendations" },
        { href: "/settings", label: "Settings" },
    ];

    const activeIndex = useMemo(() => {
        return items.findIndex((item) => item.href === path);
    }, [path]);

    return (
        <GooeyNav
            items={items}
            initialActiveIndex={activeIndex}
        />
    );
}
