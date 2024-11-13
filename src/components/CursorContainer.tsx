"use client";
import { useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useState } from "react";
import { a } from "@react-spring/web";

export default function CursorContainer() {
  const cursorSize = 10;
  const cursorOuterSize = cursorSize * 5;
  const [isVisible, setIsVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useSpring(() => ({
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  }));
  const [cursorOuterPosition, setCursorOuterPosition] = useSpring(() => ({
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    config: {
      tension: 300,
      friction: 40,
      mass: 0.5,
    },
  }));
  const visibility = useSpring({
    opacity: isVisible ? 1 : 0,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  });

  const manageMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;

    setCursorPosition({ left: clientX, top: clientY });
    setCursorOuterPosition({ left: clientX, top: clientY });
  }, []);

  const onMouseEnterViewport = useCallback(() => setIsVisible(true), []);
  const onMouseExitViewport = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseover", onMouseEnterViewport);
    window.addEventListener("mouseout", onMouseExitViewport);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, []);

  return (
    <>
      <a.div
        className="fixed pointer-events-none rounded-full bg-black dark:bg-white z-50"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          transform: "translate(-50%, -50%)",
          ...visibility,
          ...cursorPosition,
        }}
      ></a.div>
      <a.div
        className="fixed pointer-events-none border-2 rounded-full border-black dark:border-white z-50"
        style={{
          width: `${cursorOuterSize}px`,
          height: `${cursorOuterSize}px`,
          transform: "translate(-50%, -50%)",
          ...visibility,
          ...cursorOuterPosition,
        }}
      ></a.div>
    </>
  );
}
