<template>
    <div ref="container" class="robot-model-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import URDFLoader from 'urdf-loader'
  
  const props = defineProps({
    running: Boolean,
    resetFlag: Number
  })
  
  const container = ref(null)
  let scene, camera, renderer, controls, robot
  let t = 0
  
  const initScene = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf2f2f2)
  
    camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 0.1, 100)
    camera.position.set(1, 1, 2)
  
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    container.value.appendChild(renderer.domElement)
  
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)
  
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  
    scene.add(new THREE.GridHelper(10, 10))
    scene.add(new THREE.AxesHelper(1))
  
    const loader = new URDFLoader()
    loader.packages = { 'aubo_description': '/aubo_description' }
    loader.load('/aubo_description/urdf/aubo_i5.urdf', model => {
      model.rotation.x = -Math.PI / 2
      robot = model
      scene.add(robot)
    })
  }
  
  const animate = () => {
    requestAnimationFrame(animate)
    animateArm()
    controls.update()
    renderer.render(scene, camera)
  }
  
  function animateArm() {
    if (!robot || !props.running) return
    t += 0.02
    const s = Math.sin(t) * 1.0
    const c = Math.cos(t) * 0.5
    robot.joints.shoulder_joint?.setJointValue(s)
    robot.joints.upperArm_joint ?.setJointValue(-s)
    robot.joints.foreArm_joint  ?.setJointValue(1.2 + c)
    robot.joints.wrist1_joint   ?.setJointValue(c)
    robot.joints.wrist2_joint   ?.setJointValue(-c)
    robot.joints.wrist3_joint   ?.setJointValue(s * 0.3)
  }
  
  watch(() => props.resetFlag, () => {
    if (!robot) return
    t = 0
    robot.joints.shoulder_joint?.setJointValue(0)
    robot.joints.upperArm_joint ?.setJointValue(0)
    robot.joints.foreArm_joint  ?.setJointValue(1.2)
    robot.joints.wrist1_joint   ?.setJointValue(0)
    robot.joints.wrist2_joint   ?.setJointValue(0)
    robot.joints.wrist3_joint   ?.setJointValue(0)
  })
  
  const handleResize = () => {
    if (!camera || !renderer) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
  
  onMounted(() => {
    initScene()
    animate()
    window.addEventListener('resize', handleResize)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    container.value?.removeChild(renderer.domElement)
    renderer.dispose()
  })
  </script>
  
  <style scoped>
  .robot-model-container {
    width: 100%;
    height: calc(50vh - 200px);
    background: #fafafa;
  }
  </style>
  