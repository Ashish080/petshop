"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollFadeInProps {
    children: ReactNode;
    delay?: number;   // delay in ms e.g. 100, 200, 300
    className?: string;
}

/**
 * Wraps children with a smooth fade-in-up animation triggered when element enters viewport.
 */
export default function ScrollFadeIn({ children, delay = 0, className = "" }: ScrollFadeInProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.transitionDelay = `${delay}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`fade-in-up ${className}`}>
            {children}
        </div>
    );
}
