import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from '../../theme/ThemeContext'

function readSceneColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    bg: styles.getPropertyValue('--scene-bg').trim() || '#0a0c10',
    core: styles.getPropertyValue('--scene-core').trim() || '#2ee6a6',
    emissive: styles.getPropertyValue('--scene-core-emissive').trim() || '#0d3d2e',
    ring: styles.getPropertyValue('--scene-ring').trim() || '#ff5a3c',
    shell: styles.getPropertyValue('--scene-shell').trim() || '#1a2420',
    particles: styles.getPropertyValue('--scene-particles').trim() || '#e8ecef',
    fiber: styles.getPropertyValue('--scene-fiber').trim() || '#1a9e72',
  }
}

function hash(n) {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/** Stylized humanoid parts in local space */
function bodyPartDefs() {
  return [
    { kind: 'sphere', r: 0.3, h: 0, pos: [0, 1.58, 0], scale: [1, 1.1, 0.95] },
    { kind: 'capsule', r: 0.36, h: 0.78, pos: [0, 0.78, 0], scale: [1.2, 1, 0.82] },
    { kind: 'sphere', r: 0.24, h: 0, pos: [0, 1.2, 0.04], scale: [1.2, 0.72, 0.95] },
    { kind: 'capsule', r: 0.1, h: 0.58, pos: [-0.55, 0.98, 0], rot: [0, 0, 0.58], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.1, h: 0.58, pos: [0.55, 0.98, 0], rot: [0, 0, -0.58], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.082, h: 0.5, pos: [-0.82, 0.36, 0.05], rot: [0.18, 0, 0.2], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.082, h: 0.5, pos: [0.82, 0.36, 0.05], rot: [0.18, 0, -0.2], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.145, h: 0.66, pos: [-0.22, -0.32, 0], rot: [0.06, 0, 0.09], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.145, h: 0.66, pos: [0.22, -0.32, 0], rot: [0.06, 0, -0.09], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.11, h: 0.62, pos: [-0.26, -1.18, 0.03], rot: [0.1, 0, 0.05], scale: [1, 1, 1] },
    { kind: 'capsule', r: 0.11, h: 0.62, pos: [0.26, -1.18, 0.03], rot: [0.1, 0, -0.05], scale: [1, 1, 1] },
  ]
}

function transformLocal(p, part) {
  const v = p.clone()
  v.x *= part.scale[0]
  v.y *= part.scale[1]
  v.z *= part.scale[2]
  if (part.rot) {
    v.applyEuler(new THREE.Euler(part.rot[0], part.rot[1], part.rot[2]))
  }
  v.x += part.pos[0]
  v.y += part.pos[1]
  v.z += part.pos[2]
  return v
}

function sampleOnPart(part, u, v, w) {
  let local
  if (part.kind === 'sphere') {
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const r = part.r * (0.78 + w * 0.2)
    local = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    )
  } else {
    const theta = u * Math.PI * 2
    const along = (v - 0.5) * (part.h + part.r * 2) * 0.92
    const r = part.r * (0.8 + w * 0.18)
    local = new THREE.Vector3(Math.cos(theta) * r, along, Math.sin(theta) * r)
  }
  return transformLocal(local, part)
}

function buildBodyGeometry() {
  const parts = bodyPartDefs()
  const geos = parts.map((part) => {
    let g
    if (part.kind === 'sphere') {
      g = new THREE.SphereGeometry(part.r, 28, 20)
    } else {
      g = new THREE.CapsuleGeometry(part.r, part.h, 8, 16)
    }
    g.scale(part.scale[0], part.scale[1], part.scale[2])
    if (part.rot) {
      g.rotateX(part.rot[0])
      g.rotateY(part.rot[1])
      g.rotateZ(part.rot[2])
    }
    g.translate(part.pos[0], part.pos[1], part.pos[2])
    return g
  })
  const merged = mergeGeometries(geos)
  geos.forEach((g) => g.dispose())
  return merged
}

