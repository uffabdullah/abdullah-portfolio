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
    const background = context.createLinearGradient(0, 0, 512, 1024);
    background.addColorStop(0, "#829cc0");
    background.addColorStop(0.42, "#dce5f2");
    background.addColorStop(1, "#a9bad3");
    context.fillStyle = background;
    context.fillRect(0, 0, 512, 1024);

    const waves = [
      { y: 168, x: -215, color: "#edf2fa" },
      { y: 360, x: 72, color: "#c5d3e7" },
      { y: 570, x: -205, color: "#f6f7fa" },
      { y: 782, x: 72, color: "#bdcce1" },
      { y: 984, x: -214, color: "#eff3f9" },
    ];
    waves.forEach(({ y, x, color }) => {
      context.save();
      context.shadowColor = "rgba(44, 58, 81, .18)";
      context.shadowBlur = 28;
      context.shadowOffsetY = 10;
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x + 130, y - 112, x + 258, y - 94, x + 366, y - 8);
      context.bezierCurveTo(x + 482, y + 82, x + 586, y + 61, x + 720, y - 48);
      context.lineTo(x + 720, y + 132);
      context.bezierCurveTo(x + 565, y + 216, x + 454, y + 188, x + 336, y + 112);
      context.bezierCurveTo(x + 216, y + 30, x + 104, y + 36, x, y + 144);
      context.closePath();
      const band = context.createLinearGradient(0, y - 110, 0, y + 210);
      band.addColorStop(0, "#ffffff");
      band.addColorStop(0.53, color);
      band.addColorStop(1, "#aebfd7");
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

    const ink = "rgba(28, 38, 53, .88)";
    context.fillStyle = ink;
    context.font = "600 20px -apple-system, BlinkMacSystemFont, Arial, sans-serif";
    context.fillText(time, 38, 64);

    context.save();
    context.strokeStyle = ink;
    context.fillStyle = ink;
    context.lineWidth = 3;
    context.lineCap = "round";
    for (let index = 0; index < 4; index += 1) {
      context.fillRect(398 + index * 8, 61 - index * 5, 5, 8 + index * 5);
    }
    context.beginPath();
    context.moveTo(438, 49);
    context.quadraticCurveTo(454, 63, 438, 77);
    context.moveTo(444, 55);
    context.quadraticCurveTo(453, 63, 444, 71);
    context.stroke();
    context.beginPath();
    context.arc(438, 63, 2.2, 0, Math.PI * 2);
    context.fill();
    context.strokeRect(463, 53, 26, 14);
    context.fillRect(489, 57, 3, 6);
    context.fillRect(466, 56, 19, 8);
    context.restore();

    context.textAlign = "center";
    context.font = "500 18px -apple-system, BlinkMacSystemFont, Arial, sans-serif";
    context.fillStyle = "rgba(34, 43, 58, .76)";
    context.fillText(date, 256, 350);
    context.font = "300 112px -apple-system, BlinkMacSystemFont, Arial, sans-serif";
    context.fillStyle = "#26364f";
    context.fillText(time.replace(/\s?[AP]M$/, "").trim(), 256, 476);
    context.font = "500 17px -apple-system, BlinkMacSystemFont, Arial, sans-serif";
    context.fillStyle = "rgba(37, 51, 72, .76)";
    context.fillText("INDIA STANDARD TIME  ·  IST", 256, 512);

    const drawControl = (x, kind) => {
      context.beginPath();
      context.arc(x, 922, 31, 0, Math.PI * 2);
      context.fillStyle = "rgba(31, 43, 63, .3)";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, .8)";
      context.lineWidth = 2;
      context.stroke();
      context.save();
      context.translate(x, 922);
      context.strokeStyle = "#ffffff";
      context.fillStyle = "#ffffff";
      context.lineWidth = 3;
      context.lineCap = "round";
      context.lineJoin = "round";
      if (kind === "flashlight") {
        context.beginPath();
        context.moveTo(-7, -13);
        context.lineTo(7, -13);
        context.lineTo(5, -4);
        context.lineTo(4, 12);
        context.lineTo(-4, 12);
        context.lineTo(-5, -4);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(-5, -5);
        context.lineTo(5, -5);
        context.stroke();
      } else {
        context.strokeRect(-13, -9, 26, 19);
        context.beginPath();
        context.arc(0, 0, 6, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(8, -5, 1, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };
    drawControl(86, "flashlight");
    drawControl(426, "camera");
    context.beginPath();
    context.roundRect(174, 1002, 164, 6, 3);
    context.fillStyle = "rgba(255, 255, 255, .92)";
    context.fill();

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
    color: 0xc3cede,
    map: brushed,
    roughnessMap: roughness,
    metalness: 1,
    roughness: 0.2,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
  });
  const backMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb9c8df,
    metalness: 0.12,
    roughness: 0.28,
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
    extrudedShape(70, 145, 9.8, 0.22, 0.025),
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
    extrudedShape(69.2, 144.2, 9.5, 0.12, 0.025),
    glassMaterial,
    [0, 0, 3.7]
  );

  const screen = makeScreenTexture();
  const screenTexture = screen.texture;
  const screenGeometry = new THREE.ShapeGeometry(roundedRect(68, 142, 9.3), 12);
  const positions = screenGeometry.getAttribute("position");
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index += 1) {
    uvs[index * 2] = positions.getX(index) / 68 + 0.5;
    uvs[index * 2 + 1] = positions.getY(index) / 142 + 0.5;
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
    extrudedShape(43, 45, 9, 1.1, 0.08),
    new THREE.MeshPhysicalMaterial({
      color: 0xc1cde0,
      metalness: 0.34,
      roughness: 0.23,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    }),
    [-14, 49, -4.3]
  );
  cameraPlate.name = "Camera island";
  const lensCanvas = document.createElement("canvas");
  lensCanvas.width = 128;
  lensCanvas.height = 128;
  const lensContext = lensCanvas.getContext("2d");
  const lensGradient = lensContext.createRadialGradient(42, 34, 4, 64, 64, 64);
  lensGradient.addColorStop(0, "#54749b");
  lensGradient.addColorStop(0.17, "#182d4b");
  lensGradient.addColorStop(0.63, "#07101d");
  lensGradient.addColorStop(1, "#02050b");
  lensContext.fillStyle = lensGradient;
  lensContext.fillRect(0, 0, 128, 128);
  lensContext.beginPath();
  lensContext.ellipse(43, 38, 16, 9, -0.65, 0, Math.PI * 2);
  lensContext.fillStyle = "rgba(197, 222, 255, .45)";
  lensContext.fill();
  const lensTexture = new THREE.CanvasTexture(lensCanvas);
  lensTexture.colorSpace = THREE.SRGBColorSpace;
  const lensRingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd5dceb,
    metalness: 0.95,
    roughness: 0.17,
    clearcoat: 0.85,
  });
  const lensMaterial = new THREE.MeshBasicMaterial({
    map: lensTexture,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  for (const [x, y] of [
    [-24, 59],
    [-8, 59],
    [-24, 42],
  ]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.9, 0.62, 12, 48), lensRingMaterial);
    ring.position.set(x, y, -5.03);
    phone.add(ring);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(4.43, 48), lensMaterial);
    lens.position.set(x, y, -5.1);
    phone.add(lens);
    const innerLens = new THREE.Mesh(
      new THREE.CircleGeometry(3.74, 48),
      new THREE.MeshBasicMaterial({
        color: 0x10233d,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
      })
    );
    innerLens.position.set(x, y, -5.12);
    phone.add(innerLens);
  }
  const cameraFlash = new THREE.Mesh(
    new THREE.CircleGeometry(2.3, 32),
    new THREE.MeshBasicMaterial({ color: 0xfffdf5, side: THREE.DoubleSide })
  );
  cameraFlash.position.set(-8, 42, -5.04);
  phone.add(cameraFlash);
  const flashRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.35, 8, 36),
    lensRingMaterial
  );
  flashRing.position.set(-8, 42, -5.03);
  phone.add(flashRing);
  const lidar = new THREE.Mesh(
    new THREE.CircleGeometry(2, 32),
    new THREE.MeshBasicMaterial({ color: 0x111d2d, side: THREE.DoubleSide })
  );
  lidar.position.set(-8, 32, -5.04);
  phone.add(lidar);
  const lidarRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.35, 8, 32),
    lensRingMaterial
  );
  lidarRing.position.set(-8, 32, -5.03);
  phone.add(lidarRing);

  const monogramCanvas = document.createElement("canvas");
  monogramCanvas.width = 128;
  monogramCanvas.height = 128;
  const monogramContext = monogramCanvas.getContext("2d");
  monogramContext.fillStyle = "rgba(51, 66, 88, .68)";
  monogramContext.font = "500 48px Arial";
  monogramContext.textAlign = "center";
  monogramContext.textBaseline = "middle";
  monogramContext.fillText("AA", 64, 64);
  const monogramTexture = new THREE.CanvasTexture(monogramCanvas);
  monogramTexture.colorSpace = THREE.SRGBColorSpace;
  const monogram = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({
      map: monogramTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  monogram.position.set(0, -4, -3.86);
  phone.add(monogram);

  const antennaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdce3ee,
    metalness: 0.55,
    roughness: 0.32,
  });
  for (const side of [-1, 1]) {
    for (const y of [-52, 0, 52]) {
      const antennaBand = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 3.4, PHONE.depth + 0.08),
        antennaMaterial
      );
      antennaBand.position.set(side * (PHONE.width / 2 - 0.04), y, 0);
      phone.add(antennaBand);
    }
  }

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
      device.phone.position.set(width < 720 ? 18 : 92, width < 720 ? -38 : 0, 0);
      device.phone.scale.setScalar(width < 720 ? 0.58 : 0.84);
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
