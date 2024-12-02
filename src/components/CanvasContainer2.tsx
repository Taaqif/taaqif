"use client";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshDiscardMaterial,
  shaderMaterial,
} from "@react-three/drei";
import { Physics, useSphere } from "@react-three/cannon";
import {
  EffectComposer,
  N8AO,
  SMAA,
  TiltShift,
} from "@react-three/postprocessing";

const rfs = THREE.MathUtils.randFloatSpread;
// const sphereGeometry = new THREE.SphereGeometry(0.51, 32, 32);
const baubleMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  envMapIntensity: 1,
  color: "#c0a0a0",
  emissive: "red",
});

function Pointer() {
  const viewport = useThree((state) => state.viewport);
  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    type: "Kinematic",
    args: [3],
    position: [0, 0, 0],
  }));
  useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      0,
    ),
  );
  return (
    <mesh ref={ref} scale={0.6}>
      <sphereGeometry />
      <MeshDiscardMaterial />
      <pointLight intensity={8} distance={10} />
    </mesh>
  );
}

function Clump({
  mat = new THREE.Matrix4(),
  vec = new THREE.Vector3(),
  count = 40,
}) {
  // const scales = useMemo(
  //   () => Array.from({ length: count }, () => Math.random() * 1.5 + 0.5),
  //   [count],
  // );
  const [ref, api] = useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20) - 25, rfs(20) - 10],
  }));
  //eslint-disable-next-line
  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    // delta = Math.min(0.1, delta);
    for (let i = 0; i < count; i++) {
      // const scale = scales[i];
      // Get current whereabouts of the instanced sphere
      ref.current.getMatrixAt(i, mat);
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      // api.at(i).applyImpulse(
      //   vec
      //     .setFromMatrixPosition(mat)
      //     .normalize()
      //     .multiply({
      //       x: -50 * delta * scale,
      //       y: -150 * delta * scale,
      //       z: -50 * delta * scale,
      //     })
      //     .toArray(),
      //   [0, 0, 0],
      // );
      api.at(i).applyForce(
        vec
          .setFromMatrixPosition(mat)
          .normalize()
          .multiply({
            x: -50,
            y: -100,
            z: -50,
          })
          .toArray(),
        [0, 0, 0],
      );
    }
  });
  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      //@ts-expect-error null is valid
      args={[null, baubleMaterial, count]}
    >
      <sphereGeometry />
      {/* <MeshDistortMaterial distort={0.3} speed={1.5} /> */}
    </instancedMesh>
  );
}

// Define custom shader material
const MetaballMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(),
    uTime: 0,
    uBallPositions: Array(10).fill(new THREE.Vector3()),
    uBallRadii: Array(10).fill(0.0),
    uBallCount: 0,
  },
  `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`, // Vertex shader placeholder
  `#include "path/to/metaballShader.glsl"`, // Use the fragment shader here
);

// Extend for post-processing
extend({ MetaballMaterial });

export default function CanvasContainer() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      shadows
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
    >
      <ambientLight intensity={0.5} />
      <Physics gravity={[0, 2, 0]} iterations={10}>
        <Pointer />
        <Clump />
      </Physics>
      <Environment files="/adamsbridge.hdr" />
      <EffectComposer>
        <TiltShift feather={100} focusArea={0} />
        {/* <Fluid */}
        {/*   radius={0.3} */}
        {/*   curl={10} */}
        {/*   swirl={5} */}
        {/*   distortion={1} */}
        {/*   force={2} */}
        {/*   pressure={0.94} */}
        {/*   densityDissipation={0.98} */}
        {/*   velocityDissipation={0.99} */}
        {/*   intensity={0.3} */}
        {/*   rainbow={false} */}
        {/*   blend={0} */}
        {/*   showBackground={false} */}
        {/*   // fluidColor="#00DBFF" */}
        {/*   //           colorPalette: ["#00FFFF", "#00DBFF", "#10A5F5", "#0C71E0", "#0859C6"], */}
        {/*   // backgroundColor: "#000000", */}
        {/*   // densityDissipation: 1, */}
        {/*   // colorUpdateSpeed: 10, */}
        {/*   // hover: true, */}
        {/*   // brightness: 0.6, */}
        {/*   // velocityDissipation: 1, */}
        {/*   // pressure: 0.2, */}
        {/*   // pressureIterations: 20, */}
        {/*   // curl: 0.1, */}
        {/*   // splatRadius: 0.125, */}
        {/*   // splatForce: 5000, */}
        {/*   // transparent: true, */}
        {/*   // bloom: false, */}
        {/*   // sunrays: false, */}
        {/* /> */}
        <N8AO
          halfRes
          color="black"
          aoRadius={2}
          intensity={1}
          aoSamples={6}
          denoiseSamples={4}
        />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
