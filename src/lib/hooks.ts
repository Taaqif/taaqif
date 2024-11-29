"use client";
import { useEffect, useState } from "react";

export const useIsTouchDevice = () => {
  const [isTouchdevice, setIsTouchdevice] = useState<boolean>();
  useEffect(() => {
    setIsTouchdevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchdevice;
};
