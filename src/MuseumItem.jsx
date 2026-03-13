import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function normalizeModel(scene, targetSize = 1) {
  const cloned = scene.clone(true)

  const box = new THREE.Box3().setFromObject(cloned)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()

  box.getSize(size)
  box.getCenter(center)

  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  const scale = targetSize / maxAxis

  cloned.scale.setScalar(scale)
  cloned.position.x = -center.x * scale
  cloned.position.y = -center.y * scale
  cloned.position.z = -center.z * scale

  cloned.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true
      obj.receiveShadow = true

      if (obj.material) {
        obj.material = obj.material.clone()
        obj.material.transparent = true
        obj.material.roughness = obj.material.roughness ?? 0.88
        obj.material.metalness = obj.material.metalness ?? 0.06
      }
    }
  })

  return cloned
}

export default function MuseumItem({
  item,
  index,
  activeId,
  activeIndex,
  total,
  setActiveId,
  slots,
}) {
  const { scene } = useGLTF(item.path)
  const ref = useRef()

  const normalizedScene = useMemo(() => {
    return normalizeModel(scene, 1.4)
  }, [scene])

  const isActive = activeId === item.id
  const hasActive = activeId !== null

  const defaultRadius = 5.8
  const defaultX = Math.cos(item.angle) * defaultRadius
  const defaultZ = Math.sin(item.angle) * defaultRadius

  useFrame((state) => {
    if (!ref.current) return

    const t = state.clock.getElapsedTime()

    let targetPos
    let targetScale
    let targetRotY

    if (!hasActive) {
      targetPos = new THREE.Vector3(defaultX, 0.05, defaultZ)
      targetScale = 1.22
      targetRotY = item.angle + Math.PI / 2
    } else {
      const relative = (index - activeIndex + total) % total
      const slot = slots[relative]

      targetPos = new THREE.Vector3(
        slot.position[0],
        slot.position[1],
        slot.position[2]
      )
      targetScale = slot.scale
      targetRotY = slot.rotationY
    }

    ref.current.position.lerp(targetPos, 0.075)

    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.075)
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.075)
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, 0.075)

    const hoverWave = isActive
      ? Math.sin(t * 2.2) * 0.055
      : Math.sin(t * 1.4 + index * 0.9) * 0.015

    ref.current.position.y += (targetPos.y + hoverWave - ref.current.position.y) * 0.08

    if (isActive) {
      ref.current.rotation.y += 0.018
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.035, 0.08)
    } else {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.08)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.08)
    }

    normalizedScene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const opacityTarget = hasActive && !isActive ? 0.38 : 1
        obj.material.opacity = THREE.MathUtils.lerp(
          obj.material.opacity ?? 1,
          opacityTarget,
          0.08
        )

        if ('emissive' in obj.material) {
          obj.material.emissive = new THREE.Color('#2d1d00')
          obj.material.emissiveIntensity = THREE.MathUtils.lerp(
            obj.material.emissiveIntensity ?? 0,
            isActive ? 0.2 : 0.02,
            0.08
          )
        }
      }
    })
  })

  return (
    <group
      ref={ref}
      position={[defaultX, 0.05, defaultZ]}
      scale={[1.22, 1.22, 1.22]}
      onClick={(e) => {
        e.stopPropagation()
        setActiveId(item.id)
      }}
    >
      <primitive object={normalizedScene} />
    </group>
  )
}

useGLTF.preload('/taqiya.glb')
useGLTF.preload('/shapan.glb')
useGLTF.preload('/dombra.glb')
useGLTF.preload('/asyq.glb')