import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ smoothWheel: true, wheelMultiplier: 0.9 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

gsap.set('.reveal', { visibility: 'visible' })
gsap.from('.hero .reveal', { y: 50, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.15 })
gsap.utils.toArray('.section-label, .intro-grid, .work-heading, .project, .journey-grid, .skill-cloud, .contact > *').forEach((element) => {
  gsap.from(element, { y: 55, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
})

const canvas = document.querySelector('#bg')
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x08080b, 0.08)
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 11)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15

const group = new THREE.Group()
scene.add(group)
const geometry = new THREE.TorusKnotGeometry(2.25, 0.58, 180, 28, 2, 3)
const material = new THREE.MeshStandardMaterial({ color: 0xb6d8ff, metalness: 0.92, roughness: 0.16, emissive: 0x1018ff, emissiveIntensity: 0.28 })
const knot = new THREE.Mesh(geometry, material)
group.add(knot)

const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.035 }))
group.add(wire)
scene.add(new THREE.AmbientLight(0x7777ff, 0.45))
const key = new THREE.PointLight(0xc9ff38, 55, 20, 2)
key.position.set(-4, 5, 7)
scene.add(key)
const rim = new THREE.PointLight(0x5555ff, 80, 25, 2)
rim.position.set(5, -3, 3)
scene.add(rim)

const clock = new THREE.Clock()
let mouseX = 0
let mouseY = 0
window.addEventListener('pointermove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 0.6
  mouseY = (event.clientY / window.innerHeight - 0.5) * 0.4
})
function animate() {
  const t = clock.getElapsedTime()
  const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
  group.rotation.x = t * 0.08 + mouseY + scroll * 1.2
  group.rotation.y = t * 0.13 + mouseX + scroll * 2.4
  group.position.x = window.innerWidth > 760 ? 3.4 + mouseX * 0.25 : 0
  group.position.y = window.innerWidth > 760 ? 0.4 : -3.2
  key.position.x = Math.sin(t * 0.55) * 5 - 2
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})
