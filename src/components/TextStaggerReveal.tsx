"use client";
import { useTrail, animated as a, UseTrailProps } from "@react-spring/web";
import React, { ReactElement } from "react";

function expandTextNode(
  node: React.ReactNode,
  stringSplit: string = "",
): React.ReactNode[] {
  if (typeof node === "string") {
    return node.split(stringSplit).map((char) => char);
  }

  if (React.isValidElement(node)) {
    // If it's a self-closing element (like <br />), return it as-is
    if (typeof node.type === "string" && node.props.children === undefined) {
      return [node];
    }
    // Recursively process the children of the React element
    const children = node.props.children;
    const expandedChildren = Array.isArray(children)
      ? children.flatMap((nodes) => expandTextNode(nodes, stringSplit))
      : expandTextNode(children, stringSplit);

    // Re-create the element with expanded children
    return [React.cloneElement(node, { key: node.key }, expandedChildren)];
  }

  if (Array.isArray(node)) {
    return node.flatMap((nodes) => expandTextNode(nodes, stringSplit));
  }

  // Return the node as-is if it's not a string, React element, or array
  return [node];
}

export type TextStaggerRevealProps = {
  children: React.ReactNode;
  explode?: "characters" | "words";
  trailChildrenClassName?: React.ComponentProps<"div">["className"];
} & UseTrailProps;

export default function TextStaggerReveal({
  children,
  explode,
  trailChildrenClassName,
  ...trailProps
}: TextStaggerRevealProps) {
  const expandedContent = !!explode
    ? expandTextNode(children, explode === "words" ? " " : "")
    : React.Children.toArray(children);
  const trailS = useTrail(expandedContent.length, {
    config: { mass: 1, tension: 210, friction: 20 },
    ...trailProps,
  });
  return (
    <>
      {trailS.map((spring, index) => {
        const elementType = (expandedContent[index] as ReactElement)
          ?.type as string;
        // Ignore certain element types from being animated
        if (elementType && ["br", "hr"].includes(elementType)) {
          return expandedContent[index];
        }
        return (
          <a.div
            key={index}
            className={trailChildrenClassName}
            style={{
              ...spring,
            }}
          >
            {expandedContent[index]}
          </a.div>
        );
      })}
    </>
  );
}
