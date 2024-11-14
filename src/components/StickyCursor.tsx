"use client";
import { useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useState } from "react";
import { a } from "@react-spring/web";

export default function StickyCursor() {
  const cursorSize = 10;
  const cursorOuterSize = cursorSize * 5;
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchdevice, setIsTouchdevice] = useState<boolean>();

  const startingX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const startingY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const [cursorPosition, setCursorPosition] = useSpring(() => ({
    left: startingX,
    top: startingY,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  }));
  const [cursorOuterPosition, setCursorOuterPosition] = useSpring(() => ({
    left: startingX,
    top: startingY,
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

  const manageMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;

      setCursorPosition({ left: clientX, top: clientY });
      setCursorOuterPosition({ left: clientX, top: clientY });
    },
    [setCursorOuterPosition, setCursorPosition],
  );

  const onMouseEnterViewport = useCallback(() => setIsVisible(true), []);
  const onMouseExitViewport = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseover", onMouseEnterViewport);
    window.addEventListener("mouseout", onMouseExitViewport);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      window.removeEventListener("mouseover", onMouseEnterViewport);
      window.removeEventListener("mouseout", onMouseExitViewport);
    };
  }, [manageMouseMove, onMouseEnterViewport, onMouseExitViewport]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchdevice(window.matchMedia("(hover: none)").matches);
    }
  }, []);

  if (isTouchdevice) {
    return <></>;
  }

  return (
    <>
      <a.div
        className="fixed pointer-events-none rounded-full bg-[var(--cursor-color)] z-50"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          transform: "translate(-50%, -50%)",
          ...visibility,
          ...cursorPosition,
        }}
      ></a.div>
      <a.div
        className="fixed pointer-events-none border-2 rounded-full border-[var(--cursor-color)] z-50"
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
