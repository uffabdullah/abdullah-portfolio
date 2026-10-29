import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const themeToggle = document.querySelector('.theme-toggle')
const themeIcon = document.querySelector('.theme-icon')
const savedTheme = localStorage.getItem('portfolio-theme')
const initialTheme = savedTheme || 'dark'
document.body.classList.toggle('light', initialTheme === 'light')
function updateThemeControl() {
  const light = document.body.classList.contains('light')
  themeIcon.textContent = light ? '☾' : '☀'
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#eeece5' : '#08080b')
}
updateThemeControl()
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light')
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark')
  updateThemeControl()
})

gsap.to('.scroll-progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: true },
})

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!prefersReducedMotion) {
  document.querySelectorAll('.project').forEach((project) => {
    project.addEventListener('pointermove', (event) => {
      const bounds = project.getBoundingRect?.() || project.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      gsap.to(project, { rotationY: x * 2.5, rotationX: y * -2.5, transformPerspective: 900, duration: 0.35, ease: 'power2.out' })
    })
    project.addEventListener('pointerleave', () => gsap.to(project, { rotationY: 0, rotationX: 0, duration: 0.5 }))
  })
}

gsap.set('.reveal', { visibility: 'visible' })
gsap.from('.hero .reveal', { y: 50, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.15 })
gsap.to('.hero-copy', {
  y: -120,
  opacity: 0,
  filter: 'blur(8px)',
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: 1 },
})
gsap.to('.hero-index', {
  opacity: 0,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: true },
})
gsap.utils.toArray('.section-label, .intro-grid, .work-heading, .project-card, .journey-grid, .timeline-item, .proof-empty, .skill-cloud, .contact-grid, .faq').forEach((element, index) => {
  gsap.from(element, {
    y: 42,
    opacity: 0,
    duration: 0.72,
    delay: (index % 3) * 0.035,
    ease: 'power3.out',
    scrollTrigger: { trigger: element, start: 'top 91%', once: true },
  })
})

const canvas = document.querySelector('#bg')
const scene = new THREE.Scene()
const sceneFog = new THREE.FogExp2(0x08080b, 0.08)
scene.fog = sceneFog
themeToggle.addEventListener('click', () => {
  sceneFog.color.set(document.body.classList.contains('light') ? 0xeeece5 : 0x08080b)
})
sceneFog.color.set(document.body.classList.contains('light') ? 0xeeece5 : 0x08080b)
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 11)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15

const group = new THREE.Group()
scene.add(group)
const geometry = new THREE.TorusKnotGeometry(2.25, 0.58, 128, 24, 2, 3)
const material = new THREE.MeshStandardMaterial({ color: 0xb6d8ff, metalness: 0.92, roughness: 0.16, emissive: 0x1018ff, emissiveIntensity: 0.28 })
const knot = new THREE.Mesh(geometry, material)
group.add(knot)

const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.035 })
const wire = new THREE.Mesh(geometry, wireMaterial)
group.add(wire)
const ambient = new THREE.AmbientLight(0x7777ff, 0.45)
scene.add(ambient)
const key = new THREE.PointLight(0xc9ff38, 55, 20, 2)
key.position.set(-4, 5, 7)
scene.add(key)
const rim = new THREE.PointLight(0x5555ff, 80, 25, 2)
rim.position.set(5, -3, 3)
scene.add(rim)

function updateThreeTheme() {
  const light = document.body.classList.contains('light')
  material.color.setHex(light ? 0x6d5efc : 0xb6d8ff)
  material.emissive.setHex(light ? 0x4727d8 : 0x1018ff)
  material.emissiveIntensity = light ? 0.7 : 0.28
  material.metalness = light ? 0.7 : 0.92
  material.roughness = light ? 0.18 : 0.16
  wireMaterial.color.setHex(light ? 0x2d226b : 0xffffff)
  wireMaterial.opacity = light ? 0.18 : 0.035
  ambient.color.setHex(light ? 0xf3f4ff : 0x7777ff)
  ambient.intensity = light ? 1.6 : 0.45
  key.color.setHex(light ? 0xff9f43 : 0xc9ff38)
  key.intensity = light ? 140 : 55
  rim.color.setHex(light ? 0x6958ff : 0x5555ff)
  rim.intensity = light ? 145 : 80
  renderer.toneMappingExposure = light ? 1.6 : 1.15
}
updateThreeTheme()
themeToggle.addEventListener('click', () => requestAnimationFrame(updateThreeTheme))
const clock = new THREE.Clock()
let mouseX = 0
let mouseY = 0
window.addEventListener('pointermove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 0.6
  mouseY = (event.clientY / window.innerHeight - 0.5) * 0.4
})
let lastRender = 0
function animate() {
  const now = performance.now()
  if (now - lastRender < 1000 / 30) return
  lastRender = now
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
document.addEventListener('visibilitychange', () => {
  document.visibilityState === 'visible' ? renderer.setAnimationLoop(animate) : renderer.setAnimationLoop(null)
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const menuButton = document.querySelector('.menu-button')
const menuOverlay = document.querySelector('.menu-overlay')
const menuClose = document.querySelector('.menu-close')
function setMenu(open) {
  menuOverlay?.classList.toggle('open', open)
  menuOverlay?.setAttribute('aria-hidden', String(!open))
  menuButton?.setAttribute('aria-expanded', String(open))
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) menuClose?.focus()
  else menuButton?.focus()
}
menuButton?.addEventListener('click', () => setMenu(true))
menuClose?.addEventListener('click', () => setMenu(false))
menuOverlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuOverlay?.classList.contains('open')) setMenu(false) })

const filterButtons = [...document.querySelectorAll('.filter')]
const projectCards = [...document.querySelectorAll('.project-card')]
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)) })
  const filter = button.dataset.filter
  projectCards.forEach((card) => card.classList.toggle('hidden', filter !== 'all' && !card.classList.contains(filter)))
}))

const showMoreButton = document.querySelector('.show-more')
showMoreButton?.addEventListener('click', () => {
  const expanded = showMoreButton.getAttribute('aria-expanded') === 'true'
  showMoreButton.setAttribute('aria-expanded', String(!expanded))
  showMoreButton.firstChild.textContent = expanded ? 'Show more ' : 'Show featured '
  projectCards.forEach((card, index) => { if (index > 3) card.classList.toggle('expanded', !expanded) })
})

document.querySelectorAll('.timeline-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.timeline-item').forEach((other) => other.classList.remove('active'))
  item.classList.add('active')
}))

if (!prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return
      const bounds = card.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      gsap.to(card, { rotationY: x * 0.8, rotationX: y * -0.8, transformPerspective: 900, duration: 0.25, overwrite: true })
    })
    card.addEventListener('pointerleave', () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.35, overwrite: true }))
  })
}
