import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MuseumItem from './MuseumItem'
import SceneDecor from './SceneDecor'
import './styles.css'

const MODELS = [
  { id: 0, path: '/taqiya.glb', angle: 0, name: 'Taqiya' },
  { id: 1, path: '/shapan.glb', angle: Math.PI / 2, name: 'Shapan' },
  { id: 2, path: '/dombra.glb', angle: Math.PI, name: 'Dombra' },
  { id: 3, path: '/asyq.glb', angle: (Math.PI * 3) / 2, name: 'Asyq' },
]

function FloatingParticles() {
  const pointsRef = useRef()

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < 90; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 18,
        y: Math.random() * 8 + 0.5,
        z: (Math.random() - 0.5) * 16,
        size: Math.random() * 0.05 + 0.015,
        speed: Math.random() * 0.4 + 0.15,
      })
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()

    for (let i = 0; i < pointsRef.current.children.length; i++) {
      const p = pointsRef.current.children[i]
      const base = particles[i]
      p.position.y = base.y + Math.sin(t * base.speed + i) * 0.18
      p.material.opacity = 0.25 + (Math.sin(t * 1.5 + i) + 1) * 0.12
    }
  })

  return (
    <group ref={pointsRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 10, 10]} />
          <meshBasicMaterial color="#f6d36a" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function ActiveAura({ activeId }) {
  const ringRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const visible = activeId !== null

    if (ringRef.current) {
      ringRef.current.visible = visible
      ringRef.current.rotation.z += 0.003
      const s = 1 + Math.sin(t * 2) * 0.03
      ringRef.current.scale.setScalar(s)
    }

    if (glowRef.current) {
      glowRef.current.visible = visible
      glowRef.current.material.opacity = 0.1 + (Math.sin(t * 2.4) + 1) * 0.04
    }
  })

  return (
    <>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.33, 0]}>
        <ringGeometry args={[1.9, 2.35, 100]} />
        <meshBasicMaterial
          color="#ffe08a"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]}>
        <circleGeometry args={[2.1, 80]} />
        <meshBasicMaterial color="#ffd76d" transparent opacity={0.14} />
      </mesh>
    </>
  )
}

function CameraRig({ activeId }) {
  const { camera } = useThree()

  useFrame(() => {
    const target =
      activeId !== null
        ? new THREE.Vector3(0, 2.55, 10.2)
        : new THREE.Vector3(0, 2.9, 12.8)

    camera.position.lerp(target, 0.05)
    camera.lookAt(0, 0.2, 0)
  })

  return null
}

function Scene({ activeId, setActiveId }) {
  const activeIndex = MODELS.findIndex((m) => m.id === activeId)

  const slots = useMemo(
    () => [
      {
        position: [0, 0.55, 2.85],
        scale: 3.15,
        rotationY: 0,
      },
      {
        position: [6.0, 0.08, -0.55],
        scale: 1.5,
        rotationY: -0.42,
      },
      {
        position: [0.0, 0.0, -5.5],
        scale: 1.28,
        rotationY: 0.15,
      },
      {
        position: [-6.0, 0.08, -0.55],
        scale: 1.5,
        rotationY: 0.42,
      },
    ],
    []
  )

  return (
    <>
      <fog attach="fog" args={['#08040d', 10, 32]} />

      <ambientLight intensity={0.52} />
      <hemisphereLight args={['#ffe7ab', '#11091c', 0.8]} />
      <directionalLight
        position={[6, 9, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 4, 2]} intensity={1.4} color="#f7d16d" />
      <pointLight position={[-6, 2, -5]} intensity={0.35} color="#7c58ff" />
      <pointLight position={[6, 2, -5]} intensity={0.35} color="#b167ff" />
      <spotLight
        position={[0, 8, 3]}
        angle={0.34}
        penumbra={0.9}
        intensity={2.2}
        color="#ffe8a3"
      />

      <SceneDecor />
      <FloatingParticles />
      <ActiveAura activeId={activeId} />

      {MODELS.map((item, index) => (
        <MuseumItem
          key={item.id}
          item={item}
          index={index}
          activeId={activeId}
          activeIndex={activeIndex}
          total={MODELS.length}
          setActiveId={setActiveId}
          slots={slots}
        />
      ))}

      <ContactShadows
        position={[0, -1.47, 0]}
        opacity={0.52}
        scale={19}
        blur={3.4}
        far={13}
        color="#000000"
      />

      <Environment preset="night" />
      <CameraRig activeId={activeId} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.15}
        maxPolarAngle={Math.PI / 2.02}
      />
    </>
  )
}
export default function App() {
  const [activeId, setActiveId] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioRef = useRef(null)

  const activeModel = MODELS.find((m) => m.id === activeId)

  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioRef.current) return
      try {
        audioRef.current.volume = 0.4
        await audioRef.current.play()
        setAudioEnabled(true)
      } catch (error) {
        console.log('Audio autoplay blocked until user interaction:', error)
      }
    }

    const handleFirstInteraction = () => {
      unlockAudio()
      window.removeEventListener('click', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
    }
  }, [])

  const toggleAudio = async () => {
    if (!audioRef.current) return

    if (audioEnabled) {
      audioRef.current.pause()
      setAudioEnabled(false)
    } else {
      try {
        await audioRef.current.play()
        setAudioEnabled(true)
      } catch (error) {
        console.log('Cannot play audio:', error)
      }
    }
  }

  return (
    <div className="appShell">
      <div className="screenGlow screenGlowTop" />
      <div className="screenGlow screenGlowBottom" />

      <audio ref={audioRef} loop preload="auto">
        <source src="/kui.mp3" type="audio/mpeg" />
      </audio>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2.9, 12.8], fov: 40 }}
        onPointerMissed={() => setActiveId(null)}
      >
        <Suspense fallback={null}>
          <Scene activeId={activeId} setActiveId={setActiveId} />
        </Suspense>
      </Canvas>

      <div className="uiFrame" />
      <div className="vignette" />

      <div className="musicControl">
        <button
          className={`glassButton ${audioEnabled ? 'active' : ''}`}
          onClick={toggleAudio}
        >
          {audioEnabled ? '♪ Sound On' : '♪ Sound Off'}
        </button>
      </div>

      <div className={`artifactLabel ${activeModel ? 'show' : ''}`}>
        <div className="artifactLabelInner">
          <div className="artifactLine" />
          <div className="artifactTitle">
            {activeModel ? activeModel.name : ''}
          </div>
          <div className="artifactSubtitle">
            {activeModel ? 'Kazakh cultural heritage object' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}