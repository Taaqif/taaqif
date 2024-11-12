"use client";

import { useRef, useEffect } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

export default function FluidContainer() {
  const containerRef = useRef(null);
  //https://webgl-fluid-enhanced.michaelbrusegard.com/play?colorPalette=%2300FFFF,%2300DBFF,%2310A5F5,%230C71E0,%230859C6&brightness=0.6&velocityDissipation=1&pressure=0.5&pressureIterations=10&curl=0.5&shading=false&splatRadius=0.125&splatForce=9000&sunrays=false
  useEffect(() => {
    if (!containerRef.current) return;
    const simulation = new WebGLFluidEnhanced(containerRef.current);
    simulation.setConfig({
      colorPalette: ["#00FFFF", "#00DBFF", "#10A5F5", "#0C71E0", "#0859C6"],
      backgroundColor: "#000000",
      densityDissipation: 1,
      colorUpdateSpeed: 10,
      hover: true,
      brightness: 0.6,
      velocityDissipation: 1,
      pressure: 0.2,
      pressureIterations: 20,
      curl: 0.1,
      splatRadius: 0.125,
      splatForce: 5000,
      transparent: true,
      bloom: false,
      sunrays: false,
    });
    simulation.start();

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="!fixed top-0 left-0 w-screen h-screen pointer-events-none"
    />
  );
}
