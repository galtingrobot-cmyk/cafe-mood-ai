"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Cup() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.5;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Saucer */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1, 0.1, 32]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.1} />
      </mesh>
      
      {/* Cup Body */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.8, 1.4, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      
      {/* Cup Handle */}
      <mesh position={[1.2, 0.7, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow receiveShadow>
        <torusGeometry args={[0.4, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      
      {/* Liquid */}
      <mesh position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 32]} />
        <meshStandardMaterial color="#3b2818" roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function CoffeeCupLoader() {
  return (
    <div className="w-64 h-64 mx-auto">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <Cup />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={5} blur={2} far={4} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
