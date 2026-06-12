"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Wave() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={15}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#8B5A2B"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 5, 2]} intensity={2} />
        <Wave />
      </Canvas>
    </div>
  );
}
