"use client";
import { to, useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { a } from "@react-spring/web";
import { useInjectStyle } from "use-inject-style";
import { ArrowUpRight } from "lucide-react";
import { useCursorStore } from "@/store/cursorStore";
import { useIsTouchDevice } from "@/lib/hooks";

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
  const cursorIcon = useCursorStore((state) => state.icon);
  const noCursorStyles = useMemo(
    () => `${clickables?.join(",")} {cursor: none}`,
    [clickables],
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isTouchdevice = useIsTouchDevice();

  const startingX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const startingY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const [cursorPosition, setCursorPosition] = useSpring(() => ({
    x: startingX - cursorSize / 2,
    y: startingY - cursorSize / 2,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  }));
  const [cursorOuterPosition, setCursorOuterPosition] = useSpring(() => ({
    x: startingX - cursorOuterSize / 2,
    y: startingY - cursorOuterSize / 2,
    config: {
      tension: 300,
      friction: 50,
      mass: 0.5,
    },
  }));
  const cursorClickableInnerScale = useSpring({
    scale: isHovering ? 5.3 : 1,
    config: {
      tension: 300,
      friction: 40,
      mass: 0.5,
    },
  });
  const cursorClickableOuterScale = useSpring({
    scale: isHovering ? 0 : 1,
    config: {
      tension: 300,
      friction: 40,
      mass: 0.5,
    },
  });
  const cursorClickableIconScale = useSpring({
    scale: isHovering ? 4 : 0,
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
        x: clientX - cursorSize / 2,
        y: clientY - cursorSize / 2,
      });
      setCursorOuterPosition.start({
        x: clientX - cursorOuterSize / 2,
        y: clientY - cursorOuterSize / 2,
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
        className="fixed top-0 left-0 pointer-events-none rounded-full bg-[var(--cursor-color)] z-50 mix-blend-difference"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          ...visibility,
          transform: to(
            [
              cursorPosition.x,
              cursorPosition.y,
              cursorClickableInnerScale.scale,
            ],
            (x, y, scale) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          ),
        }}
      ></a.div>
      <a.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-overlay flex items-center justify-center"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          ...visibility,
          transform: to(
            [
              cursorPosition.x,
              cursorPosition.y,
              cursorClickableIconScale.scale,
            ],
            (x, y, scale) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          ),
        }}
      >
        {cursorIcon ?? <ArrowUpRight />}
      </a.div>
      <a.div
        className="fixed top-0 left-0 pointer-events-none border-2 rounded-full border-[var(--cursor-color)] z-50 mix-blend-color-dodge"
        style={{
          width: `${cursorOuterSize}px`,
          height: `${cursorOuterSize}px`,
          ...visibility,
          transform: to(
            [
              cursorOuterPosition.x,
              cursorOuterPosition.y,
              cursorClickableOuterScale.scale,
            ],
            (x, y, scale) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          ),
        }}
      ></a.div>
    </>
  );
}