function mergeGeometries(geometries) {
  const out = new THREE.BufferGeometry()
  const positions = []
  const normals = []
  let indexOffset = 0
  const indices = []

  for (const g of geometries) {
    const pos = g.attributes.position
    const nor = g.attributes.normal
    for (let i = 0; i < pos.count; i += 1) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i))
      if (nor) normals.push(nor.getX(i), nor.getY(i), nor.getZ(i))
      else normals.push(0, 1, 0)
    }
    const idx = g.index
    if (idx) {
      for (let i = 0; i < idx.count; i += 1) indices.push(idx.getX(i) + indexOffset)
    } else {
      for (let i = 0; i < pos.count; i += 1) indices.push(indexOffset + i)
    }
    indexOffset += pos.count
  }

  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  out.setIndex(indices)
  out.computeBoundingSphere()
  return out
}

function buildFiberGeometry(count) {
  const parts = bodyPartDefs()
  const positions = new Float32Array(count * 2 * 3)
  const colors = new Float32Array(count * 2 * 3)
  const core = new THREE.Color('#2ee6a6')
  const fiber = new THREE.Color('#148f68')

  for (let i = 0; i < count; i += 1) {
    const part = parts[Math.floor(hash(i * 3.17) * parts.length)]
    const a = sampleOnPart(part, hash(i * 1.1), hash(i * 2.2), hash(i * 3.3))
    const lean = 0.05 + hash(i * 4.4) * 0.11
    const b = a
      .clone()
      .add(
        new THREE.Vector3(
          (hash(i * 5.5) - 0.5) * 0.04,
          lean,
          (hash(i * 6.6) - 0.5) * 0.035,
        ),
      )
    const i6 = i * 6
    positions[i6] = a.x
    positions[i6 + 1] = a.y
    positions[i6 + 2] = a.z
    positions[i6 + 3] = b.x
    positions[i6 + 4] = b.y
    positions[i6 + 5] = b.z

    const mix = 0.25 + hash(i * 7.7) * 0.75
    const c = fiber.clone().lerp(core, mix)
    colors[i6] = c.r
    colors[i6 + 1] = c.g
    colors[i6 + 2] = c.b
    colors[i6 + 3] = c.r
    colors[i6 + 4] = c.g
    colors[i6 + 5] = c.b
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

function useFigureOffset() {
  const [offset, setOffset] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 0.1 : 0.95,
  )
  useEffect(() => {
    const update = () => setOffset(window.innerWidth < 768 ? 0.1 : 0.95)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return offset
}

function AnatomyFigure({ colors, isDark, reduced }) {
  const group = useRef(null)
  const shellMat = useRef(null)
  const wireMat = useRef(null)
  const fiberMat = useRef(null)
  const reveal = useRef(reduced ? 1 : 0)
  const mouse = useRef(new THREE.Vector3(999, 999, 999))
  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])

  const bodyGeo = useMemo(() => buildBodyGeometry(), [])
  const fiberGeo = useMemo(() => buildFiberGeometry(reduced ? 1200 : 4200), [reduced])

  useEffect(() => () => {
    bodyGeo.dispose()
    fiberGeo.dispose()
  }, [bodyGeo, fiberGeo])

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()

    if (!reduced) {
      reveal.current = Math.min(1, reveal.current + dt / 2.4)
      ndc.set(state.pointer.x, state.pointer.y)
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) {
        if (mouse.current.x > 900) mouse.current.copy(hit)
        else mouse.current.lerp(hit, 0.14)
      }
    } else {
      reveal.current = 1
    }

    if (group.current && !reduced) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.32,
        0.045,
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -state.pointer.y * 0.12,
        0.045,
      )
    }

    const r = reveal.current
    const ease = 1 - Math.pow(1 - r, 1.5)
    if (group.current) {
      group.current.scale.setScalar(0.88 + ease * 0.12)
    }

    if (shellMat.current) {
      shellMat.current.opacity = (isDark ? 0.42 : 0.38) * ease
      shellMat.current.emissiveIntensity = (0.35 + Math.sin(t * 1.8) * 0.08) * ease
    }
    if (wireMat.current) {
      wireMat.current.opacity = (isDark ? 0.55 : 0.4) * ease
    }
    if (fiberMat.current) {
      fiberMat.current.opacity = (isDark ? 0.85 : 0.7) * ease
    }

    // thermal: boost shell emissive when pointer near torso
    if (shellMat.current && group.current) {
      const local = mouse.current.clone()
      group.current.worldToLocal(local)
      const d = local.length()
      const thermal = THREE.MathUtils.clamp(1 - d / 1.8, 0, 1)
      shellMat.current.emissiveIntensity =
        (0.35 + Math.sin(t * 1.8) * 0.08 + thermal * 0.85) * ease
    }
  })

  return (
    <group ref={group}>
      {/* Glass shell — anatomical silhouette */}
      <mesh geometry={bodyGeo} renderOrder={1}>
        <meshStandardMaterial
          ref={shellMat}
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={0.35}
          metalness={0.25}
          roughness={0.4}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner muscle lattice */}
      <mesh geometry={bodyGeo} scale={0.965} renderOrder={2}>
        <meshBasicMaterial
          ref={wireMat}
          color={colors.core}
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Muscle fibers */}
      <lineSegments geometry={fiberGeo} renderOrder={3}>
        <lineBasicMaterial
          ref={fiberMat}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Energy core in the chest */}
      <EnergyHeart colors={colors} isDark={isDark} reduced={reduced} reveal={reveal} />
    </group>
  )
}

