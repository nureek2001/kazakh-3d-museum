import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_CONFIG = {
  '/taqiya.glb': {
    normalizeSize: 1.15,
    baseScaleMultiplier: 1.1,
    activeScaleMultiplier: 2.8,
    sideScaleMultiplier: 0.9,
    baseYOffset: -0.18,
    activeYOffset: -0.08,
    sideYOffset: -0.2,
    activeZ: 0.9,
    baseRotationY: 0.08,
    labelY: -1.0,
  },
  '/saukele.glb': {
    normalizeSize: 1.45,
    baseScaleMultiplier: 1.0,
    activeScaleMultiplier: 2.8,
    sideScaleMultiplier: 0.88,
    baseYOffset: -0.08,
    activeYOffset: -1.5,
    sideYOffset: -0.08,
    activeZ: 0.92,
    baseRotationY: 0.06,
    labelY: -1.15,
  },
  '/shapan.glb': {
    normalizeSize: 1.55,
    baseScaleMultiplier: 1.0,
    activeScaleMultiplier: 2.9,
    sideScaleMultiplier: 0.88,
    baseYOffset: -0.02,
    activeYOffset: -1.5,
    sideYOffset: -0.04,
    activeZ: 0.95,
    baseRotationY: -0.08,
    labelY: -1.15,
  },
  '/dombra.glb': {
    normalizeSize: 1.75,
    baseScaleMultiplier: 1.0,
    activeScaleMultiplier: 2.8,
    sideScaleMultiplier: 0.88,
    baseYOffset: -0.02,
    activeYOffset: -1.5,
    sideYOffset: -0.04,
    activeZ: 0.95,
    baseRotationY: 0.05,
    labelY: -1.15,
  },
  '/qobyz.glb': {
    normalizeSize: 1.65,
    baseScaleMultiplier: 1.0,
    activeScaleMultiplier: 2.8,
    sideScaleMultiplier: 0.88,
    baseYOffset: -0.03,
    activeYOffset: -1.5,
    sideYOffset: -0.05,
    activeZ: 0.95,
    baseRotationY: 0.08,
    labelY: -1.15,
  },
  '/asyq.glb': {
    normalizeSize: 0.95,
    baseScaleMultiplier: 0.9,
    activeScaleMultiplier: 3.5,
    sideScaleMultiplier: 0.8,
    baseYOffset: -0.24,
    activeYOffset: -0.7,
    sideYOffset: -0.26,
    activeZ: 0.82,
    baseRotationY: 0.06,
    labelY: -0.8,
  },
  '/qamshy.glb': {
    normalizeSize: 1.45,
    baseScaleMultiplier: 1.0,
    activeScaleMultiplier: 2.9,
    sideScaleMultiplier: 0.86,
    baseYOffset: -0.08,
    activeYOffset: -0.8,
    sideYOffset: -0.1,
    activeZ: 0.9,
    baseRotationY: 0.18,
    labelY: -1.05,
  },
  '/yurt.glb': {
    normalizeSize: 1.9,
    baseScaleMultiplier: 0.92,
    activeScaleMultiplier: 2.7,
    sideScaleMultiplier: 0.72,
    baseYOffset: -0.28,
    activeYOffset: 0,
    sideYOffset: -0.34,
    activeZ: 0.55,
    baseRotationY: 0.04,
    labelY: -1.4,
  },
  '/kamzol.glb': {
    normalizeSize: 1.8,
    baseScaleMultiplier: 0.9,
    activeScaleMultiplier: 2.3,
    sideScaleMultiplier: 0.82,
    baseYOffset: -0.18,
    activeYOffset: -0.6,
    sideYOffset: -0.2,
    activeZ: 0.9,
    baseRotationY: 0.08,
    labelY: -1.1,
  },
  '/sedlo.glb': {
    normalizeSize: 1.7,
    baseScaleMultiplier: 0.9,
    activeScaleMultiplier: 2.4,
    sideScaleMultiplier: 0.82,
    baseYOffset: -0.18,
    activeYOffset: -0.9,
    sideYOffset: -0.2,
    activeZ: 0.85,
    baseRotationY: 0.12,
    labelY: -1.1,
  },
  '/chest_lootbox.glb': {
    normalizeSize: 1.6,
    baseScaleMultiplier: 0.95,
    activeScaleMultiplier: 2.7,
    sideScaleMultiplier: 0.8,
    baseYOffset: -0.22,
    activeYOffset: -0.4,
    sideYOffset: -0.24,
    activeZ: 0.7,
    baseRotationY: 0.04,
    labelY: -1.0,
  },
}

