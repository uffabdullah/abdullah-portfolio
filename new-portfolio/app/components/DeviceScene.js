"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PHONE = { width: 71.5, height: 146.7, radius: 10.2, depth: 7.1 };

function roundedRect(width, height, radius) {
  const shape = new THREE.Shape();
  const signedDistance = (x, y) => {
    const qx = Math.abs(x) - (width / 2 - radius);
    const qy = Math.abs(y) - (height / 2 - radius);
    return (
      Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
      Math.min(Math.max(qx, qy), 0) -
      radius
    );
  };
  const pointCount = 192;
  for (let index = 0; index < pointCount; index += 1) {
    const angle = (index / pointCount) * Math.PI * 2;
    let inside = 0;
    let outside = Math.max(width, height);
    for (let step = 0; step < 20; step += 1) {
      const distance = (inside + outside) / 2;
      if (signedDistance(Math.cos(angle) * distance, Math.sin(angle) * distance) < 0) {
        inside = distance;
      } else {
        outside = distance;
      }
    }
    const distance = (inside + outside) / 2;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function extrudedShape(width, height, radius, depth, bevel = 0.05) {
  const geometry = new THREE.ExtrudeGeometry(roundedRect(width, height, radius), {
    depth,
    bevelEnabled: bevel > 0,
    bevelSegments: 3,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 10,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function makeBrushedTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 1024, 0);
  gradient.addColorStop(0, "#aebbd0");
  gradient.addColorStop(0.5, "#dce4f1");
  gradient.addColorStop(1, "#b8c5d9");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 1024; y += 4) {
    const alpha = (y % 12) * 0.0007 + 0.001;
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillRect(0, y, 1024, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.anisotropy = 4;
  return texture;
}

function makeRoughnessTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  context.fillStyle = "#777";
  context.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 5) {
    context.fillStyle = y % 2 ? "#767676" : "#797979";
    context.fillRect(0, y, 512, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.anisotropy = 4;
  return texture;
}

function makeScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  let texture;
  const draw = () => {
    const background = context.createLinearGradient(0, 0, 420, 1024);
    background.addColorStop(0, "#b9c9de");
    background.addColorStop(0.46, "#e8edf5");
    background.addColorStop(1, "#a8b8cf");
    context.fillStyle = background;
    context.fillRect(0, 0, 512, 1024);

    const waves = [
      { y: 120, x: -180, color: "#f4f6fb" },
      { y: 300, x: 90, color: "#dce4f0" },
      { y: 500, x: -145, color: "#f7f8fb" },
      { y: 710, x: 95, color: "#d9e2ef" },
      { y: 900, x: -150, color: "#f2f5f9" },
    ];
    waves.forEach(({ y, x, color }) => {
      context.save();
      context.shadowColor = "rgba(77, 95, 122, .16)";
      context.shadowBlur = 22;
      context.shadowOffsetY = 8;
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x + 110, y - 100, x + 250, y - 90, x + 360, y - 12);
      context.bezierCurveTo(x + 460, y + 58, x + 530, y + 56, x + 700, y - 46);
      context.lineTo(x + 700, y + 104);
      context.bezierCurveTo(x + 520, y + 190, x + 420, y + 164, x + 330, y + 106);
      context.bezierCurveTo(x + 205, y + 24, x + 104, y + 30, x, y + 122);
      context.closePath();
      const band = context.createLinearGradient(0, y - 90, 0, y + 170);
      band.addColorStop(0, "#ffffff");
      band.addColorStop(0.55, color);
      band.addColorStop(1, "#c5d1e2");
      context.fillStyle = band;
      context.fill();
      context.restore();
    });

    const now = new Date();
    const time = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
      .format(now)
      .toUpperCase();
    const date = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      timeZone: "Asia/Kolkata",
    })
      .format(now)
      .toUpperCase();

    context.fillStyle = "rgba(28, 38, 53, .9)";
    context.font = "600 21px Arial";
    context.fillText(time, 48, 65);
    context.textAlign = "right";
    context.font = "500 17px Arial";
    context.fillText("••• 100%", 464, 65);
    context.textAlign = "center";
    context.font = "500 22px Arial";
    context.fillStyle = "rgba(34, 43, 58, .78)";
    context.fillText(date, 256, 362);
    context.font = "300 112px Arial";
    context.fillStyle = "#253247";
    context.fillText(time.slice(0, -3).trim(), 256, 492);
    context.font = "500 22px Arial";
    context.fillStyle = "rgba(37, 51, 72, .78)";
    context.fillText("INDIA STANDARD TIME  ·  IST", 256, 530);
    context.beginPath();
    context.arc(256, 840, 53, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255, 255, 255, .72)";
    context.lineWidth = 2;
    context.stroke();
    context.font = "400 27px Arial";
    context.fillStyle = "#34455e";
    context.fillText("◉", 256, 850);
    context.textAlign = "left";
    if (texture) texture.needsUpdate = true;
  };
  draw();
  texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, draw };
}

