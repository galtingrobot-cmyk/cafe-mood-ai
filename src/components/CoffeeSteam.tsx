"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 120;
  
  const [positions, phases] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 4;     // x
      p[i * 3 + 1] = Math.random() * 10 - 5;    // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 4; // z
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [p, ph];
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.02; // Move up
      pos[i * 3] += Math.sin(time + phases[i]) * 0.01; // Wavy x
      pos[i * 3 + 2] += Math.cos(time + phases[i]) * 0.01; // Wavy z
      
      // Reset if too high
      if (pos[i * 3 + 1] > 5) {
        pos[i * 3 + 1] = -5;
        pos[i * 3] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#D4A373"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CoffeeSteam() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
