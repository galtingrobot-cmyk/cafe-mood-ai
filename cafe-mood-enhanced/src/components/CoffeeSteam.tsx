"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SteamParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 120;

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start near bottom center, spread a bit
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2.5;
      positions[i * 3 + 1] = Math.random() * -4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = 0.012 + Math.random() * 0.015;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      lifetimes[i] = Math.random();
    }
    return { positions, velocities, lifetimes };
  }, []);

  const posRef = useRef(positions.slice());
  const lifeRef = useRef(lifetimes.slice());

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    const opacities = meshRef.current.geometry.attributes.opacity?.array as Float32Array;

    for (let i = 0; i < count; i++) {
      lifeRef.current[i] += 0.004;

      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wavy drift
      pos[i * 3 + 0] += Math.sin(lifeRef.current[i] * 3 + i) * 0.003;

      if (opacities) {
        const life = lifeRef.current[i] % 1;
        opacities[i] = life < 0.3
          ? life / 0.3
          : life > 0.7
          ? (1 - life) / 0.3
          : 1;
      }

      // Reset when particle reaches top
      if (lifeRef.current[i] > 1) {
        lifeRef.current[i] = 0;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 2.5;
        pos[i * 3 + 1] = -4 + (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    if (opacities) meshRef.current.geometry.attributes.opacity.needsUpdate = true;
  });

  const opacityArray = useMemo(() => new Float32Array(count).fill(1), []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacityArray, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f5e6c8"
        size={0.12}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CoffeeSteam() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <SteamParticles />
      </Canvas>
    </div>
  );
}
