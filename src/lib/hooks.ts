"use client";
import { primaryInput } from "detect-it";

export const useIsTouchDevice = () => {
  return primaryInput === "touch";
};
