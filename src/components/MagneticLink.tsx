"use client";
import { cn } from "@/lib/utils";
import { useCursorStore } from "@/store/cursorStore";
import { a, to, useSpring } from "@react-spring/web";
import React, { AnchorHTMLAttributes, useRef, useState } from "react";

export type MagneticLinkProps = {
  children?: React.ReactNode;
  hoverIcon?: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;
export default function MagneticLink({
  children,
  className,
  hoverIcon,
  ...rest
}: MagneticLinkProps) {
  const setCursorIcon = useCursorStore((state) => state.setIcon);
  const [isHovered, setHovered] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [cursorPosition, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: {
      tension: 300,
      friction: 20,
      mass: 1,
    },
  }));

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (!linkRef.current || !isHovered) return;

    const rect = linkRef.current.getBoundingClientRect();
    const linkCenterX = rect.left + rect.width / 2;
    const linkCenterY = rect.top + rect.height / 2;

    const offsetX = e.clientX - linkCenterX;
    const offsetY = e.clientY - linkCenterY;

    api.start({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    api.start({ x: 0, y: 0 });
  };
  const handleMouseEnter = () => {
    setHovered(true);
    setCursorIcon(hoverIcon);
  };

  return (
    <a.a
      ref={linkRef}
      className="group py-4 px-2 -my-4 -mx-2 pointer-events-auto inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: to(
          [cursorPosition.x, cursorPosition.y],
          (x, y) => `translate3d(${x}px, ${y}px, 0)`,
        ),
      }}
      {...rest}
    >
      <div
        className={cn(
          "relative transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:bg-foreground before:origin-center before:h-[1px] before:w-[50%] group-hover:before:w-0 before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-500 after:absolute after:bg-foreground after:origin-center after:h-[1px] after:w-[50%] group-hover:after:w-0 after:bottom-0 after:right-[50%]",
          className,
        )}
      >
        {children}
      </div>
    </a.a>
  );
}
