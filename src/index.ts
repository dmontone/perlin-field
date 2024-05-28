import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import * as Stats from 'stats.js'
import * as QNoise from 'quick-perlin-noise-js'
import * as dat from 'dat.gui'

const mapRange = (value: number, low1: number, high1: number, low2: number, high2: number): number =>
  low2 + (high2 - low2) * (value - low1) / (high1 - low1)

// Configuration Constants
const CONFIG = {
  renderer: {
    shadowMap: {
      enabled: true,
      type: THREE.PCFSoftShadowMap
    }
  },
  light: {
    color: 0xadd8e6,
    intensity: 20,
    position: { x: 0, y: 6, z: 4 },
    shadow: { mapSize: { width: 2048, height: 2048 } }
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 4, z: 5.75 }
  },
  mesh: {
    color: 0xFFFFFF,
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    plane: {
      width: 50,
      height: 50,
      segments: 1,
      depth: 0.5
    }
  },
  noiseOffset: {
    x: 0,
    y: 0,
    increment: { x: 0, y: -0.02 },
    magnitude: 3
  }
}

// Setup renderer
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = CONFIG.renderer.shadowMap.enabled
renderer.shadowMap.type = CONFIG.renderer.shadowMap.type
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create scene
const scene = new THREE.Scene()

// Create light
const light = new THREE.PointLight(CONFIG.light.color, CONFIG.light.intensity)
light.position.set(CONFIG.light.position.x, CONFIG.light.position.y, CONFIG.light.position.z)
light.castShadow = true
light.shadow.mapSize.width = CONFIG.light.shadow.mapSize.width
light.shadow.mapSize.height = CONFIG.light.shadow.mapSize.height
scene.add(light)

// Create camera
const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, window.innerWidth / window.innerHeight, CONFIG.camera.near, CONFIG.camera.far)
camera.position.set(CONFIG.camera.position.x, CONFIG.camera.position.y, CONFIG.camera.position.z)

// Create controls
const controls = new OrbitControls(camera, renderer.domElement)

// Create mesh
const planeGeometry = new THREE.PlaneGeometry(CONFIG.mesh.plane.width, CONFIG.mesh.plane.height, CONFIG.mesh.plane.width * CONFIG.mesh.plane.segments - 1, CONFIG.mesh.plane.height * CONFIG.mesh.plane.segments - 1)
const grayMaterial = new THREE.MeshStandardMaterial({ color: CONFIG.mesh.color })
let mesh = new THREE.Mesh(mergeVertices(planeGeometry, CONFIG.mesh.plane.depth), grayMaterial)
mesh.rotation.x = CONFIG.mesh.rotation.x
scene.add(mesh)

// Create stats
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// GUI Setup
const gui = new dat.GUI()
const guiControls = {
  incrementX: CONFIG.noiseOffset.increment.x,
  incrementY: CONFIG.noiseOffset.increment.y,
  magnitude: CONFIG.noiseOffset.magnitude,
  segments: CONFIG.mesh.plane.segments,
  lightPositionX: CONFIG.light.position.x
}

const updateMesh = () => {
  scene.remove(mesh);
  const updatedPlaneGeometry = new THREE.PlaneGeometry(
    CONFIG.mesh.plane.width,
    CONFIG.mesh.plane.height,
    CONFIG.mesh.plane.width * guiControls.segments - 1,
    CONFIG.mesh.plane.height * guiControls.segments - 1
  );
  const updatedMesh = new THREE.Mesh(
    mergeVertices(updatedPlaneGeometry, CONFIG.mesh.plane.depth),
    grayMaterial
  );
  updatedMesh.rotation.x = CONFIG.mesh.rotation.x;
  scene.add(updatedMesh);
  mesh = updatedMesh;
};

const gridFolder = gui.addFolder('Grid')
gridFolder.add(guiControls, 'segments', 1, 10).step(1).name('Segments')
gridFolder.open()

const offsetFolder = gui.addFolder('Noise Offset')
offsetFolder.add(guiControls, 'incrementX', -1, 1).step(0.000001).name('Offset Increment X')
offsetFolder.add(guiControls, 'incrementY', -1, 1).step(0.000001).name('Offset Increment Y')
offsetFolder.add(guiControls, 'magnitude', 1, 50).step(1).name('Magnitude')
offsetFolder.open()

const materialFolder = gui.addFolder('Material')
materialFolder.add(grayMaterial, 'wireframe').name('Wireframe')
materialFolder.open()

const lightFolder = gui.addFolder('Light')
const lightColor = { color: light.color.getHex() }
lightFolder.addColor(lightColor, 'color').name('Color').onChange(() => light.color.set(lightColor.color))
lightFolder.add(light, 'intensity').min(0).max(100).step(0.1).name('Intensity').onChange(() => light.intensity = light.intensity)
lightFolder.add(light.position, 'x').min(-10).max(10).step(0.1).name('Position X').onChange(() => light.position.x = light.position.x)
lightFolder.add(light.position, 'y').min(-10).max(10).step(0.1).name('Position Y').onChange(() => light.position.y = light.position.y)
lightFolder.add(light.position, 'z').min(-10).max(10).step(0.1).name('Position Z').onChange(() => light.position.z = light.position.z)
lightFolder.open()

// Update function
const updateNoise = () => {
  const positionAttribute = mesh.geometry.attributes.position
  for (let i = 0;i < positionAttribute.count;i++) {
    const x = i%CONFIG.mesh.plane.width
    const y = Math.floor(i/CONFIG.mesh.plane.height)
    const noise = QNoise.noise(1 + x/10 + CONFIG.noiseOffset.x, 1 + y/10 + CONFIG.noiseOffset.y, 0)
    const z = mapRange(noise, 0, 1, -1 * CONFIG.noiseOffset.magnitude, 1 * CONFIG.noiseOffset.magnitude)
    positionAttribute.setZ(i, z)
  }
  positionAttribute.needsUpdate = true
}

// Animation loop
const animate = () => {
  renderer.setAnimationLoop(animate)
  stats.begin()
  CONFIG.noiseOffset.x += guiControls.incrementX
  CONFIG.noiseOffset.y += guiControls.incrementY
  updateMesh()
  updateNoise()
  renderer.render(scene, camera)
  controls.update()
  stats.end()
}

animate()
