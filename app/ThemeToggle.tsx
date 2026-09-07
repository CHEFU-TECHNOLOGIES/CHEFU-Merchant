"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.dataset.theme === "dark");
    }, []);

    function toggle() {
        const nextDark = !dark;
        document.documentElement.dataset.theme = nextDark ? "dark" : "light";
        localStorage.setItem("chefu-merchant-theme", nextDark ? "dark" : "light");
        setDark(nextDark);
    }

    return (
        <button
            className="theme-toggle"
            type="button"
            onClick={toggle}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            title={dark ? "Use light theme" : "Use dark theme"}
        >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
    );
}
