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
        relative flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 font-semibold text-sm
        ${isDark
                    ? "bg-[#0f3460] border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-yellow-900/30"
                    : "bg-white border-[#6B4F3A]/20 text-[#6B4F3A] hover:bg-[#FAF7F2]"
                }
      `}
        >
            <span className="transition-transform duration-300" style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </span>
        </button>
    );
}
