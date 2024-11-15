"use client";
import { useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { a } from "@react-spring/web";
import { useInjectStyle } from "use-inject-style";

type StickyCursorProps = {
  clickables?: string[];
  showSystemCursor?: boolean;
};
export default function StickyCursor({
  clickables = ["A"],
  showSystemCursor = false,
}: StickyCursorProps) {
  const cursorSize = 10;
  const cursorOuterSize = cursorSize * 5;
  const { inject, remove } = useInjectStyle("no-cursur-styles");
  const noCursorStyles = useMemo(
    () => `${clickables?.join(",")} {cursor: none}`,
    [clickables],
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchdevice, setIsTouchdevice] = useState<boolean>();

  const startingX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const startingY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const [cursorPosition, setCursorPosition] = useSpring(() => ({
    left: startingX - cursorSize / 2,
    top: startingY - cursorSize / 2,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  }));
  const [cursorOuterPosition, setCursorOuterPosition] = useSpring(() => ({
    left: startingX - cursorOuterSize / 2,
    top: startingY - cursorOuterSize / 2,
    config: {
      tension: 300,
      friction: 50,
      mass: 0.5,
    },
  }));
  const cursorClickableInnerScale = useSpring({
    transform: isHovering ? `scale(5.3)` : `scale(1)`,
    config: {
      tension: 300,
      friction: 40,
      mass: 0.5,
    },
  });
  const cursorClickableOuterScale = useSpring({
    transform: isHovering ? `scale(0)` : `scale(1)`,
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
      const elementsMouseIsOver = document.elementsFromPoint(clientX, clientY);
      const isClickable = elementsMouseIsOver.some((elem) =>
        clickables.includes(elem.tagName),
      );
      setIsHovering(isClickable);
      setIsVisible(true);
    },
    [setCursorOuterPosition, setCursorPosition, cursorOuterSize, clickables],
  );

  const onMouseExitViewport = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseover", manageMouseMove);
    window.addEventListener("mouseout", onMouseExitViewport);

    return () => {
      window.removeEventListener("mouseover", manageMouseMove);
      window.removeEventListener("mousemove", manageMouseMove);
      window.removeEventListener("mouseout", onMouseExitViewport);
    };
  }, [manageMouseMove, onMouseExitViewport]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchdevice(window.matchMedia("(hover: none)").matches);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "object" && !showSystemCursor) {
      document.body.style.cursor = "none";
      inject(noCursorStyles);
    } else {
      remove();
    }
  }, [showSystemCursor, inject, noCursorStyles, remove]);

  if (isTouchdevice) {
    return <></>;
  }

  return (
    <>
      <a.div
        className="fixed pointer-events-none rounded-full bg-[var(--cursor-color)] z-50 mix-blend-difference"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          ...visibility,
          ...cursorPosition,
          ...cursorClickableInnerScale,
        }}
      ></a.div>
      <a.div
        className="fixed pointer-events-none border-2 rounded-full border-[var(--cursor-color)] z-50 mix-blend-color-dodge"
        style={{
          width: `${cursorOuterSize}px`,
          height: `${cursorOuterSize}px`,
          ...visibility,
          ...cursorOuterPosition,
          ...cursorClickableOuterScale,
        }}
      ></a.div>
    </>
  );
}
