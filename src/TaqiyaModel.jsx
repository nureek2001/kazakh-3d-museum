import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export default function TaqiyaModel({ expanded }) {
  const { scene } = useGLTF('/taqiya.glb');
  const modelRef = useRef();

  useFrame(() => {
    if (!modelRef.current) return;

    const targetScale = expanded ? 0.72 : 0.32;

    modelRef.current.scale.x += (targetScale - modelRef.current.scale.x) * 0.08;
    modelRef.current.scale.y += (targetScale - modelRef.current.scale.y) * 0.08;
    modelRef.current.scale.z += (targetScale - modelRef.current.scale.z) * 0.08;

    if (expanded) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0.8, -0.9, 0]}
    />
  );
}

useGLTF.preload('/taqiya.glb');