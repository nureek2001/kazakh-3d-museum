import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function SceneDecor() {
  const logoTexture = useLoader(THREE.TextureLoader, '/logo.png')
  const yurtTexture = useLoader(THREE.TextureLoader, '/yurt-inside.jpg')

  logoTexture.colorSpace = THREE.SRGBColorSpace
  yurtTexture.colorSpace = THREE.SRGBColorSpace

  return (
    <>
      {/* Фон юрты: теперь ближе, больше и точно виден */}
      <mesh position={[0, 5.2, -15]}>
        <planeGeometry args={[46, 26]} />
        <meshBasicMaterial map={yurtTexture} />
      </mesh>

      {/* Основное тёмное наложение */}
      <mesh position={[0, 5.2, -14.95]}>
        <planeGeometry args={[46, 26]} />
        <meshBasicMaterial color="#0b0710" transparent opacity={0.38} />
      </mesh>

      {/* Верхнее затемнение */}
      <mesh position={[0, 11.4, -14.9]}>
        <planeGeometry args={[46, 8]} />
        <meshBasicMaterial color="#040308" transparent opacity={0.42} />
      </mesh>

      {/* Нижнее затемнение */}
      <mesh position={[0, -1.9, -14.88]}>
        <planeGeometry args={[46, 8]} />
        <meshBasicMaterial color="#07040b" transparent opacity={0.34} />
      </mesh>

      {/* Тёплое свечение в центре */}
      <mesh position={[0, 3.5, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#d2a239" transparent opacity={0.08} />
      </mesh>

      {/* Фиолетовый depth glow */}
      <mesh position={[0, 5.1, -11]}>
        <planeGeometry args={[30, 14]} />
        <meshBasicMaterial color="#5f2faa" transparent opacity={0.05} />
      </mesh>

      {/* Платформа */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <circleGeometry args={[9.2, 140]} />
        <meshStandardMaterial color="#efedf5" roughness={0.9} metalness={0.04} />
      </mesh>

      {/* Тёмная внешняя тень */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.515, 0]}>
        <ringGeometry args={[9.2, 9.9, 160]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>

      {/* Логотип */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.468, 0]}>
        <circleGeometry args={[6.18, 140]} />
        <meshStandardMaterial map={logoTexture} roughness={0.74} metalness={0.08} />
      </mesh>

      {/* Белое кольцо */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.462, 0]}>
        <ringGeometry args={[6.18, 6.32, 160]} />
        <meshStandardMaterial color="#f8f6fb" roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Золотое кольцо */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.458, 0]}>
        <ringGeometry args={[6.36, 6.78, 180]} />
        <meshStandardMaterial
          color="#d8cb69"
          emissive="#7a6518"
          emissiveIntensity={0.24}
          roughness={0.35}
          metalness={0.42}
        />
      </mesh>

      {/* Световое кольцо */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <ringGeometry args={[6.9, 7.12, 180]} />
        <meshBasicMaterial color="#ffe38b" transparent opacity={0.1} />
      </mesh>

      {/* Центральный мягкий свет */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.448, 0]}>
        <circleGeometry args={[2.1, 100]} />
        <meshBasicMaterial color="#fff0b5" transparent opacity={0.07} />
      </mesh>
    </>
  )
}