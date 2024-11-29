"use client";
import { useTrail, animated as a, UseTrailProps } from "@react-spring/web";
import React, { ReactElement } from "react";

const splitWords = (child: React.ReactNode, mode: "words" | "characters") => {
  if (typeof child === "string") {
    if (mode === "words") {
      return child
        .split(" ")
        .map((word, index) => <span key={`word-${index}`}>{word}</span>);
    }
    if (mode === "characters") {
      return child.split("").map((char, index) => (
        <span key={`char-${index}`}>
          {char === " " ? "\u00A0" : char} {/* Preserve spaces */}
        </span>
      ));
    }
  }
  return child; // Preserve React elements
};

export type StaggerRevealProps = {
  children: React.ReactNode;
  explode?: "characters" | "words";
  trailChildrenClassName?: React.ComponentProps<"div">["className"];
} & UseTrailProps;

export default function StaggerReveal({
  children,
  explode = "words",
  trailChildrenClassName,
  ...trailProps
}: StaggerRevealProps) {
  const childArray = React.Children.toArray(children).flatMap((child) =>
    splitWords(child, explode),
  );

  const trailS = useTrail(childArray.length, {
    config: { mass: 1, tension: 210, friction: 20 },
    ...trailProps,
  });
  return (
    <>
      {trailS.map((spring, index) => {
        const elementType = (childArray[index] as ReactElement)?.type as string;
        // Ignore certain element types from being animated
        if (elementType && ["br", "hr"].includes(elementType)) {
          return childArray[index];
        }
        return (
          <a.div
            key={index}
            className={trailChildrenClassName}
            style={{
              ...spring,
            }}
          >
            {childArray[index]}
          </a.div>
        );
      })}
    </>
  );
}
