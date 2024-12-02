"use client";
import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#c0a0a0",
  emissive: "red",
});
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const baubles = [...Array(40)].map(() => ({
  scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)],
}));

function Bauble({
  vec = new THREE.Vector3(),
  scale = 1,
  r = THREE.MathUtils.randFloatSpread,
}) {
  const api = useRef<RapierRigidBody>(null);
  useFrame((state, delta) => {
    if (api.current) {
      delta = Math.min(0.1, delta);
      api.current.applyImpulse(
        vec
          .copy(api.current.translation())
          .normalize()
          .multiply({
            x: -50 * delta * scale,
            y: -150 * delta * scale,
            z: -50 * delta * scale,
          }),
        true,
      );
    }
  });
  return (
    <RigidBody
      linearDamping={1}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={baubleMaterial}
      >
        <MeshDistortMaterial distort={0.2} speed={1} />
      </mesh>
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport }) => {
    vec.lerp(
      {
        x: (pointer.x * viewport.width) / 2,
        y: (pointer.y * viewport.height) / 2,
        z: 0,
      },
      0.2,
    );
    ref.current?.setNextKinematicTranslation(vec);
  });
  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

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
      gl={{ alpha: true, stencil: false, depth: true, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 35.5, near: 1, far: 100 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
    >
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="red" />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {
          baubles.map((props, i) => <Bauble key={i} {...props} />) /* prettier-ignore */
        }
      </Physics>
      <Environment files="/adamsbridge.hdr" />
      <EffectComposer enableNormalPass={false}>
        {/* <Fluid blendFunction={BlendFunction.ALPHA} /> */}
        <N8AO color="red" aoRadius={2} intensity={1.15} />
      </EffectComposer>
    </Canvas>
  );
}
