import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'

export default function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Torus Knot (main object)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('oklch(0.5 0.18 25)'),
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
      envMapIntensity: 1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    })
    const torusKnot = new THREE.Mesh(geometry, material)
    scene.add(torusKnot)

    // Wireframe overlay
    const wireGeo = new THREE.TorusKnotGeometry(1.25, 0.38, 32, 8)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('oklch(0.55 0.15 45)'),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wireKnot = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireKnot)

    // Inner glow ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 32, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('oklch(0.5 0.18 25)'),
      transparent: true,
      opacity: 0.3,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.015, 16, 64),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('oklch(0.55 0.15 45)'), transparent: true, opacity: 0.2 })
    )
    ring2.rotation.x = Math.PI / 3
    ring2.rotation.z = Math.PI / 4
    scene.add(ring2)

    // Particles
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      sizes[i] = Math.random() * 0.08 + 0.02
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('oklch(0.5 0.18 25 / 0.6)'),
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Animation
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      torusKnot.rotation.x = elapsed * 0.2 + my * 0.3
      torusKnot.rotation.y = elapsed * 0.3 + mx * 0.3
      wireKnot.rotation.x = torusKnot.rotation.x
      wireKnot.rotation.y = torusKnot.rotation.y
      ring.rotation.z = elapsed * 0.1
      ring2.rotation.y = elapsed * 0.15
      particles.rotation.x = elapsed * 0.02
      particles.rotation.y = elapsed * 0.03

      camera.position.x = Math.sin(elapsed * 0.05) * 0.3 + mx * 0.5
      camera.position.y = Math.sin(elapsed * 0.07) * 0.2 + my * 0.5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    // Resize
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [handleMouseMove])

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1] pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 70%)' }} />
  )
}
