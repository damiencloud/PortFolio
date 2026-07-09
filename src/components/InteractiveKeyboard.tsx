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
}

// Meta mapping for skills icons and glows
const skillMetaLookup: { [key: string]: { iconName: string; tooltipText: string; glowColor: string } } = {
  "Python": { iconName: "Code2", tooltipText: "Scripting, virtual mic routing & data parsers", glowColor: "#3b82f6" },
  "JavaScript": { iconName: "Cpu", tooltipText: "Dynamic scripts & async WebSocket pairing", glowColor: "#eab308" },
  "HTML & CSS": { iconName: "Layout", tooltipText: "Modern layout structures & CSS transitions", glowColor: "#f97316" },
  "SQL": { iconName: "Database", tooltipText: "Structured queries & relational constraints", glowColor: "#0ea5e9" },
  "React.js": { iconName: "Globe", tooltipText: "Component state hooks & virtual DOM layouts", glowColor: "#06b6d4" },
  "Next.js": { iconName: "Globe", tooltipText: "Server-side rendering, ISR & API middleware", glowColor: "#ffffff" },
  "Tailwind CSS": { iconName: "Layout", tooltipText: "Utility class templates & theme variables", glowColor: "#38bdf8" },
  "Django": { iconName: "Server", tooltipText: "MVC architecture, security layers & dashboards", glowColor: "#10b981" },
  "PostgreSQL": { iconName: "Database", tooltipText: "Scalable relational engines & JSON indexes", glowColor: "#336791" },
  "SQLite": { iconName: "Database", tooltipText: "Embedded audio caching & local settings storage", glowColor: "#0f80cc" },
  "Supabase": { iconName: "Database", tooltipText: "OAuth sessions & row-level security (RLS) tables", glowColor: "#3ecf8e" },
  "AWS (Lightsail, EC2)": { iconName: "Cloud", tooltipText: "Scalable virtual cloud compute instances", glowColor: "#ff9900" },
  "Git & GitHub": { iconName: "GitBranch", tooltipText: "Distributed source history & branching states", glowColor: "#f05032" },
  "Github Actions": { iconName: "Terminal", tooltipText: "Automated compiler checks & CI/CD build scripts", glowColor: "#4f46e5" }
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

  // Automatically map skills to physical keyboard legends
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
      iconName: meta.iconName
    };
  });

  const [selectedSkill, setSelectedSkill] = useState<KeySkill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<KeySkill | null>(null);

  const skillsRef = useRef<KeySkill[]>(keyboardSkills);
  skillsRef.current = keyboardSkills;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const currentSkills = skillsRef.current;
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4.8, 7.8);
    camera.lookAt(0, -0.2, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Studio Lighting & Specular Highlights
    const ambientLight = new THREE.AmbientLight(0x181825, 1.8); // Deep indigo ambient base
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5); // Strong highlight key light
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Subtle blue fill rim light from opposite angle
    const rimLight = new THREE.DirectionalLight(0x4f46e5, 1.2);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    // Dynamic keyboard glow spotlight
    const spotLight = new THREE.SpotLight(0x6366f1, 6, 12, Math.PI / 3, 0.6, 1);
    spotLight.position.set(0, 5, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 5. Build Keyboard Model Group
    const keyboardGroup = new THREE.Group();
    scene.add(keyboardGroup);

    // 5.1 Geometry dimensions & parameters
    const keySpacingX = 0.95;
    const keySpacingZ = 0.95;
    const rowStagger = [0, 0.15, 0.35, 0.5];

    const columnsPerRow = 5;
    const totalRows = Math.ceil(currentSkills.length / columnsPerRow);
    const caseWidth = columnsPerRow * keySpacingX + 0.8;
    const caseDepth = totalRows * keySpacingZ + 0.8;

    // 5.2 Build Case Deck Mesh (MeshPhysicalMaterial with gloss clearcoat lacquer)
    const caseGeo = new THREE.BoxGeometry(caseWidth, 0.35, caseDepth);
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: 0x181822, // Dark anodized base
      roughness: 0.22,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.18
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.position.y = -0.08;
    caseMesh.receiveShadow = true;
    caseMesh.castShadow = true;
    keyboardGroup.add(caseMesh);

    // Dynamic power status led indicator
    const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Green indicator
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(caseWidth / 2 - 0.3, 0.12, -caseDepth / 2 + 0.3);
    keyboardGroup.add(ledMesh);

    // 5.3 Helper to generate crisp Canvas textures dynamically
    const keyTextures: { [key: string]: THREE.CanvasTexture } = {};
    const keyHoverTextures: { [key: string]: THREE.CanvasTexture } = {};

    // Dynamic brand logo drawing method on texture map
    const drawTechLogo = (ctx: CanvasRenderingContext2D, name: string, cx: number, cy: number, size: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      const r = size / 2;

      switch (name.toLowerCase()) {
        case "react.js":
        case "react": {
          ctx.strokeStyle = "#61dafb";
          ctx.lineWidth = 3.5;
          ctx.fillStyle = "#61dafb";
          
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.35, Math.PI / 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.35, -Math.PI / 3, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case "typescript": {
          ctx.fillStyle = "#3178c6";
          ctx.fillRect(-r, -r, size, size);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("TS", r - 4, r - 4);
          break;
        }
        case "javascript": {
          ctx.fillStyle = "#f7df1e";
          ctx.fillRect(-r, -r, size, size);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("JS", r - 4, r - 4);
          break;
        }
        case "html & css":
        case "html": {
          ctx.fillStyle = "#e34f26";
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.85, -r * 0.7);
          ctx.lineTo(r * 0.7, r * 0.75);
          ctx.lineTo(0, r);
          ctx.lineTo(-r * 0.7, r * 0.75);
          ctx.lineTo(-r * 0.85, -r * 0.7);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("5", 0, 2);
          break;
        }
        case "sql": {
          ctx.strokeStyle = "#00bcff";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.4, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.8, r * 0.3, 0, 0, Math.PI);
          ctx.moveTo(-r * 0.8, -r * 0.4);
          ctx.lineTo(-r * 0.8, 0);
          ctx.moveTo(r * 0.8, -r * 0.4);
          ctx.lineTo(r * 0.8, 0);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, r * 0.4, r * 0.8, r * 0.3, 0, 0, Math.PI);
          ctx.moveTo(-r * 0.8, 0);
          ctx.lineTo(-r * 0.8, r * 0.4);
          ctx.moveTo(r * 0.8, 0);
          ctx.lineTo(r * 0.8, r * 0.4);
          ctx.stroke();
          break;
        }
        case "next.js":
        case "nextjs": {
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 28px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("N", -2, 0);
          break;
        }
        case "tailwind css":
        case "tailwind": {
          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 24px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("TW", 0, 0);
          break;
        }
        case "django": {
          ctx.fillStyle = "#092e20";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 32px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("d", -2, -2);
          break;
        }
        case "postgresql": {
          ctx.fillStyle = "#336791";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("PG", 0, 0);
          break;
        }
        case "sqlite": {
          ctx.fillStyle = "#0f80cc";
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.8, r * 0.45, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 15px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("lite", 0, 0);
          break;
        }
        case "supabase": {
          ctx.fillStyle = "#3ecf8e";
          ctx.font = "bold 28px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⚡", 0, 0);
          break;
        }
        case "aws (lightsail, ec2)":
        case "aws": {
          ctx.fillStyle = "#ff9900";
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("AWS", 0, -4);
          ctx.beginPath();
          ctx.arc(0, 6, r * 0.4, 0.2, Math.PI - 0.2);
          ctx.strokeStyle = "#ff9900";
          ctx.lineWidth = 3;
          ctx.stroke();
          break;
        }
        case "git & github":
        case "git": {
          ctx.fillStyle = "#f05032";
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
          ctx.rotate(-Math.PI / 4);
          
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case "github actions": {
          ctx.fillStyle = "#24292e";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#4f46e5";
          ctx.font = "bold 20px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(">_", 0, 0);
          break;
        }
        default: {
          ctx.fillStyle = "#6366f1";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(name.substring(0, 2).toUpperCase(), 0, 0);
          break;
        }
      }
      ctx.restore();
    };

    const generateKeyTexture = (legend: string, name: string, isHovered: boolean) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Base background color
      ctx.fillStyle = isHovered ? "#232433" : "#13131a";
      ctx.fillRect(0, 0, 256, 256);

      // Keycap border outline rim
      ctx.strokeStyle = isHovered ? "#6366f1" : "#2a2b3d";
      ctx.lineWidth = isHovered ? 14 : 6;
      ctx.strokeRect(7, 7, 242, 242);

      // Mapped Legend Legend in top-left
      ctx.font = "bold 32px monospace";
      ctx.fillStyle = isHovered ? "#818cf8" : "#71717a";
      ctx.fillText(legend, 30, 60);

      // Center logo drawing
      drawTechLogo(ctx, name, 128, 140, 76);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    currentSkills.forEach((skill) => {
      const normalTex = generateKeyTexture(skill.legend, skill.name, false);
      const hoverTex = generateKeyTexture(skill.legend, skill.name, true);
      if (normalTex) keyTextures[skill.key] = normalTex;
      if (hoverTex) keyHoverTextures[skill.key] = hoverTex;
    });

    // 5.4 Rounded keycap shapes generator using Shape extrusion
    const createKeycapGeometry = () => {
      const w = 0.72;
      const d = 0.72;
      const radius = 0.15; // rounded corner radius

      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + radius, -d / 2);
      shape.lineTo(w / 2 - radius, -d / 2);
      shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + radius);
      shape.lineTo(w / 2, d / 2 - radius);
      shape.quadraticCurveTo(w / 2, d / 2, w / 2 - radius, d / 2);
      shape.lineTo(-w / 2 + radius, d / 2);
      shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - radius);
      shape.lineTo(-w / 2, -d / 2 + radius);
      shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + radius, -d / 2);

      const extrudeSettings = {
        steps: 1,
        depth: 0.16,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.06,
        bevelOffset: -0.015,
        bevelSegments: 6
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.rotateX(-Math.PI / 2); // Orient upwards
      return geo;
    };

    const capGeo = createKeycapGeometry();

    // 5.5 Generate Keycap meshes and register GSAP springs
    const keycaps: {
      mesh: THREE.Group;
      skill: KeySkill;
      restY: number;
      targetY: number;
      glowRing: THREE.Mesh;
    }[] = [];

    // Underglow ring geometries for beautiful ambient reflections
    const glowGeo = new THREE.RingGeometry(0.38, 0.44, 24);

    currentSkills.forEach((skill, idx) => {
      const row = Math.floor(idx / columnsPerRow);
      const col = idx % columnsPerRow;

      const stagger = rowStagger[row] || 0;
      const posX = -((columnsPerRow - 1) * keySpacingX) / 2 + stagger + col * keySpacingX - 0.1;
      const posZ = -((totalRows - 1) * keySpacingZ) / 2 + row * keySpacingZ;
      const posY = 0.2;

      const capGroup = new THREE.Group();
      capGroup.position.set(posX, posY, posZ);
      keyboardGroup.add(capGroup);

      // Dynamic glow ring below the keycap
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(skill.glow),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.rotation.x = -Math.PI / 2;
      glowMesh.position.y = -0.075; // Sits flat on the case deck
      capGroup.add(glowMesh);

      // Top face dynamic canvas texture material
      const normalTex = keyTextures[skill.key];
      const faceMaterials = [
        new THREE.MeshPhysicalMaterial({ color: 0x1a1a24, roughness: 0.15, metalness: 0.1, clearcoat: 0.9, clearcoatRoughness: 0.1 }), // Side panels
        new THREE.MeshPhysicalMaterial({ map: normalTex, roughness: 0.12, metalness: 0.05, clearcoat: 1.0, clearcoatRoughness: 0.08 }) // Top face map
      ];

      // Assign materials
      const capMesh = new THREE.Mesh(capGeo, faceMaterials);
      
      // Assign material index for top faces
      const position = capGeo.attributes.position;
      const groups = capGeo.groups;
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

    // 6. Camera Tilt & Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    let targetRotX = 0.18;
    let targetRotY = -0.08;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      // Natural tilt and lighting direction changes
      targetRotX = 0.18 - y * 0.2;
      targetRotY = -0.08 + x * 0.24;
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      targetRotX = 0.18;
      targetRotY = -0.08;
      setHoveredSkill(null);
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

            // Play premium spring rebound click animation with GSAP
            const tl = gsap.timeline();
            tl.to(cap.mesh.position, {
              y: cap.restY - 0.08, // Depress down
              duration: 0.08,
              ease: "power2.out"
            }).to(cap.mesh.position, {
              y: cap.restY + 0.12, // Rebound spring bounce back up
              duration: 0.35,
              ease: "elastic.out(1, 0.4)"
            });

            // LED pulse status
            gsap.to(ledMesh.position, { y: 0.15, duration: 0.05, yoyo: true, repeat: 1 });
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mouseleave", handleMouseLeave);
    dom.addEventListener("click", handleCanvasClick);

    // 7. Physical keyboard bindings with GSAP Springs
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
        gsap.killTweensOf(cap.mesh.position);
        gsap.to(cap.mesh.position, {
          y: cap.restY - 0.08,
          duration: 0.08,
          ease: "power2.out"
        });
        
        // Spot light color track glow
        spotLight.color.setHex(parseInt(cap.skill.glow.replace("#", "0x")));
        spotLight.intensity = 8;
      }
    };

    const handlePhysicalKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const cap = keycaps.find((k) => k.skill.key === key);
      if (cap) {
        gsap.killTweensOf(cap.mesh.position);
        gsap.to(cap.mesh.position, {
          y: cap.restY,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)" // Spring bounce
        });
        spotLight.intensity = 6;
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    window.addEventListener("keyup", handlePhysicalKeyUp);

    // 8. Resize handler
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation loop with GSAP spring updates
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastHoveredCap: typeof keycaps[0] | null = null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Keyboard slow floating rotation matching reference appearance
      keyboardGroup.position.y = Math.sin(time * 1.3) * 0.06;

      // Subtly rotate directional light to change specular highlights naturally
      mainLight.position.x = 4 + Math.sin(time * 0.5) * 1.5;
      mainLight.position.z = 5 + Math.cos(time * 0.5) * 1.5;

      // Smooth camera tilt lerp
      keyboardGroup.rotation.x += (targetRotX - keyboardGroup.rotation.x) * 0.08;
      keyboardGroup.rotation.y += (targetRotY - keyboardGroup.rotation.y) * 0.08;

      // Raycaster collision checking
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

      // Switch textures and trigger spring lift on hover change
      if (currentHoveredCap !== lastHoveredCap) {
        // Reset previous hovered keycap
        if (lastHoveredCap) {
          const prevCap = lastHoveredCap;
          gsap.killTweensOf(prevCap.mesh.position);
          gsap.killTweensOf(prevCap.mesh.rotation);
          gsap.killTweensOf(prevCap.glowRing.material);

          // Spring return to original position
          gsap.to(prevCap.mesh.position, {
            y: prevCap.restY,
            duration: 0.45,
            ease: "elastic.out(1, 0.55)"
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

          // Restore normal face material texture
          const topMesh = prevCap.mesh.children[2] as THREE.Mesh;
          if (topMesh && Array.isArray(topMesh.material)) {
            const topMat = topMesh.material[2] as THREE.MeshPhysicalMaterial;
            if (topMat) {
              topMat.map = keyTextures[prevCap.skill.key];
              topMat.needsUpdate = true;
            }
          }
        }

        // Apply visual hover state to new keycap
        if (currentHoveredCap) {
          const newCap = currentHoveredCap;
          gsap.killTweensOf(newCap.mesh.position);
          gsap.killTweensOf(newCap.mesh.rotation);
          gsap.killTweensOf(newCap.glowRing.material);

          // Smoothly lift and tilt keycap
          gsap.to(newCap.mesh.position, {
            y: newCap.restY + 0.15,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(newCap.mesh.rotation, {
            x: 0.08,
            z: -0.06,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(newCap.glowRing.material, {
            opacity: 0.85,
            duration: 0.25,
            ease: "power1.out"
          });

          // Swap face materials for hover highlighted texture
          const topMesh = newCap.mesh.children[2] as THREE.Mesh;
          if (topMesh && Array.isArray(topMesh.material)) {
            const topMat = topMesh.material[2] as THREE.MeshPhysicalMaterial;
            if (topMat) {
              topMat.map = keyHoverTextures[newCap.skill.key];
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

    // 10. Memory clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
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
      Object.values(keyTextures).forEach((t) => t.dispose());
      Object.values(keyHoverTextures).forEach((t) => t.dispose());
    };
  }, []);

  return (
    <section className="py-36 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
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
            
            {/* Legend guide */}
            <div className="absolute top-4 left-6 text-[9px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              RENDER_ENGINE: PHYSICAL_SHADERS v0.185
            </div>

            <canvas ref={canvasRef} className="h-full w-full block cursor-grab active:cursor-grabbing" />

            {/* Instruction Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-850 bg-white/60 dark:bg-neutral-900/60 font-mono text-[10px] text-neutral-500 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>LIVE INTERACTION DETECTOR: ACTIVE</span>
            </div>
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
                              className="p-2.5 rounded-xl text-white shadow-sm transition-all duration-300"
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
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm font-sans font-light leading-relaxed mb-4">
                          {active.desc}
                        </p>
                      </div>

                      {/* Terminal config snippet simulation */}
                      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner bg-neutral-955 text-neutral-300 p-4 font-mono text-[9px] leading-normal">
                        <div className="flex items-center justify-between text-neutral-550 border-b border-neutral-900 pb-1.5 mb-1.5 font-mono">
                          <span>LEGEND_TERMINAL</span>
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
