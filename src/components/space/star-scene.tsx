'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Points } from 'three'

function Stars() {
  const points = useRef<Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(420)
    for (let index = 0; index < values.length; index += 1) {
      const value = Math.sin((index + 1) * 127.1) * 43758.5453
      values[index] = (value - Math.floor(value) - 0.5) * 18
    }
    return values
  }, [])

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.z += delta * 0.012
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d4bdff" transparent opacity={0.56} size={0.035} depthWrite={false} />
    </points>
  )
}

export default function StarScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 12] }} fallback={null}>
      <Stars />
    </Canvas>
  )
}
