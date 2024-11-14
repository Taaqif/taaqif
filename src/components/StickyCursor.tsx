"use client";
import { useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useState } from "react";
import { a } from "@react-spring/web";
const clickables = ["A"];
export default function StickyCursor() {
  const cursorSize = 10;
  const cursorOuterSize = cursorSize * 5;
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
  const cursorOuterScale = useSpring({
    transform: isHovering ? `scale(1.6)` : `scale(1)`,
    config: {
      tension: 300,
      friction: 40,
      mass: 0.5,
    },
  });
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

      setCursorPosition.start({
        left: clientX - cursorSize / 2,
        top: clientY - cursorSize / 2,
      });
      setCursorOuterPosition.start({
        left: clientX - cursorOuterSize / 2,
        top: clientY - cursorOuterSize / 2,
      });
    },
    [setCursorOuterPosition, setCursorPosition, cursorOuterSize],
  );

  const onMouseEnterViewport = useCallback((e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    const elementsMouseIsOver = document.elementsFromPoint(x, y);
    const isClickable = elementsMouseIsOver.some((elem) =>
      clickables.includes(elem.tagName),
    );
    setIsHovering(isClickable);
    setIsVisible(true);
  }, []);
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
          ...visibility,
          ...cursorPosition,
        }}
      ></a.div>
      <a.div
        className="fixed pointer-events-none border-2 rounded-full border-[var(--cursor-color)] z-50"
        style={{
          width: `${cursorOuterSize}px`,
          height: `${cursorOuterSize}px`,
          ...visibility,
          ...cursorOuterPosition,
          ...cursorOuterScale,
        }}
      ></a.div>
    </>
  );
}
