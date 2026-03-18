"use client";

import { useState, useRef } from "react";
import { ShoppingBag } from "lucide-react";

interface CartPawButtonProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    ariaLabel?: string;
}

export default function CartPawButton({ size = 18, className = "", style = {}, ariaLabel = "Add to cart" }: CartPawButtonProps) {
    const [paws, setPaws] = useState<{ id: number; x: number; y: number }[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = btnRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left ?? 0) - 12;
        const y = e.clientY - (rect?.top ?? 0) - 12;
        const id = Date.now();
        setPaws(prev => [...prev, { id, x, y }]);
        setTimeout(() => setPaws(prev => prev.filter(p => p.id !== id)), 650);
    };

    return (
        <button
            ref={btnRef}
            onClick={handleClick}
            aria-label={ariaLabel}
            className={`relative overflow-visible ${className}`}
            style={style}
        >
            <ShoppingBag size={size} />
            {paws.map(p => (
                <span
                    key={p.id}
                    className="paw-burst select-none"
                    style={{ left: p.x, top: p.y }}
                    aria-hidden="true"
                >
                    🐾
                </span>
            ))}
        </button>
    );
}
