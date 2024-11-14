"use client";
import React, { useRef } from "react";
import { useSpring, a } from "@react-spring/web";

export default function Loader() {
  const loaderContainer = useRef<HTMLDivElement>(null);
  const startingX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const startingY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const spring = useSpring({
    from: {
      r: 0,
      cx: startingX,
      cy: startingY,
    },
    to: {
      r: Math.max(startingY, startingX) * 1.2,
      cx: startingX,
      cy: startingY,
    },
    config: {
      mass: 1,
      tension: 210,
      friction: 30,
    },
  });
  return (
    <div
      ref={loaderContainer}
      className="fixed w-full h-svh top-0 right-0 z-50 pointer-events-none"
    >
      <svg className="w-full h-full">
        <defs>
          <mask id="myMask">
            <rect width="100%" height="100%" fill="white" />
            <a.circle {...spring} fill="black" />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          height="100%"
          width="100%"
          fill="var(--loader-background)"
          mask="url(#myMask)"
        />
      </svg>
    </div>
  );
}