function makeStudio() {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x171a20);
  const dark = new THREE.MeshBasicMaterial({ color: 0x171a20, side: THREE.BackSide });
  const room = new THREE.Mesh(new THREE.BoxGeometry(600, 500, 600), dark);
  studio.add(room);
  const softbox = new THREE.Mesh(
    new THREE.PlaneGeometry(190, 95),
    new THREE.MeshBasicMaterial({ color: 0xffe6c6 })
  );
  softbox.position.set(-150, 140, 55);
  softbox.rotation.set(-0.2, 0.36, -0.3);
  studio.add(softbox);
  const stripOne = new THREE.Mesh(
    new THREE.PlaneGeometry(38, 290),
    new THREE.MeshBasicMaterial({ color: 0xd8e7ff })
  );
  stripOne.position.set(195, 32, -40);
  stripOne.rotation.y = -0.25;
  studio.add(stripOne);
  const stripTwo = stripOne.clone();
  stripTwo.material = stripOne.material.clone();
  stripTwo.material.color.set(0xffc694);
  stripTwo.position.set(-188, -30, -85);
  stripTwo.rotation.y = 0.3;
  studio.add(stripTwo);
  return studio;
}

function addExtrudedPart(parent, geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createPhone(scene) {
  const phone = new THREE.Group();
  scene.add(phone);
  const brushed = makeBrushedTexture();
  const roughness = makeRoughnessTexture();
  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xaab9d0,
    map: brushed,
    roughnessMap: roughness,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
  });
  const backMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8595ae,
    map: brushed,
    metalness: 0.28,
    roughness: 0.34,
    clearcoat: 0.88,
    clearcoatRoughness: 0.2,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x11151c,
    metalness: 0.36,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.93,
  });
  const frame = addExtrudedPart(
    phone,
    extrudedShape(PHONE.width, PHONE.height, PHONE.radius, PHONE.depth, 0.05),
    frameMaterial,
    [0, 0, 0]
  );
  frame.name = "CNC titanium mid-frame, 71.5 × 146.7 mm";

  const frontBezel = addExtrudedPart(
    phone,
    extrudedShape(69.2, 144.2, 9.5, 0.22, 0.025),
    new THREE.MeshPhysicalMaterial({
      color: 0x121418,
      metalness: 0.25,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    [0, 0, 3.56]
  );
  frontBezel.name = "Black ceramic display bezel";

  addExtrudedPart(
    phone,
    extrudedShape(68.6, 143.6, 9.2, 0.12, 0.025),
    glassMaterial,
    [0, 0, 3.7]
  );

  const screen = makeScreenTexture();
  const screenTexture = screen.texture;
  const screenGeometry = new THREE.ShapeGeometry(roundedRect(66.2, 140.6, 8.4), 12);
  const positions = screenGeometry.getAttribute("position");
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index += 1) {
    uvs[index * 2] = positions.getX(index) / 66.2 + 0.5;
    uvs[index * 2 + 1] = positions.getY(index) / 140.6 + 0.5;
  }
  screenGeometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  const display = addExtrudedPart(
    phone,
    screenGeometry,
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
    [0, 0, 3.88]
  );
  display.name = "Rounded OLED display";

  const island = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(25, 7.4, 3.7)),
    new THREE.MeshBasicMaterial({ color: 0x050608 })
  );
  island.position.set(0, 64.7, 3.92);
  phone.add(island);
  const islandCamera = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 24),
    new THREE.MeshBasicMaterial({ color: 0x1d3143 })
  );
  islandCamera.position.set(8.1, 64.7, 3.93);
  phone.add(islandCamera);

  const rearPlate = addExtrudedPart(
    phone,
    extrudedShape(68.7, 143.8, 9, 0.56, 0.05),
    backMaterial,
    [0, 0, -3.48]
  );
  rearPlate.name = "Satin glass back";

  const cameraPlate = addExtrudedPart(
    phone,
    extrudedShape(39, 40, 8, 1, 0.08),
    new THREE.MeshPhysicalMaterial({
      color: 0x94a4bd,
      metalness: 0.42,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    }),
    [-14, 49, -4.25]
  );
  cameraPlate.name = "Camera island";
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050a13,
    metalness: 0.68,
    roughness: 0.09,
    clearcoat: 1,
  });
  const lensRingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc9d3e2,
    metalness: 1,
    roughness: 0.2,
  });
  for (const [x, y] of [
    [-24, 58],
    [-8, 49],
    [-24, 40],
  ]) {
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(5.4, 5.4, 0.9, 40),
      lensRingMaterial
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y, -5.08);
    phone.add(ring);
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(4.35, 4.35, 0.9, 40),
      lensMaterial
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, -5.62);
    phone.add(lens);
    const lensCoating = new THREE.Mesh(
      new THREE.CircleGeometry(3.55, 40),
      new THREE.MeshBasicMaterial({
        color: 0x081427,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      })
    );
    lensCoating.position.set(x, y, -6.1);
    phone.add(lensCoating);
  }
  const cameraFlash = new THREE.Mesh(
    new THREE.CircleGeometry(2.25, 32),
    new THREE.MeshBasicMaterial({ color: 0xf6f3eb, side: THREE.DoubleSide })
  );
  cameraFlash.position.set(0, 59, -4.9);
  phone.add(cameraFlash);
  const lidar = new THREE.Mesh(
    new THREE.CircleGeometry(2.15, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x273143,
      metalness: 0.5,
      roughness: 0.24,
      side: THREE.DoubleSide,
    })
  );
  lidar.position.set(0, 41, -4.9);
  phone.add(lidar);

  const monogramCanvas = document.createElement("canvas");
  monogramCanvas.width = 128;
  monogramCanvas.height = 128;
  const monogramContext = monogramCanvas.getContext("2d");
  monogramContext.fillStyle = "rgba(245, 248, 255, .92)";
  monogramContext.font = "500 62px Georgia";
  monogramContext.textAlign = "center";
  monogramContext.textBaseline = "middle";
  monogramContext.fillText("AA", 64, 64);
  const monogramTexture = new THREE.CanvasTexture(monogramCanvas);
  monogramTexture.colorSpace = THREE.SRGBColorSpace;
  const monogram = new THREE.Mesh(
    new THREE.PlaneGeometry(17, 17),
    new THREE.MeshBasicMaterial({
      map: monogramTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  monogram.position.set(0, -2, -3.86);
  phone.add(monogram);

  const buttonMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd5deec,
    metalness: 1,
    roughness: 0.2,
    clearcoat: 0.8,
  });
  const sideButtons = [
    { x: -36.1, y: 28, height: 18 },
    { x: -36.1, y: -7, height: 30 },
    { x: 36.1, y: 20, height: 23 },
  ];
  for (const { x, y, height } of sideButtons) {
    const button = addExtrudedPart(
      phone,
      extrudedShape(2.5, height, 1.25, 0.6, 0.08),
      buttonMaterial,
      [x, y, 0]
    );
    button.castShadow = true;
  }

  const port = new THREE.Mesh(
    new THREE.BoxGeometry(11, 1.4, 1.5),
    new THREE.MeshBasicMaterial({ color: 0x08090b })
  );
  port.position.set(0, -73.3, 0);
  phone.add(port);
  for (const side of [-1, 1]) {
    for (let index = 0; index < 5; index += 1) {
      const speaker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.8, 12),
        new THREE.MeshBasicMaterial({ color: 0x7d8ca3 })
      );
      speaker.rotation.x = Math.PI / 2;
      speaker.position.set(side * (9 + index * 2.5), -73.2, 0);
      phone.add(speaker);
    }
  }

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(18, 72),
    new THREE.MeshBasicMaterial({ color: 0x101217, transparent: true, opacity: 0.045 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.scale.set(1, 0.24, 1);
  floor.position.set(0, -79, -34);
  scene.add(floor);

  return { phone, screen, floor };
}

const CAMERA_CUES = [
  { selector: "#top", x: 8, y: 0, z: 385, targetX: 12, targetY: 0, rotationY: 0.12, rotationX: 0.04 },
  { selector: "#about", x: 0, y: -3, z: 370, targetX: 0, targetY: 0, rotationY: 1.15, rotationX: 0.1 },
  { selector: "#work", x: -3, y: 1, z: 390, targetX: -4, targetY: 0, rotationY: 3.05, rotationX: -0.06 },
  { selector: "#journey", x: 0, y: -4, z: 378, targetX: 0, targetY: 0, rotationY: 4.65, rotationX: 0.02 },
  { selector: "#contact", x: 7, y: 0, z: 385, targetX: 12, targetY: 0, rotationY: 6.18, rotationX: 0.02 },
];

export default function DeviceScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let renderer;
    let frameId = 0;
    let disposed = false;
    let resizeObserver;
    const disposables = [];
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 10, 1200);
    const lookTarget = new THREE.Vector3(16, 0, 0);
    camera.position.set(8, 0, 400);
    camera.lookAt(lookTarget);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio <= 1.5,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("Unable to initialize the portfolio WebGL scene.", error);
      canvas.dataset.state = "unavailable";
      return undefined;
    }

    const lowPower =
      window.matchMedia("(max-width: 760px)").matches ||
      navigator.hardwareConcurrency <= 4 ||
      navigator.deviceMemory <= 4 ||
      navigator.connection?.saveData;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.25);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0xf4f1ed, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const studio = makeStudio();
    const environment = pmrem.fromScene(studio, 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 1.25;
    scene.add(new THREE.HemisphereLight(0xc3d4ff, 0x241d1c, 1.1));
    const keyLight = new THREE.PointLight(0xffdfbf, 4.5, 520, 2);
    keyLight.position.set(-100, 105, 150);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xd7e6ff, 3.2);
    rimLight.position.set(125, 45, 80);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0xffc997, 2.4);
    fillLight.position.set(-95, -55, 75);
    scene.add(fillLight);

    const device = createPhone(scene);
    let invalidate = () => {};
    const clockInterval = window.setInterval(() => {
      device.screen.draw();
      invalidate();
    }, 10_000);
    disposables.push(() => window.clearInterval(clockInterval));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cueScroll = window.scrollY;
    let cueOffsets = [];
    const updateCueOffsets = () => {
      cueOffsets = CAMERA_CUES.map((cue) => {
        const section = document.querySelector(cue.selector);
        return section ? section.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    updateCueOffsets();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      updateCueOffsets();
      camera.aspect = width / height;
      camera.fov = width < 720 ? 33 : 29;
      device.phone.position.set(width < 720 ? 18 : 92, width < 720 ? -10 : 0, 0);
      device.phone.scale.setScalar(width < 720 ? 0.68 : 0.84);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.25));
      renderer.setSize(width, height);
      invalidate();
    };
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", resize);
    disposables.push(() => window.removeEventListener("resize", resize));

    const onPointerMove = (event) => {
      pointer.set(
        (event.clientX / window.innerWidth - 0.5) * 0.5,
        (event.clientY / window.innerHeight - 0.5) * 0.35
      );
      invalidate();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    disposables.push(() => window.removeEventListener("pointermove", onPointerMove));

    let lastTime = 0;
    const targetCameraPosition = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    let targetRotationX = CAMERA_CUES[0].rotationX;
    let targetRotationY = CAMERA_CUES[0].rotationY;
    disposables.push(() => window.removeEventListener("resize", updateCueOffsets));
    window.addEventListener("resize", updateCueOffsets, { passive: true });

    const animate = (time) => {
      if (disposed) return;
      frameId = 0;
      if (document.visibilityState !== "visible") return;
      if (lastTime === 0) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      cueScroll = reducedMotion ? 0 : window.scrollY;
      if (cueOffsets.length > 1) {
        let index = 0;
        while (index < cueOffsets.length - 2 && cueScroll >= cueOffsets[index + 1]) index += 1;
        const start = cueOffsets[index];
        const end = cueOffsets[index + 1];
        const progress = THREE.MathUtils.clamp((cueScroll - start) / Math.max(1, end - start), 0, 1);
        const from = CAMERA_CUES[index];
        const to = CAMERA_CUES[index + 1];
        const zoom = window.innerWidth < 720 ? 0.88 : 1;
        targetRotationY = THREE.MathUtils.lerp(from.rotationY, to.rotationY, progress);
        targetRotationX = THREE.MathUtils.lerp(from.rotationX, to.rotationX, progress);
        targetCameraPosition.set(
          THREE.MathUtils.lerp(from.x, to.x, progress),
          THREE.MathUtils.lerp(from.y, to.y, progress),
          THREE.MathUtils.lerp(from.z, to.z, progress) * zoom
        );
        targetLookAt.set(
          THREE.MathUtils.lerp(from.targetX, to.targetX, progress),
          THREE.MathUtils.lerp(from.targetY, to.targetY, progress),
          0
        );
        const smoothing = 1 - Math.exp(-7 * delta);
        camera.position.lerp(targetCameraPosition, smoothing);
        lookTarget.lerp(targetLookAt, smoothing);
        device.phone.rotation.y = THREE.MathUtils.damp(
          device.phone.rotation.y,
          targetRotationY,
          6,
          delta
        );
        device.phone.rotation.x = THREE.MathUtils.damp(
          device.phone.rotation.x,
          targetRotationX,
          6,
          delta
        );
      }
      scene.environmentRotation.y = THREE.MathUtils.damp(
        scene.environmentRotation.y,
        pointer.x * 0.32,
        3,
        delta
      );
      scene.environmentRotation.x = THREE.MathUtils.damp(
        scene.environmentRotation.x,
        pointer.y * 0.18,
        3,
        delta
      );
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);

      const stillMoving =
        camera.position.distanceToSquared(targetCameraPosition) > 0.01 ||
        lookTarget.distanceToSquared(targetLookAt) > 0.01 ||
        Math.abs(device.phone.rotation.x - targetRotationX) > 0.001 ||
        Math.abs(device.phone.rotation.y - targetRotationY) > 0.001 ||
        Math.abs(scene.environmentRotation.x - pointer.y * 0.18) > 0.001 ||
        Math.abs(scene.environmentRotation.y - pointer.x * 0.32) > 0.001;
      if (stillMoving) invalidate();
    };
    invalidate = () => {
      if (!disposed && frameId === 0 && document.visibilityState === "visible") {
        frameId = requestAnimationFrame(animate);
      }
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    disposables.push(() => window.removeEventListener("scroll", invalidate));
    document.addEventListener("visibilitychange", invalidate);
    disposables.push(() => document.removeEventListener("visibilitychange", invalidate));
    invalidate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      disposables.forEach((dispose) => dispose());
      const disposeMaterial = (material) => {
        Object.values(material).forEach((value) => {
          if (value?.isTexture) value.dispose();
        });
        material.dispose();
      };
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach(disposeMaterial);
        else if (object.material) disposeMaterial(object.material);
      });
      scene.environment?.dispose();
      pmrem.dispose();
      renderer?.dispose();
      environment.dispose();
      studio.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) disposeMaterial(object.material);
      });
    };
  }, []);

  return <canvas aria-hidden="true" className="device-canvas" ref={canvasRef} />;
}
