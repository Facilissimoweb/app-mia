import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'

function SculpturalMesh({ reducedMotion }) {
  const meshRef = useRef()
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return undefined

    const handlePointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [reducedMotion])

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return

    meshRef.current.rotation.y += delta * 0.045
    meshRef.current.rotation.x += (pointer.current.y * 0.045 - meshRef.current.rotation.x) * delta * 0.6
    meshRef.current.rotation.z += (pointer.current.x * 0.025 - meshRef.current.rotation.z) * delta * 0.6
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.18, 2]} />
      <MeshDistortMaterial
        color="#394250"
        emissive="#101b25"
        emissiveIntensity={0.28}
        metalness={0.78}
        roughness={0.3}
        distort={0.13}
        speed={reducedMotion ? 0 : 0.18}
      />
    </mesh>
  )
}

export default function AmbientMeshCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(reducedMotionQuery.matches)

    updateMotionPreference()
    reducedMotionQuery.addEventListener('change', updateMotionPreference)
    return () => reducedMotionQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  return (
    <div className="ambient-mesh" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          dpr={[1, 1.25]}
          frameloop={reducedMotion ? 'demand' : 'always'}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={0.35} />
          <pointLight color="#00eefc" intensity={3} position={[-2, 1.5, 2]} />
          <pointLight color="#c861ff" intensity={2} position={[2, -1, -2]} />
          <SculpturalMesh reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  )
}
