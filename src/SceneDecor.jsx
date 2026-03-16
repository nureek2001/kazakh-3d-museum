import React from 'react'

function OrnamentWall({ position, width, height, accent = '#c99a58' }) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#2a1713" roughness={0.95} metalness={0.03} />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 0.88, height * 0.86]} />
        <meshStandardMaterial color="#20110f" roughness={0.96} metalness={0.02} />
      </mesh>

      <mesh position={[0, height * 0.33, 0.02]}>
        <planeGeometry args={[width * 0.56, 0.08]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.25} />
      </mesh>

      <mesh position={[0, -height * 0.33, 0.02]}>
        <planeGeometry args={[width * 0.56, 0.08]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.25} />
      </mesh>

      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[0.34, 0.58, 4]} />
        <meshStandardMaterial color={accent} roughness={0.46} metalness={0.3} />
      </mesh>

      <mesh position={[-0.9, 0, 0.03]}>
        <ringGeometry args={[0.12, 0.24, 4]} />
        <meshStandardMaterial color={accent} roughness={0.46} metalness={0.3} />
      </mesh>

      <mesh position={[0.9, 0, 0.03]}>
        <ringGeometry args={[0.12, 0.24, 4]} />
        <meshStandardMaterial color={accent} roughness={0.46} metalness={0.3} />
      </mesh>
    </group>
  )
}

function ArchFrame({ position, width }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[width, 0.22, 0.5]} />
        <meshStandardMaterial color="#8c6230" roughness={0.55} metalness={0.22} />
      </mesh>
      <mesh position={[-width / 2 + 0.18, 0, 0]}>
        <boxGeometry args={[0.36, 4.2, 0.5]} />
        <meshStandardMaterial color="#56372a" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[width / 2 - 0.18, 0, 0]}>
        <boxGeometry args={[0.36, 4.2, 0.5]} />
        <meshStandardMaterial color="#56372a" roughness={0.82} metalness={0.08} />
      </mesh>
    </group>
  )
}

export default function SceneDecor() {
  return (
    <>
      <mesh position={[0, 2.6, -8.1]}>
        <planeGeometry args={[20, 13.2]} />
        <meshStandardMaterial color="#241410" roughness={0.97} metalness={0.02} />
      </mesh>

      <ArchFrame position={[0, 1.6, -3.7]} width={11.8} />
      <OrnamentWall position={[0, 2.25, -7.85]} width={11.0} height={6.2} accent="#d7ab67" />

      <mesh position={[0, 5.9, -6.6]}>
        <boxGeometry args={[13.5, 0.2, 0.2]} />
        <meshStandardMaterial color="#b58241" roughness={0.55} metalness={0.22} />
      </mesh>

      <mesh position={[0, 3.35, -6.35]}>
        <boxGeometry args={[14.5, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#e0b774"
          emissive="#87561f"
          emissiveIntensity={0.22}
          roughness={0.46}
          metalness={0.28}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <meshStandardMaterial color="#1a1110" roughness={0.98} metalness={0.02} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.56, 0.1]}>
        <planeGeometry args={[12.4, 5.6]} />
        <meshStandardMaterial
          color="#4d2a23"
          emissive="#8d5d28"
          emissiveIntensity={0.12}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>

      <mesh position={[0, 1.3, -2.15]}>
        <planeGeometry args={[9.8, 5.5]} />
        <meshBasicMaterial color="#ffd48b" transparent opacity={0.08} />
      </mesh>
    </>
  )
}