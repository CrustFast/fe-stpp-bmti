"use client";

import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

import loadingAnimation from "@/public/img/loading.json";

const LottieLoader = () => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current) {
            const animation = lottie.loadAnimation({
                container: container.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: loadingAnimation,
            });

            return () => {
                animation.destroy();
            };
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div ref={container} className="w-64 h-64" />
        </div>
    );
};

export default LottieLoader;
