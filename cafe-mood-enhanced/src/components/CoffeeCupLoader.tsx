"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CupScene() {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const steamGroup = useRef<THREE.Group>(null);

  // Steam particles
  const steamCount = 30;
  const steamData = useMemo(() => {
    return Array.from({ length: steamCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4,
      speed: 0.008 + Math.random() * 0.006,
      phase: (i / steamCount) * Math.PI * 2,
      wobble: Math.random() * 2,
      size: 0.04 + Math.random() * 0.06,
    }));
  }, []);

  const steamRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Gentle float
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.05;
      // Very slow auto-rotate
      groupRef.current.rotation.y = t * 0.4;
    }

    if (liquidRef.current) {
      // Liquid shimmer
      (liquidRef.current.material as THREE.MeshStandardMaterial).roughness =
        0.05 + Math.sin(t * 2) * 0.03;
    }

    // Animate steam
    steamRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = steamData[i];
      const life = ((t * d.speed * 60 + d.phase) % (Math.PI * 2)) / (Math.PI * 2);
      mesh.position.y = 0.7 + life * 1.4;
      mesh.position.x = d.x + Math.sin(t * d.wobble + d.phase) * 0.1;
      mesh.position.z = d.z;
      const opacity = life < 0.3 ? life / 0.3 : life > 0.7 ? (1 - life) / 0.3 : 1;
      (mesh.material as THREE.MeshStandardMaterial).opacity = opacity * 0.45;
      const scale = 0.5 + life * 1.5;
      mesh.scale.setScalar(scale);
    });
  });

  // Warm coffee colors
  const cupMat = new THREE.MeshStandardMaterial({
    color: "#c8a97e",
    roughness: 0.25,
    metalness: 0.05,
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: "#f5e6c8",
    roughness: 0.5,
    metalness: 0,
  });
  const liquidMat = new THREE.MeshStandardMaterial({
    color: "#2c1008",
    roughness: 0.08,
    metalness: 0.1,
  });
  const saucerMat = new THREE.MeshStandardMaterial({
    color: "#d4b896",
    roughness: 0.3,
    metalness: 0.05,
  });
  const steamMat = new THREE.MeshStandardMaterial({
    color: "#fffaf4",
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Saucer ── */}
      <mesh position={[0, -0.75, 0]} material={saucerMat} receiveShadow>
        <cylinderGeometry args={[1.15, 1.0, 0.09, 48]} />
      </mesh>
      {/* Saucer rim groove */}
      <mesh position={[0, -0.72, 0]} material={saucerMat}>
        <torusGeometry args={[0.85, 0.03, 8, 48]} />
      </mesh>
      {/* Saucer cup-rest indent */}
      <mesh position={[0, -0.70, 0]} material={saucerMat}>
        <cylinderGeometry args={[0.5, 0.55, 0.05, 32]} />
      </mesh>

      {/* ── Cup body (outer) ── */}
      <mesh position={[0, 0, 0]} material={cupMat} castShadow>
        <cylinderGeometry args={[0.58, 0.42, 1.5, 48, 1, true]} />
      </mesh>
      {/* Cup bottom disc */}
      <mesh position={[0, -0.75, 0]} material={cupMat}>
        <cylinderGeometry args={[0.42, 0.42, 0.01, 32]} />
      </mesh>
      {/* Cup inner wall */}
      <mesh position={[0, 0.05, 0]} material={innerMat}>
        <cylinderGeometry args={[0.52, 0.40, 1.3, 48, 1, true]} />
      </mesh>

      {/* ── Top rim ring ── */}
      <mesh position={[0, 0.76, 0]} material={cupMat}>
        <torusGeometry args={[0.58, 0.05, 16, 48]} />
      </mesh>

      {/* ── Coffee liquid surface ── */}
      <mesh ref={liquidRef} position={[0, 0.55, 0]} material={liquidMat}>
        <cylinderGeometry args={[0.52, 0.52, 0.06, 48]} />
      </mesh>
      {/* Crema ring */}
      <mesh position={[0, 0.59, 0]}>
        <torusGeometry args={[0.3, 0.12, 8, 48]} />
        <meshStandardMaterial color="#7c4a1e" roughness={0.9} />
      </mesh>

      {/* ── Handle ── */}
      <mesh position={[0.72, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} material={cupMat} castShadow>
        <torusGeometry args={[0.27, 0.055, 16, 32, Math.PI * 1.1]} />
      </mesh>

      {/* ── Steam particles ── */}
      <group ref={steamGroup}>
        {steamData.map((d, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) steamRefs.current[i] = el; }}
            position={[d.x, 0.7, d.z]}
            material={steamMat.clone()}
          >
            <sphereGeometry args={[d.size, 6, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function CoffeeCupLoader() {
  return (
    <div style={{ width: 200, height: 220 }}>
      <Canvas
        camera={{ position: [2.2, 1.4, 2.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: "transparent" }}
        shadows
      >
        {/* Warm studio lighting */}
        <ambientLight intensity={0.5} color="#fff8f0" />
        <directionalLight
          position={[3, 5, 4]}
          intensity={2.5}
          color="#ffd9a0"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <pointLight position={[-3, 2, -2]} intensity={0.8} color="#c8a97e" />
        <pointLight position={[0, -1, 3]} intensity={0.3} color="#ffffff" />

        <CupScene />

        <ContactShadows
          position={[0, -0.78, 0]}
          opacity={0.4}
          scale={3}
          blur={1.5}
          far={1}
          color="#7c4a1e"
        />
      </Canvas>
    </div>
  );
}
