'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { skills } from "@/content";
import * as LucideIcons from "lucide-react";

// Structure of skill mapped to keyboard keys
interface KeySkill {
  key: string;
  legend: string;
  name: string;
  category: string;
  level: string;
  desc: string;
  color: string;
  glow: string;
  iconName: string;
  textureUrl: string;
}

// Meta lookup for brand details, icons, and tooltips
const skillMetaLookup: { [key: string]: { iconName: string; tooltipText: string; glowColor: string } } = {
  "Python": { iconName: "Code2", tooltipText: "Backend scripting, automation, and API pipelines", glowColor: "#3776AB" },
  "JavaScript": { iconName: "Cpu", tooltipText: "Interactive client scripts and dynamic behaviors", glowColor: "#F7DF1E" },
  "HTML & CSS": { iconName: "Layout", tooltipText: "Semantic HTML structures and responsive CSS layouts", glowColor: "#E34F26" },
  "SQL": { iconName: "Database", tooltipText: "Structured queries and relational schema modeling", glowColor: "#00758F" },
  "React.js": { iconName: "Globe", tooltipText: "Component-based declarative UI structures and hooks", glowColor: "#61DAFB" },
  "Next.js": { iconName: "Globe", tooltipText: "Full-stack React frame with SSR, ISR, and server actions", glowColor: "#111111" },
  "Tailwind CSS": { iconName: "Layout", tooltipText: "Utility-first design layouts and CSS compiling", glowColor: "#38BDF8" },
  "Django": { iconName: "Server", tooltipText: "Batteries-included secure MVC python web services", glowColor: "#092E20" },
  "PostgreSQL": { iconName: "Database", tooltipText: "Scalable relational engine with JSON data support", glowColor: "#336791" },
  "SQLite": { iconName: "Database", tooltipText: "Lightweight embedded storage for local cache layers", glowColor: "#003B57" },
  "Supabase": { iconName: "Database", tooltipText: "Real-time backend engine with PostgreSQL database tables", glowColor: "#3ECF8E" },
  "AWS (Lightsail, EC2)": { iconName: "Cloud", tooltipText: "Elastic compute cloud structures and domain routes", glowColor: "#FF9900" },
  "Git & GitHub": { iconName: "GitBranch", tooltipText: "Distributed history checks and repository branching", glowColor: "#F05032" },
  "Github Actions": { iconName: "Terminal", tooltipText: "Continuous integration pipelines and compilation runs", glowColor: "#2088FF" }
};

const KEY_LEGENDS = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

