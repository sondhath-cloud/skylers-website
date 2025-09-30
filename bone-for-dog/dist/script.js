import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js'

// Variables
let container,
    scene,
    gltfLoader,
    camera,
    renderer,
    ambientLight,
    directionalLight,
    floorGeometry,
    floorMaterial,
    floor,
    model,
    fileAnimations,
    mixer,
    idle,
    head,
    idleAnim;

let params = {
  ambientLightColor: 0xddf9ff,
  directionalLightColor: 0xffd3b6,
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Base
 */
// Canvas
container = document.getElementById('world')
// Scene
scene = new THREE.Scene()

/**
 * Loader
 */
gltfLoader = new GLTFLoader()
gltfLoader.load('https://dl.dropbox.com/s/eyikvh5515o8ycm/Dog.glb?dl=0',
  (gltf)=>{
    console.log(gltf.scene.children[0])
    model = gltf.scene
    model.scale.set(0.3, 0.3, 0.3)
    model.position.set(0, -0.8, 0)
    model.rotation.set(0, 1.23, 0)

    model.traverse(o=>{
      if(o.isMesh){
        o.castShadow = true
        o.receiveShadow = true
      }
      if(o.isBone && o.name === 'head'){
        head = o
      }
    })
    scene.add(model)


    fileAnimations = gltf.animations
    mixer = new THREE.AnimationMixer(model)

    idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'Default')

    idleAnim.tracks.splice(24, 3)

    idle = mixer.clipAction(idleAnim)
    idle.play()
  },
  ()=>{console.log('progress')},
  (error)=>{console.error(error)}
)


/**
 * Camera
 */
camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, -0.07, 4)
scene.add(camera)

/**
 * Light
 */
 ambientLight = new THREE.AmbientLight(params.ambientLightColor, 0.9)
 scene.add(ambientLight)

 directionalLight = new THREE.DirectionalLight(params.directionalLightColor, 1.2)
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.camera.left = - 7
 directionalLight.shadow.camera.top = 7
 directionalLight.shadow.camera.right = 7
 directionalLight.shadow.camera.bottom = - 7
 directionalLight.position.set(5, 5, 5)
 directionalLight.shadow.normalBias = 0.05
 scene.add(directionalLight)

/**
 * Renderer
 */
renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// SHADOW
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Render RGB
renderer.outputEncoding = THREE.sRGBEncoding

container.appendChild(renderer.domElement)

/**
 * Floor
 */
floorGeometry = new THREE.PlaneGeometry(20, 20, 20)
floorMaterial = new THREE.ShadowMaterial({
  opacity: 0.2,
})
floor = new THREE.Mesh( floorGeometry, floorMaterial )
floor.rotation.x = -Math.PI/2
floor.position.y = -0.8
floor.receiveShadow = true
scene.add(floor)

/**
 * Animation loop
 */
const clock = new THREE.Clock()
let previousTime = 0

const loop = () => {

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Animation
  if (mixer){
    mixer.update(deltaTime)
  }

  // Render
  renderer.render(scene, camera)

  // Call loop again
  window.requestAnimationFrame(loop)
}

loop()

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.addEventListener('mousemove', (e)=>{
  let mouseCoords = getMousePos(e)

  if (head){
    moveJoint(mouseCoords, head, 50)
  }
})

function getMousePos(e){
  return { x: e.clientX, y: e.clientY }
}

function moveJoint(mouse, joint, degreeLimit) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit)
  joint.rotation.y = THREE.Math.degToRad(degrees.x) + Math.PI * -0.35
  joint.rotation.x = - THREE.Math.degToRad(degrees.y) + Math.PI * 0.2
}

function getMouseDegrees(x, y, degreeLimit){
  let dx = 0,
      dy = 0,
      xDiff,
      xPercentage,
      yDiff,
      yPercentage;
  let w = { x: window.innerWidth, y: window.innerHeight }

  // Left
  if (x <= w.x / 2){
    xDiff = w.x / 2 - x;
    xPercentage = xDiff / (w.x / 2) * 100
    dx = (degreeLimit * xPercentage) / 100 * -1
  }
  // Right
  if (x >= w.x / 2){
    xDiff = x - w.x / 2
    xPercentage = (xDiff / (w.x / 2)) * 100
    dx = ((degreeLimit * 0.8) * xPercentage) / 100
  }
  // Up
  if (y <= w.y / 2){
    yDiff = w.y / 2 - y
    yPercentage = (yDiff / (w.y / 2)) * 100
    dy = ((degreeLimit * 0.5) * yPercentage) / 100 * -1
  }
  // Down
  if (y >= w.y / 2) {
    yDiff = y - w.y / 2
    yPercentage = (yDiff / (w.y / 2)) * 100
    dy = (degreeLimit* yPercentage) / 100
  }
  return { x: dx, y: dy }
}