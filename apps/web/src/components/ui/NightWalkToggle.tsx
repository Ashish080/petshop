"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function NightWalkToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Night Walk Mode"
            title={isDark ? "Switch to Day Mode" : "Switch to Night Walk Mode"}
            className={`
                relative flex items-center gap-2 px-3 py-2 rounded-[--radius-full] border transition-all duration-[--duration-normal]
                ${isDark
                    ? "bg-bg-tertiary border-warning/30 text-warning shadow-sm"
                    : "bg-bg-elevated border-border text-text-secondary hover:bg-bg-secondary"
                }
            `}
        >
            <span className="transition-transform duration-[--duration-normal]" style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </span>
        </button>
    );
}