function EnergyHeart({ colors, isDark, reduced, reveal }) {
  const mesh = useRef(null)
  const ring = useRef(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const beat = 1 + Math.sin(t * 2.15) * 0.05 + Math.sin(t * 4.3) * 0.02
    const r = reveal?.current ?? 1
    if (mesh.current) {
      mesh.current.scale.setScalar(beat * (0.4 + r * 0.6))
      mesh.current.rotation.y = t * 0.4
      mesh.current.material.opacity = (isDark ? 0.95 : 0.85) * r
    }
    if (ring.current) {
      ring.current.rotation.z = -t * 0.45
      ring.current.rotation.x = Math.PI / 2.55
      ring.current.material.opacity = (isDark ? 0.65 : 0.75) * r
    }
  })

  return (
    <group position={[0, 0.88, 0.14]}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.emissive}
          emissiveIntensity={isDark ? 1.5 : 1}
          metalness={0.35}
          roughness={0.25}
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={ring} scale={1.55}>
        <torusGeometry args={[0.2, 0.01, 12, reduced ? 48 : 96]} />
        <meshBasicMaterial color={colors.ring} transparent opacity={0} />
      </mesh>
      <pointLight color={colors.core} intensity={isDark ? 2 : 1.3} distance={4} />
    </group>
  )
}

function LightPool({ colors, isDark }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.92, 0]}>
      <circleGeometry args={[1.6, 64]} />
      <meshBasicMaterial
        color={colors.core}
        transparent
        opacity={isDark ? 0.16 : 0.11}
        depthWrite={false}
      />
    </mesh>
  )
}

function Motes({ colors, reduced, isDark }) {
  const count = reduced ? 140 : 420
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (hash(i) - 0.5) * 8
      arr[i * 3 + 1] = (hash(i * 2.3) - 0.5) * 5
      arr[i * 3 + 2] = (hash(i * 4.1) - 0.5) * 4
    }
    return arr
  }, [count])
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.028
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={reduced ? 0.016 : 0.022}
        color={colors.particles}
        transparent
        opacity={isDark ? 0.4 : 0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SceneLights({ isDark, colors }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 0.7} />
      <directionalLight position={[3, 5, 3]} intensity={isDark ? 1 : 1.2} />
      <pointLight position={[-2, 2, 2]} intensity={1.2} color={colors.core} />
      <pointLight position={[2.5, -1, -1]} intensity={0.6} color={colors.ring} />
    </>
  )
}

function AnatomyScene({ reduced, colors, isDark }) {
  const offsetX = useFigureOffset()
  return (
    <>
      <SceneLights isDark={isDark} colors={colors} />
      <Motes colors={colors} reduced={reduced} isDark={isDark} />
      <group position={[offsetX, 0.08, 0]}>
        <LightPool colors={colors} isDark={isDark} />
        <AnatomyFigure colors={colors} isDark={isDark} reduced={reduced} />
      </group>
      <fog attach="fog" args={[colors.bg, 6, 15]} />
    </>
  )
}

export default function HeroScene({ reduced = false }) {
  const { isDark } = useTheme()
  const [colors, setColors] = useState(readSceneColors)

  useEffect(() => {
    setColors(readSceneColors())
  }, [isDark])

  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0.2, 0.25, 4.8], fov: 40 }}
      gl={{ antialias: !reduced, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[colors.bg]} />
      <Suspense fallback={null}>
        <AnatomyScene reduced={reduced} colors={colors} isDark={isDark} />
      </Suspense>
    </Canvas>
  )
}
