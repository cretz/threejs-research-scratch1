import * as THREE from 'three'

console.debug('Character page')

import Stats from 'three/examples/jsm/libs/stats.module.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

class CharacterPage {
  private readonly clock = new THREE.Clock()
  private readonly camera: THREE.PerspectiveCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly stats: Stats
  private mixer?: THREE.AnimationMixer

  constructor(container: HTMLDivElement) {
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
    this.camera.position.set(100, 200, 300)

    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xa0a0a0)
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 200, 0)
    this.scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(0, 200, 100)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -120
    dirLight.shadow.camera.right = 120
    this.scene.add(dirLight)

    // Ground
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.scene.add(mesh)

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
    const material = <THREE.Material>grid.material
    material.opacity = 0.2
    material.transparent = true
    this.scene.add(grid)

    // Model
    const loader = new FBXLoader()
    loader.load('assets/y-bot.fbx', (obj) => {
      // this.mixer = new THREE.AnimationMixer(obj)

      // const action = this.mixer.clipAction(obj.animations[0])
      // action.play()

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      this.scene.add(obj)
    })

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    container.appendChild(this.renderer.domElement)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.target.set(0, 100, 0)
    controls.update()

    window.addEventListener('resize', this.onWindowResize)

    // Stats
    this.stats = Stats()
    container.appendChild(this.stats.dom)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.mixer?.update(this.clock.getDelta())
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }
}

const page = new CharacterPage(document.getElementById('app') as HTMLDivElement)
page.animate()
