import { UseTrailProps } from "@react-spring/web";
import React from "react";

export type RollRevealProps = {
  children: React.ReactNode;
  explode?: "characters" | "words";
  trailChildrenClassName?: React.ComponentProps<"div">["className"];
} & UseTrailProps;
export default function RollReveal({ children }: RollRevealProps) {
  return <div>{children}</div>;
}
