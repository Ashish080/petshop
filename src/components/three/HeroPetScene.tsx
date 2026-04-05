'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, MeshTransmissionMaterial, Torus, Sphere, Box } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

function PawPrint({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;
    t.current += 0.008;
    meshRef.current.position.y = position[1] + Math.sin(t.current) * 0.15;
    meshRef.current.rotation.z = Math.sin(t.current * 0.4) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} scale={0.18}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#FF7A00" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function OrbitRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 12, 80]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} transparent opacity={0.6} />
    </mesh>
  );
}

function MainOrb() {
  const group = useRef<Group>(null);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => { scroll.current = window.scrollY; };
    const onPointer = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const sy = scroll.current * 0.0012;
    group.current.rotation.y = sy + t * 0.08;
    group.current.rotation.x = pointer.current.y * 0.18 + Math.sin(t * 0.35) * 0.04;
    group.current.rotation.z = pointer.current.x * 0.14 + Math.cos(t * 0.28) * 0.03;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group}>
        {/* Core distorted sphere */}
        <mesh castShadow scale={1.25}>
          <icosahedronGeometry args={[1.1, 2]} />
          <MeshDistortMaterial
            color="#FF7A00"
            roughness={0.1}
            metalness={0.5}
            envMapIntensity={1.5}
            distort={0.25}
            speed={1.8}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh scale={0.88}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshStandardMaterial
            color="#FF9A3C"
            roughness={0.05}
            metalness={0.2}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbiting ring 1 */}
        <OrbitRing radius={1.85} speed={0.25} color="#FF7A00" />
        {/* Orbiting ring 2 */}
        <OrbitRing radius={2.1} speed={-0.18} color="#5eb8a8" />

        {/* Floating accent spheres */}
        <mesh position={[0.95, -0.6, 0.4]} scale={0.32}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#5eb8a8" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[-0.75, 0.55, -0.5]} scale={0.22}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#8ec5ff" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0.35, 0.95, 0.65]} scale={0.18}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#ffd6a5" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Paw-like small orbs */}
        <PawPrint position={[1.4, 0.1, 0.2]} />
        <PawPrint position={[-1.2, -0.3, 0.5]} />
        <PawPrint position={[0.2, -1.3, 0.1]} />
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 10, 6]} intensity={1.4} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#7EC8B8" />
      <pointLight position={[2, 2, 3]} intensity={1.2} color="#FF7A00" distance={8} />
      <MainOrb />
      <Environment preset="city" />
    </>
  );
}

function HeroPetCanvas() {
  return (
    <div className="relative h-[min(55vh,420px)] w-full md:h-[min(62vh,520px)]">
      <Canvas
        className="touch-none"
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default HeroPetCanvas;
