"use client";
import React, { useRef, useState } from "react";
import { useSpring, a } from "@react-spring/web";

type LoaderProps = {
  children?: React.ReactNode;
  preLoadMs?: number;
};

/* HTML: <div class="loader"></div> */
export default function Loader({ children, preLoadMs }: LoaderProps) {
  const expectedDurationMs = 800;
  const loaderContainer = useRef<HTMLDivElement>(null);
  const [loaded, setIsLoaded] = useState(false);
  const startingX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const startingY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const spinnerSpring = useSpring({
    from: {
      transform: "scale(1)",
      opactiy: 1,
    },
    to: {
      transform: "scale(0)",
      opactiy: 0,
    },
    delay: 700,
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
    },
  });
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
    delay: 800,
    config: {
      mass: 1,
      tension: 210,
      friction: 30,
    },
    onStart() {
      const timeToLoad = expectedDurationMs - (preLoadMs ?? 0);
      setTimeout(() => {
        setIsLoaded(true);
      }, timeToLoad);
    },
  });
  return (
    <>
      {loaded && children}
      <div
        ref={loaderContainer}
        className="fixed w-full h-svh top-0 right-0 z-50 pointer-events-none"
      >
        <a.div style={spinnerSpring} className="loader-container">
          <div className="loader"></div>
        </a.div>
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
    </>
  );
}