function cleanupMaterials(cloned) {
  cloned.traverse((obj) => {
    if (!obj.isMesh) return

    obj.castShadow = true
    obj.receiveShadow = true

    if (obj.material) {
      obj.material = obj.material.clone()
      obj.material.transparent = true
      obj.material.roughness = obj.material.roughness ?? 0.82
      obj.material.metalness = obj.material.metalness ?? 0.08
    }
  })
}

function removeOnlyNamedBackgrounds(cloned) {
  const toRemove = []

  cloned.traverse((obj) => {
    if (!obj.isMesh) return

    const name = (obj.name || '').toLowerCase()
    const removeByName =
      name.includes('background') ||
      name.includes('backdrop') ||
      name.includes('shadowcatcher')

    if (removeByName) toRemove.push(obj)
  })

  toRemove.forEach((obj) => {
    if (obj.parent) obj.parent.remove(obj)
  })
}

function normalizeModel(scene, targetSize = 1) {
  const cloned = scene.clone(true)

  removeOnlyNamedBackgrounds(cloned)
  cleanupMaterials(cloned)
  cloned.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(cloned)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()

  box.getSize(size)
  box.getCenter(center)

  const minY = box.min.y
  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  const scale = targetSize / maxAxis

  cloned.scale.setScalar(scale)
  cloned.position.set(-center.x * scale, -minY * scale, -center.z * scale)

  return cloned
}

export default function MuseumItem({
  item,
  index,
  activeId,
  setActiveId,
  slot,
  total,
  activeSlotX,
  audioSrc,
}) {
  const { scene } = useGLTF(item.path)
  const ref = useRef()
  const audioRef = useRef(null)
  const playTimeoutRef = useRef(null)
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
  })
  const activeRotationYRef = useRef(0)
  const spinVelocityRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const PLAY_DELAY_MS = 2000

  const config = MODEL_CONFIG[item.path] || {
    normalizeSize: 1.4,
    baseScaleMultiplier: 1,
    activeScaleMultiplier: 1.8,
    sideScaleMultiplier: 0.9,
    baseYOffset: 0,
    activeYOffset: 0.03,
    sideYOffset: -0.03,
    activeZ: 0.95,
    baseRotationY: 0,
    labelY: -1.05,
  }

  const normalizedScene = useMemo(() => {
    return normalizeModel(scene, config.normalizeSize)
  }, [scene, config.normalizeSize])

  const isActive = activeId === item.id
  const hasActive = activeId !== null

  useEffect(() => {
    if (!audioSrc) return

    const audio = new Audio(audioSrc)
    audio.preload = 'auto'
    audio.volume = 1
    audio.currentTime = 0
    audioRef.current = audio

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current)
        playTimeoutRef.current = null
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [audioSrc])

  useEffect(() => {
    const handlePointerUp = () => {
      dragRef.current.isDragging = false
    }

    window.addEventListener('pointerup', handlePointerUp)
    return () => window.removeEventListener('pointerup', handlePointerUp)
  }, [])

  useEffect(() => {
    if (!audioRef.current) return

    if (!isActive) {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current)
        playTimeoutRef.current = null
      }

      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      dragRef.current.isDragging = false
      spinVelocityRef.current = 0
    }
  }, [isActive])

