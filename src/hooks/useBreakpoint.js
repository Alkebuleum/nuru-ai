import { useState, useEffect } from "react";

export function useBreakpoint() {
    const getBreakpoint = () => {
        const w = window.innerWidth;
        if (w < 640) return "mobile";
        if (w < 1024) return "tablet";
        return "desktop";
    };

    const [breakpoint, setBreakpoint] = useState(getBreakpoint);

    useEffect(() => {
        const handler = () => setBreakpoint(getBreakpoint());
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return {
        breakpoint,
        isMobile: breakpoint === "mobile",
        isTablet: breakpoint === "tablet",
        isDesktop: breakpoint === "desktop",
    };
}