// Helper to render Lucide Icons dynamically in details panel
function DetailIcon({ name, size = 20 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Cpu size={size} />;
  return <IconComponent size={size} />;
}

export function InteractiveKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [logosLoaded, setLogosLoaded] = useState(false);
  const logosRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  // Keep ref updated to bypass stale closure triggers in listeners
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Map skills dynamically from content definition file
  const keyboardSkills: KeySkill[] = skills.map((skill, idx) => {
    const legend = KEY_LEGENDS[idx % KEY_LEGENDS.length];
    const meta = skillMetaLookup[skill.name] || { iconName: "Cpu", tooltipText: `${skill.level}% proficiency`, glowColor: "#6366f1" };
    return {
      key: legend.toLowerCase(),
      legend,
      name: skill.name,
      category: skill.category,
      level: `${skill.level}%`,
      desc: meta.tooltipText,
      color: skill.color,
      glow: meta.glowColor,
      iconName: meta.iconName,
      textureUrl: skill.texture || "/assets/logos/react.svg"
    };
  });

  const [selectedSkill, setSelectedSkill] = useState<KeySkill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<KeySkill | null>(null);

  const skillsRef = useRef<KeySkill[]>(keyboardSkills);
  skillsRef.current = keyboardSkills;

  // Preload all logo files from the dynamic skills configuration
  useEffect(() => {
    const promises = keyboardSkills.map((skill) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = skill.textureUrl;
        img.onload = () => {
          logosRef.current[skill.name.toLowerCase()] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to preload logo for ${skill.name} at ${skill.textureUrl}`);
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      setLogosLoaded(true);
    });
  }, []);

  // Synthesize realistic click sound procedurally using Web Audio API
  const playClickSound = () => {
    if (isMutedRef.current) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Sharp pop transient
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      // Hollow switches housing body resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(260, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.05);

      osc2.start();
      osc2.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio Context synthesis blocked:", e);
    }
  };

  // Subtle haptic tick trigger for touch screens
  const triggerHaptic = () => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(6);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!logosLoaded) return;
    if (!canvasRef.current || !containerRef.current) return;

    const currentSkills = skillsRef.current;
    let width = canvasRef.current.clientWidth;
    let height = canvasRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Ortholinear perspective)
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 7.8);
    camera.lookAt(0, -0.2, 0);

    // 3. WebGL Renderer with optimized Pixel Ratio
    const isMobileDevice = window.matchMedia("(pointer: coarse)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobileDevice ? 1.2 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Studio Lighting Configuration
    const ambientLight = new THREE.AmbientLight(0x1e1e2f, 2.2); // Fill light
    scene.add(ambientLight);

    // Keylight (directional with shadow casting)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isMobileDevice ? 512 : 1024;
    keyLight.shadow.mapSize.height = isMobileDevice ? 512 : 1024;
    keyLight.shadow.bias = -0.0006;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 15;
    scene.add(keyLight);

    // Color Fill Light
    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.6);
    fillLight.position.set(-6, 3, 2);
    scene.add(fillLight);

    // Rim Highlight Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    // Spotlight for active glows
    const spotLight = new THREE.SpotLight(0xffffff, 8, 12, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 6, 0);
    scene.add(spotLight);

    // 5. Keyboard Group
    const keyboardGroup = new THREE.Group();
    scene.add(keyboardGroup);

    // Key dimensions and spacing
    const keySpacingX = 0.94;
    const keySpacingZ = 0.94;
    const columnsPerRow = 5;
    const totalRows = Math.ceil(currentSkills.length / columnsPerRow);

    const caseWidth = columnsPerRow * keySpacingX + 0.6;
    const caseDepth = totalRows * keySpacingZ + 0.6;

    // Floor Shadowcatcher Plane
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.32;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Chassis Base Plate Frame
    const createCaseGeometry = (w: number, d: number, h: number) => {
      const shape = new THREE.Shape();
      const r = 0.42;
      shape.moveTo(-w / 2 + r, -d / 2);
      shape.lineTo(w / 2 - r, -d / 2);
      shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
      shape.lineTo(w / 2, d / 2 - r);
      shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
      shape.lineTo(-w / 2 + r, d / 2);
      shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
      shape.lineTo(-w / 2, -d / 2 + r);
      shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);

      const extrudeSettings = {
        steps: 1,
        depth: h,
        bevelEnabled: true,
        bevelThickness: 0.16,
        bevelSize: 0.08,
        bevelSegments: 8
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.rotateX(-Math.PI / 2);
      return geo;
    };

    const caseGeo = createCaseGeometry(caseWidth, caseDepth, 0.42);
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181b, // Matte charcoal chassis
      roughness: 0.28,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.16,
      reflectivity: 0.8
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.position.y = -0.15;
    caseMesh.receiveShadow = true;
    caseMesh.castShadow = true;
    keyboardGroup.add(caseMesh);

    // Status Light LED
    const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(caseWidth / 2 - 0.28, 0.18, -caseDepth / 2 + 0.28);
    keyboardGroup.add(ledMesh);

    // 5.1 Dynamic Canvas SVG Logo Drawing (512x512)
    const keyTextures: { [key: string]: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } } = {};
    const keyHoverTextures: { [key: string]: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } } = {};

    const drawTechLogo = (
      ctx: CanvasRenderingContext2D,
      name: string,
      cx: number,
      cy: number,
      size: number,
      isBumpMap: boolean = false
    ) => {
      // Find logo image from preloaded cache
      const img = logosRef.current[name.toLowerCase()];
      if (img) {
        ctx.save();
        ctx.translate(cx, cy);

        // Center and scale image, bypassing empty SVG dimension bounds safely
        let aspect = 1.0;
        if (img.width && img.height) {
          aspect = img.width / img.height;
        }

        let drawW = size * 0.95;
        let drawH = size * 0.95;
        if (aspect > 1) {
          drawH = (size * 0.95) / aspect;
        } else {
          drawW = (size * 0.95) * aspect;
        }

        if (isBumpMap) {
          // Render white silhouette on transparent/black for the bumpmap relief channel
          const offCanvas = document.createElement("canvas");
          offCanvas.width = 512;
          offCanvas.height = 512;
          const offCtx = offCanvas.getContext("2d");
          if (offCtx) {
            offCtx.drawImage(img, 256 - drawW / 2, 256 - drawH / 2, drawW, drawH);
            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = "#ffffff";
            offCtx.fillRect(0, 0, 512, 512);
            ctx.drawImage(offCanvas, -256, -256);
          }
        } else {
          // Render SVG using official brand colors directly onto the color map
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        }
        ctx.restore();
      }
    };

    const generateKeyTexture = (legend: string, name: string, isHovered: boolean, brandColor: string) => {
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

      // 1. Color Map Canvas
      const colorCanvas = document.createElement("canvas");
      colorCanvas.width = 512;
      colorCanvas.height = 512;
      const colorCtx = colorCanvas.getContext("2d");
      if (!colorCtx) return null;

      // Dark carbon textured keycap top face
      colorCtx.fillStyle = "#1e1e24";
      colorCtx.fillRect(0, 0, 512, 512);

      // Elegant inner border styled with official brand color
      colorCtx.strokeStyle = brandColor;
      colorCtx.lineWidth = 16;
      colorCtx.strokeRect(18, 18, 476, 476);

      // Keyboard Legend Key
      colorCtx.font = "bold 60px monospace";
      colorCtx.fillStyle = "rgba(255,255,255,0.45)";
      colorCtx.fillText(legend, 64, 110);

      drawTechLogo(colorCtx, name, 256, 280, 200, false);

      const colorTex = new THREE.CanvasTexture(colorCanvas);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.anisotropy = maxAnisotropy;
      colorTex.minFilter = THREE.LinearMipmapLinearFilter;
      colorTex.magFilter = THREE.LinearFilter;
      colorTex.generateMipmaps = true;

      // 2. Grayscale Height Map Canvas (Bump Map)
      const bumpCanvas = document.createElement("canvas");
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext("2d");
      if (!bumpCtx) return null;

      bumpCtx.fillStyle = "#000000"; // Base height
      bumpCtx.fillRect(0, 0, 512, 512);

      bumpCtx.strokeStyle = "#444444"; // Raised border
      bumpCtx.lineWidth = 16;
      bumpCtx.strokeRect(18, 18, 476, 476);

      bumpCtx.font = "bold 60px monospace";
      bumpCtx.fillStyle = "#888888"; // Legend height
      bumpCtx.fillText(legend, 64, 110);

      // Force logo outlines to draw pure white inside the heightmap
      drawTechLogo(bumpCtx, name, 256, 280, 200, true);

      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.anisotropy = maxAnisotropy;
      bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
      bumpTex.magFilter = THREE.LinearFilter;
      bumpTex.generateMipmaps = true;

      return { colorTex, bumpTex };
    };

    // Pre-generate dual texture bundles
    currentSkills.forEach((skill) => {
      const normal = generateKeyTexture(skill.legend, skill.name, false, skill.glow);
      const hover = generateKeyTexture(skill.legend, skill.name, true, skill.glow);
      if (normal) keyTextures[skill.key] = { map: normal.colorTex, bump: normal.bumpTex };
      if (hover) keyHoverTextures[skill.key] = { map: hover.colorTex, bump: hover.bumpTex };
    });

    // 5.2 Tapered BoxGeometry keycap with six materials index groups
    const createKeycapGeometry = () => {
      const w = 0.72;
      const h = 0.22;
      const d = 0.72;
      const geo = new THREE.BoxGeometry(w, h, d);

      const posAttr = geo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const y = posAttr.getY(i);
        if (y > 0) {
          // Taper top face vertices inward by 18% (scale factor 0.82)
          posAttr.setX(i, posAttr.getX(i) * 0.82);
          posAttr.setZ(i, posAttr.getZ(i) * 0.82);
        }
      }
      geo.computeVertexNormals();
      return geo;
    };

    const capGeo = createKeycapGeometry();

    // 5.3 Recessed switches plate cutout geometry
    const switchGeo = new THREE.BoxGeometry(0.78, 0.015, 0.78);
    const switchMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.85,
      metalness: 0.1
    });

    // 5.4 Generate Keycap meshes and layout centered rows
    const keycaps: {
      mesh: THREE.Group;
      skill: KeySkill;
      restY: number;
      targetY: number;
      glowRing: THREE.Mesh;
    }[] = [];

    const glowGeo = new THREE.RingGeometry(0.36, 0.44, 24);

    currentSkills.forEach((skill, idx) => {
      const row = Math.floor(idx / columnsPerRow);
      const col = idx % columnsPerRow;

      const keysInThisRow = Math.min(columnsPerRow, currentSkills.length - row * columnsPerRow);
      const posX = -((keysInThisRow - 1) * keySpacingX) / 2 + col * keySpacingX;
      const posZ = -((totalRows - 1) * keySpacingZ) / 2 + row * keySpacingZ;
      const posY = 0.26;

      const capGroup = new THREE.Group();
      capGroup.position.set(posX, posY, posZ);
      keyboardGroup.add(capGroup);

      // Render dark recessed switch plate beneath keycap
      const swMesh = new THREE.Mesh(switchGeo, switchMat);
      swMesh.position.set(posX, 0.01, posZ);
      swMesh.receiveShadow = true;
      keyboardGroup.add(swMesh);

      // Underglow Ring Mesh
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(skill.glow),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.rotation.x = -Math.PI / 2;
      glowMesh.position.y = -0.165;
      capGroup.add(glowMesh);

      // Materials (Semi-matte sides, highly glossy clearcoat embossed top face)
      const capColor = new THREE.Color(skill.glow);
      const textures = keyTextures[skill.key];

      const sideMaterial = new THREE.MeshPhysicalMaterial({
        color: capColor,
        roughness: 0.36,
        metalness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.2
      });

      const topMaterial = new THREE.MeshPhysicalMaterial({
        color: capColor,
        map: textures.map,
        bumpMap: textures.bump,
        bumpScale: 0.0045, // Professional embossed relief
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08
      });

      // Apply top texture ONLY to the top face of the BoxGeometry (Index 2 is Group Y+)
      const faceMaterials = [
        sideMaterial, // Index 0: Right (X+)
        sideMaterial, // Index 1: Left (X-)
        topMaterial,  // Index 2: Top (Y+)
        sideMaterial, // Index 3: Bottom (Y-)
        sideMaterial, // Index 4: Front (Z+)
        sideMaterial  // Index 5: Back (Z-)
      ];

      const capMesh = new THREE.Mesh(capGeo, faceMaterials);
      capMesh.castShadow = true;
      capMesh.receiveShadow = true;
      capGroup.add(capMesh);

      keycaps.push({
        mesh: capGroup,
        skill: skill,
        restY: posY,
        targetY: posY,
        glowRing: glowMesh
      });
    });

    // 6. Raycast Interactions & Eased Mouse coordinate shifts
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    let targetRotX = 0.24;
    let targetRotY = -0.14;
    let currentRotX = 0.24;
    let currentRotY = -0.14;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      targetRotX = 0.24 - y * 0.18;
      targetRotY = -0.14 + x * 0.24;

      // Specular highlight shift mapping
      if (!isMobileDevice) {
        gsap.to(keyLight.position, {
          x: 5 + x * 2.5,
          z: 4 + y * 2.0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      targetRotX = 0.24;
      targetRotY = -0.14;
      setHoveredSkill(null);

      if (!isMobileDevice) {
        gsap.to(keyLight.position, { x: 5, z: 4, duration: 0.8, ease: "power2.out" });
      }
    };

    const handleCanvasClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keyboardGroup.children, true);

      if (intersects.length > 0) {
        let hitGroup: THREE.Object3D | null = intersects[0].object;
        while (hitGroup && hitGroup.parent !== keyboardGroup) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup) {
          const cap = keycaps.find((k) => k.mesh === hitGroup);
          if (cap) {
            setSelectedSkill(cap.skill);
            playClickSound();
            triggerHaptic();

            // Depress Spring Rebound timeline click
            const tl = gsap.timeline();
            tl.to(cap.mesh.position, {
              y: cap.restY - 0.14,
              duration: 0.06,
              ease: "power2.out"
            }).to(cap.mesh.position, {
              y: cap.restY + 0.20,
              duration: 0.45,
              ease: "elastic.out(1, 0.45)"
            });

            // LED pulse glow interaction
            const colorVal = new THREE.Color(cap.skill.glow);
            ledMat.color.copy(colorVal);
            gsap.to(ledMesh.position, { y: 0.20, duration: 0.06, yoyo: true, repeat: 1 });
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mouseleave", handleMouseLeave);
    dom.addEventListener("click", handleCanvasClick);

    // 7. Physical Key Press bindings
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const cap = keycaps.find((k) => k.skill.key === key);
      if (cap) {
        setSelectedSkill(cap.skill);
        playClickSound();
        triggerHaptic();
        
        gsap.killTweensOf(cap.mesh.position);
        gsap.to(cap.mesh.position, {
          y: cap.restY - 0.14,
          duration: 0.06,
          ease: "power2.out"
        });

        const colorVal = new THREE.Color(cap.skill.glow);
        ledMat.color.copy(colorVal);
        spotLight.color.setHex(parseInt(cap.skill.glow.replace("#", "0x")));
        spotLight.intensity = 10;
      }
    };

    const handlePhysicalKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const cap = keycaps.find((k) => k.skill.key === key);
      if (cap) {
        gsap.killTweensOf(cap.mesh.position);
        gsap.to(cap.mesh.position, {
          y: cap.restY,
          duration: 0.5,
          ease: "elastic.out(1, 0.48)"
        });
        spotLight.intensity = 8;
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    window.addEventListener("keyup", handlePhysicalKeyUp);

    // 8. Resize handlers
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 9. Premium Render Loop with float wave
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastHoveredCap: typeof keycaps[0] | null = null;
    let isViewable = true;

    // Viewport Visibility Observer (Performance Optimization)
    const observer = new IntersectionObserver((entries) => {
      isViewable = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(containerRef.current);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isViewable) return;

      const time = clock.getElapsedTime();

      // Fluid float wave and idle rotation offsets
      const floatY = Math.sin(time * 0.95) * 0.05;
      const floatRotX = Math.sin(time * 0.8) * 0.015;
      const floatRotZ = Math.cos(time * 0.9) * 0.015;

      keyboardGroup.position.y = floatY;

      // Elastic spring rotation tilt
      currentRotX += (targetRotX - currentRotX) * 0.085;
      currentRotY += (targetRotY - currentRotY) * 0.085;

      keyboardGroup.rotation.x = currentRotX + floatRotX;
      keyboardGroup.rotation.y = currentRotY;
      keyboardGroup.rotation.z = floatRotZ;

      // Raycast hover tracking
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keyboardGroup.children, true);

      let currentHoveredCap: typeof keycaps[0] | null = null;
      if (intersects.length > 0) {
        let hitGroup: THREE.Object3D | null = intersects[0].object;
        while (hitGroup && hitGroup.parent !== keyboardGroup) {
          hitGroup = hitGroup.parent;
        }
        if (hitGroup) {
          const cap = keycaps.find((k) => k.mesh === hitGroup);
          if (cap) {
            currentHoveredCap = cap;
          }
        }
      }

      // Switch materials and trigger spring offsets on hovered keys
      if (currentHoveredCap !== lastHoveredCap) {
        if (lastHoveredCap) {
          const prevCap = lastHoveredCap;
          gsap.killTweensOf(prevCap.mesh.position);
          gsap.killTweensOf(prevCap.mesh.rotation);
          gsap.killTweensOf(prevCap.glowRing.material);

          gsap.to(prevCap.mesh.position, {
            y: prevCap.restY,
            duration: 0.45,
            ease: "elastic.out(1, 0.52)"
          });
          gsap.to(prevCap.mesh.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.35,
            ease: "power2.out"
          });
          gsap.to(prevCap.glowRing.material, {
            opacity: 0,
            duration: 0.3,
            ease: "power1.out"
          });

          // Restore normal map and normal bump map textures on top material
          const childMesh = prevCap.mesh.children[2] as THREE.Mesh;
          if (childMesh && Array.isArray(childMesh.material)) {
            const topMat = childMesh.material[2] as THREE.MeshPhysicalMaterial;
            if (topMat) {
              const textures = keyTextures[prevCap.skill.key];
              topMat.map = textures.map;
              topMat.bumpMap = textures.bump;
              topMat.needsUpdate = true;
            }
          }
        }

        if (currentHoveredCap) {
          const newCap = currentHoveredCap;
          gsap.killTweensOf(newCap.mesh.position);
          gsap.killTweensOf(newCap.mesh.rotation);
          gsap.killTweensOf(newCap.glowRing.material);

          // Spring lift and directional rotation toward pointer
          gsap.to(newCap.mesh.position, {
            y: newCap.restY + 0.20,
            duration: 0.32,
            ease: "power2.out"
          });
          gsap.to(newCap.mesh.rotation, {
            x: 0.08,
            z: -0.06,
            duration: 0.32,
            ease: "power2.out"
          });
          gsap.to(newCap.glowRing.material, {
            opacity: 0.88,
            duration: 0.22,
            ease: "power1.out"
          });

          // Swap hover map and hover bump map textures on top material
          const childMesh = newCap.mesh.children[2] as THREE.Mesh;
          if (childMesh && Array.isArray(childMesh.material)) {
            const topMat = childMesh.material[2] as THREE.MeshPhysicalMaterial;
            if (topMat) {
              const textures = keyHoverTextures[newCap.skill.key];
              topMat.map = textures.map;
              topMat.bumpMap = textures.bump;
              topMat.needsUpdate = true;
            }
          }

          setHoveredSkill(newCap.skill);
          spotLight.color.setHex(parseInt(newCap.skill.glow.replace("#", "0x")));
          dom.style.cursor = "pointer";
        } else {
          setHoveredSkill(null);
          dom.style.cursor = "default";
        }

        lastHoveredCap = currentHoveredCap;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean up references on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      dom.removeEventListener("mousemove", handleMouseMove);
      dom.removeEventListener("mouseleave", handleMouseLeave);
      dom.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("keydown", handlePhysicalKeyDown);
      window.removeEventListener("keyup", handlePhysicalKeyUp);
      window.removeEventListener("resize", handleResize);

      scene.clear();
      renderer.dispose();
      capGeo.dispose();
      caseGeo.dispose();
      ledGeo.dispose();
      glowGeo.dispose();
      Object.values(keyTextures).forEach((t) => {
        t.map.dispose();
        t.bump.dispose();
      });
      Object.values(keyHoverTextures).forEach((t) => {
        t.map.dispose();
        t.bump.dispose();
      });
    };
  }, [logosLoaded]);

  return (
    <section className="py-20 md:py-36 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col items-center gap-12 text-center">
        {/* Title */}
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-widest text-indigo-500 uppercase">
            Signature Interaction
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-2">
            Interactive 3D Keyboard
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light mt-3 max-w-xl mx-auto">
            Experience realistic Three.js mechanics with ExtrudeGeometry bevel shapes and MeshPhysicalMaterial reflections. Hover keys to trigger ambient glows or type to activate switches.
          </p>
        </div>

        {/* 3D Scene View & Skill Sidebar */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-4">
          
          {/* Column 1: WebGL 3D Canvas (Spans 7 columns) */}
          <div ref={containerRef} className="lg:col-span-7 h-[420px] md:h-[480px] w-full flex items-center justify-center relative bg-neutral-900/10 dark:bg-neutral-950/20 border border-neutral-200/40 dark:border-neutral-850/40 rounded-3xl overflow-hidden shadow-inner backdrop-blur-sm">
            
            {/* Audio Toggle Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-105 dark:hover:bg-neutral-850 hover:text-indigo-500 transition-colors z-20 cursor-pointer"
              aria-label="Toggle mechanical switch click sound"
            >
              {isMuted ? <LucideIcons.VolumeX size={15} /> : <LucideIcons.Volume2 size={15} />}
            </button>

            {!logosLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-50/10 dark:bg-neutral-900/10 backdrop-blur-sm z-10">
                <LucideIcons.Loader2 className="animate-spin text-indigo-500" size={32} />
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Loading official brand SVGs...
                </p>
              </div>
            )}

            <canvas ref={canvasRef} className="h-full w-full block cursor-grab active:cursor-grabbing" />
          </div>

          {/* Column 2: Selected Skill Case display (Spans 5 columns) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {hoveredSkill || selectedSkill ? (
                (() => {
                  const active = hoveredSkill || selectedSkill;
                  if (!active) return null;
                  return (
                    <motion.div
                      key={active.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="rounded-3xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-md p-6 text-left shadow-lg relative overflow-hidden h-[300px] flex flex-col justify-between"
                    >
                      {/* Decorative glowing gradient blur behind */}
                      <div 
                        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none -z-10 opacity-30 transition-all duration-300"
                        style={{ backgroundColor: active.glow }}
                      />

                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2.5 rounded-xl text-white shadow-sm transition-all duration-300 animate-pulse"
                              style={{ backgroundColor: active.glow }}
                            >
                              <DetailIcon name={active.iconName} size={16} />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold font-sans text-neutral-955 dark:text-neutral-50 leading-tight">
                                {active.name}
                              </h4>
                              <span className="text-[10px] font-semibold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mt-0.5 block">
                                {active.category} COMPONENT
                              </span>
                            </div>
                          </div>
                          
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                            {active.level}
                          </span>
                        </div>

                        {/* Body description */}
                        <p className="text-neutral-600 dark:text-neutral-450 text-sm font-sans font-light leading-relaxed mb-4">
                          {active.desc}
                        </p>
                      </div>

                      {/* Terminal config snippet simulation */}
                      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner bg-neutral-955 text-neutral-300 p-4 font-mono text-[9px] leading-normal">
                        <div className="flex items-center justify-between text-neutral-550 border-b border-neutral-900 pb-1.5 mb-1.5 font-mono">
                          <span>THREEJS_TERMINAL</span>
                          <span>SWITCH_{active.legend}</span>
                        </div>
                        <div className="text-indigo-400">
                          $ get --capability {active.name.toLowerCase().replace(/[^a-z0-9]/g, "")}
                        </div>
                        <div className="text-emerald-400">
                          &gt; Rendering 3D keycaps: OK (Mesh {active.legend})
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center gap-4 h-[300px] bg-neutral-50/50 dark:bg-neutral-950/20"
                >
                  <LucideIcons.KeyRound size={32} className="text-neutral-400 dark:text-neutral-600 animate-pulse" />
                  <div>
                    <h4 className="text-base font-bold font-sans text-neutral-800 dark:text-neutral-350">
                      Hardware Switch Offline
                    </h4>
                    <p className="text-xs text-neutral-500 font-light mt-1.5 max-w-xs leading-normal">
                      Move your mouse to inspect keycaps, press virtual buttons, or type on your physical keyboard to load detailed competency metrics.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveKeyboard;