const playExhibitAudio = () => {
  if (!audioRef.current || !audioSrc) return

  if (playTimeoutRef.current) {
    clearTimeout(playTimeoutRef.current)
    playTimeoutRef.current = null
  }

  audioRef.current.pause()
  audioRef.current.currentTime = 0
  setIsPlaying(false)

  playTimeoutRef.current = setTimeout(() => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.volume = 1

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        setIsPlaying(false)
      })
  }, PLAY_DELAY_MS)
}

  useFrame((state) => {
    if (!ref.current || !slot) return

    const t = state.clock.getElapsedTime()

    let targetPos
    let targetScale
    let targetRotY

    if (isActive) {
      targetPos = new THREE.Vector3(0, config.activeYOffset, config.activeZ)
      targetScale =
        slot.modelScale * config.baseScaleMultiplier * config.activeScaleMultiplier
      targetRotY = config.baseRotationY
    } else if (hasActive) {
      const slotX = slot.modelPosition[0]
      const isCenterItem = Math.abs(slotX) < 0.01
      const activeIsEdge = total === 3 && activeSlotX !== null && Math.abs(activeSlotX) > 0.01

      let sideX = slotX < 0 ? -4.8 : slotX > 0 ? 4.8 : 0
      let sideZ = slotX === 0 ? -1.35 : -0.85
      let rotY = slotX < 0 ? 0.22 : slotX > 0 ? -0.22 : 0

      if (activeIsEdge && isCenterItem) {
        sideX = activeSlotX < 0 ? -4.8 : 4.8
        sideZ = -0.85
        rotY = activeSlotX < 0 ? 0.22 : -0.22
      }

      targetPos = new THREE.Vector3(sideX, config.sideYOffset, sideZ)
      targetScale =
        slot.modelScale * config.baseScaleMultiplier * config.sideScaleMultiplier
      targetRotY = rotY
    } else {
      targetPos = new THREE.Vector3(
        slot.modelPosition[0],
        slot.modelPosition[1] + config.baseYOffset,
        slot.modelPosition[2]
      )
      targetScale = slot.modelScale * config.baseScaleMultiplier
      targetRotY = config.baseRotationY || slot.rotationY
    }

    ref.current.position.lerp(targetPos, 0.08)

    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.08)
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.08)
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, 0.08)

    const floatOffset = hasActive
      ? Math.sin(t * 1.25 + index * 0.8) * (isActive ? 0.012 : 0.008)
      : Math.sin(t * 1.5 + index * 0.8) * 0.012

    ref.current.position.y += (targetPos.y + floatOffset - ref.current.position.y) * 0.08

    if (isActive) {
      activeRotationYRef.current += 0.01 + spinVelocityRef.current
      spinVelocityRef.current *= 0.94

      const targetActiveY = config.baseRotationY + activeRotationYRef.current

      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetActiveY,
        0.18
      )

      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.018, 0.08)
    } else {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotY + Math.sin(t * 0.7 + index) * 0.04,
        0.06
      )
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.08)
    }

    normalizedScene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const opacityTarget = hasActive && !isActive ? 0.3 : 1

        obj.material.opacity = THREE.MathUtils.lerp(
          obj.material.opacity ?? 1,
          opacityTarget,
          0.08
        )

        if ('emissiveIntensity' in obj.material) {
          obj.material.emissiveIntensity = THREE.MathUtils.lerp(
            obj.material.emissiveIntensity ?? 0,
            isActive ? 0.08 : 0,
            0.08
          )
        }
      }
    })
  })

  if (!slot) return null

  return (
    <group
      ref={ref}
      position={[
        slot.modelPosition[0],
        slot.modelPosition[1] + config.baseYOffset,
        slot.modelPosition[2],
      ]}
      scale={[slot.modelScale, slot.modelScale, slot.modelScale]}
onClick={(e) => {
  e.stopPropagation()

  if (!isActive) {
    setActiveId(item.id)
    playExhibitAudio()
  }
}}
      onPointerDown={(e) => {
        if (!isActive) return
        e.stopPropagation()
        dragRef.current.isDragging = true
        dragRef.current.lastX = e.clientX
      }}
      onPointerMove={(e) => {
        if (!isActive || !dragRef.current.isDragging) return
        e.stopPropagation()

        const deltaX = e.clientX - dragRef.current.lastX
        dragRef.current.lastX = e.clientX

        activeRotationYRef.current += deltaX * 0.015
        spinVelocityRef.current = deltaX * 0.0014
      }}
      onPointerUp={(e) => {
        if (!isActive) return
        e.stopPropagation()
        dragRef.current.isDragging = false
      }}
    >
      <primitive object={normalizedScene} />
    </group>
  )
}

useGLTF.preload('/taqiya.glb')
useGLTF.preload('/saukele.glb')
useGLTF.preload('/shapan.glb')
useGLTF.preload('/dombra.glb')
useGLTF.preload('/qobyz.glb')
useGLTF.preload('/asyq.glb')
useGLTF.preload('/qamshy.glb')
useGLTF.preload('/yurt.glb')
useGLTF.preload('/kamzol.glb')
useGLTF.preload('/sedlo.glb')
useGLTF.preload('/chest_lootbox.glb')