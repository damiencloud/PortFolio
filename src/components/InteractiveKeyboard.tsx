'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
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
  "Next.js": { iconName: "Globe", tooltipText: "Server-side rendering, ISR & API middleware", glowColor: "#64748b" },
  "Tailwind CSS": { iconName: "Layout", tooltipText: "Utility class templates & theme variables", glowColor: "#38bdf8" },
  "Django": { iconName: "Server", tooltipText: "MVC architecture, security layers & dashboards", glowColor: "#10b981" },
  "PostgreSQL": { iconName: "Database", tooltipText: "Scalable relational engines & JSON indexes", glowColor: "#1d4ed8" },
  "SQLite": { iconName: "Database", tooltipText: "Embedded audio caching & local settings storage", glowColor: "#0ea5e9" },
  "Supabase": { iconName: "Database", tooltipText: "OAuth sessions & row-level security (RLS) tables", glowColor: "#34d399" },
  "AWS (Lightsail, EC2)": { iconName: "Cloud", tooltipText: "Scalable virtual cloud compute instances", glowColor: "#f59e0b" },
  "Git & GitHub": { iconName: "GitBranch", tooltipText: "Distributed source history & branching states", glowColor: "#64748b" },
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

  // Parse skills.ts and build our interactive keys list automatically
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
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Share layout geometry details with ThreeJS hooks
  const keySkillsRef = useRef<KeySkill[]>(keyboardSkills);
  keySkillsRef.current = keyboardSkills;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const currentSkills = keySkillsRef.current;
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Dynamic color spot light that points at the keyboard base
    const spotLight = new THREE.SpotLight(0x6366f1, 4, 15, Math.PI / 4, 0.5, 1);
    spotLight.position.set(0, 4, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 5. Build Keyboard Model Group
    const keyboardGroup = new THREE.Group();
    scene.add(keyboardGroup);

    // 5.1 Keyboard Base Frame Deck
    const keySpacingX = 0.95;
    const keySpacingZ = 0.95;
    const rowStagger = [0, 0.15, 0.35, 0.5];

    // Compute bounds to size the keyboard case
    const columnsPerRow = 5;
    const totalRows = Math.ceil(currentSkills.length / columnsPerRow);
    const caseWidth = columnsPerRow * keySpacingX + 0.8;
    const caseDepth = totalRows * keySpacingZ + 0.8;

    const caseGeo = new THREE.BoxGeometry(caseWidth, 0.3, caseDepth);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x171717, // Charcoal black frame
      roughness: 0.25,
      metalness: 0.85
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.position.y = -0.05;
    caseMesh.receiveShadow = true;
    caseMesh.castShadow = true;
    keyboardGroup.add(caseMesh);

    // Subtle aluminum accent frame rim
    const rimGeo = new THREE.BoxGeometry(caseWidth + 0.05, 0.1, caseDepth + 0.05);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // Anodized indigo rim
      roughness: 0.1,
      metalness: 0.9
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.06;
    keyboardGroup.add(rimMesh);

    // Status LED Lights
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledOffMat = new THREE.MeshBasicMaterial({ color: 0x22c55e }); // Power LED (Green)
    const ledMesh1 = new THREE.Mesh(ledGeo, ledOffMat);
    ledMesh1.position.set(caseWidth / 2 - 0.4, 0.16, -caseDepth / 2 + 0.3);
    keyboardGroup.add(ledMesh1);

    // Dynamic Input LED (blinks/lights on hover/keypress)
    const ledOnMat = new THREE.MeshBasicMaterial({ color: 0x3f3f46 }); // Keypress LED
    const ledMesh2 = new THREE.Mesh(ledGeo, ledOnMat);
    ledMesh2.position.set(caseWidth / 2 - 0.25, 0.16, -caseDepth / 2 + 0.3);
    keyboardGroup.add(ledMesh2);

    // 5.2 Helper to generate key textures programmatically
    const keyTextures: { [key: string]: THREE.CanvasTexture } = {};
    const keyHoverTextures: { [key: string]: THREE.CanvasTexture } = {};

    const generateKeyTexture = (legend: string, name: string, isHovered: boolean) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Solid color base
      ctx.fillStyle = isHovered ? "#2a2b3d" : "#18181b"; // Dark gray keycaps
      ctx.fillRect(0, 0, 128, 128);

      // Keycap border outline
      ctx.strokeStyle = isHovered ? "#6366f1" : "#3f3f46";
      ctx.lineWidth = isHovered ? 8 : 4;
      ctx.strokeRect(4, 4, 120, 120);

      // Draw Key Legend (e.g. Q)
      ctx.font = "bold 24px monospace";
      ctx.fillStyle = isHovered ? "#818cf8" : "#a1a1aa";
      ctx.fillText(legend, 15, 32);

      // Draw Skill Label (e.g. React)
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      
      const displayName = name.split(" ")[0]; // Take first word for space
      ctx.fillText(displayName, 64, 82);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Pre-generate textures for performance
    currentSkills.forEach((skill) => {
      const normalTex = generateKeyTexture(skill.legend, skill.name, false);
      const hoverTex = generateKeyTexture(skill.legend, skill.name, true);
      if (normalTex) keyTextures[skill.key] = normalTex;
      if (hoverTex) keyHoverTextures[skill.key] = hoverTex;
    });

    // 5.3 Generate Keycap Meshes
    const keycaps: {
      mesh: THREE.Group;
      skill: KeySkill;
      restY: number;
      targetY: number;
      currentY: number;
    }[] = [];

    // Create bevel shapes for mechanical profile
    const capBottomGeo = new THREE.BoxGeometry(0.75, 0.15, 0.75);
    const capTopGeo = new THREE.BoxGeometry(0.64, 0.15, 0.64);

    currentSkills.forEach((skill, idx) => {
      const row = Math.floor(idx / columnsPerRow);
      const col = idx % columnsPerRow;

      // Key Positioning coordinates (centered on base frame)
      const stagger = rowStagger[row] || 0;
      const xOffset = -((columnsPerRow - 1) * keySpacingX) / 2 + stagger - 0.1;
      const zOffset = -((totalRows - 1) * keySpacingZ) / 2;

      const posX = xOffset + col * keySpacingX;
      const posZ = zOffset + row * keySpacingZ;
      const posY = 0.22; // Rests above case

      // Key Group (binds meshes together)
      const capGroup = new THREE.Group();
      capGroup.position.set(posX, posY, posZ);
      keyboardGroup.add(capGroup);

      // Bottom half keycap stem
      const bottomMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.5,
        metalness: 0.1
      });
      const bottomMesh = new THREE.Mesh(capBottomGeo, bottomMat);
      bottomMesh.position.y = -0.055;
      bottomMesh.castShadow = true;
      bottomMesh.receiveShadow = true;
      capGroup.add(bottomMesh);

      // Top face keycap lid (holds dynamic text canvas texture on top face)
      const topTex = keyTextures[skill.key];
      const faceMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x27272a }), // Right
        new THREE.MeshStandardMaterial({ color: 0x27272a }), // Left
        new THREE.MeshStandardMaterial({ map: topTex }),      // Top face text
        new THREE.MeshStandardMaterial({ color: 0x27272a }), // Bottom
        new THREE.MeshStandardMaterial({ color: 0x27272a }), // Front
        new THREE.MeshStandardMaterial({ color: 0x27272a })  // Back
      ];
      const topMesh = new THREE.Mesh(capTopGeo, faceMaterials);
      topMesh.position.y = 0.045;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      capGroup.add(topMesh);

      // Register keycap variables
      keycaps.push({
        mesh: capGroup,
        skill: skill,
        restY: posY,
        targetY: posY,
        currentY: posY
      });
    });

    // 6. Raycasting & Mouse move hooks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999); // Offscreen start

    // Target rotation angles for spatial tilt
    let targetRotX = 0.18; // Default resting camera angle
    let targetRotY = -0.08;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      // Gentle keyboard tilt response matching cursor
      targetRotX = 0.18 - y * 0.18;
      targetRotY = -0.08 + x * 0.22;
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      targetRotX = 0.18;
      targetRotY = -0.08;
      setHoveredSkill(null);
    };

    const handleCanvasClick = () => {
      // Find hovered keycap to select
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keyboardGroup.children, true);
      
      if (intersects.length > 0) {
        // Find which group was hit
        let hitGroup: THREE.Object3D | null = intersects[0].object;
        while (hitGroup && hitGroup.parent !== keyboardGroup) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup) {
          const cap = keycaps.find((k) => k.mesh === hitGroup);
          if (cap) {
            setSelectedSkill(cap.skill);
            setPressedKey(cap.skill.key);

            // Depress animation trigger
            cap.targetY = cap.restY - 0.09;
            setTimeout(() => {
              cap.targetY = cap.restY;
              setPressedKey(null);
            }, 180);
          }
        }
      }
    };

    // Bind event listeners to renderer canvas
    const dom = renderer.domElement;
    dom.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mouseleave", handleMouseLeave);
    dom.addEventListener("click", handleCanvasClick);

    // 7. Bind Physical Keyboard keystrokes to depress animations
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when typing in forms
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
        setPressedKey(cap.skill.key);
        cap.targetY = cap.restY - 0.09;
        
        // Spot light intensity boost and color shift on keypress
        spotLight.color.setHex(parseInt(cap.skill.glow.replace("#", "0x")));
        spotLight.intensity = 8;
        ledMesh2.material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
      }
    };

    const handlePhysicalKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const cap = keycaps.find((k) => k.skill.key === key);
      if (cap) {
        cap.targetY = cap.restY;
        setPressedKey(null);
        spotLight.intensity = 4;
        ledMesh2.material = new THREE.MeshBasicMaterial({ color: 0x3f3f46 });
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    window.addEventListener("keyup", handlePhysicalKeyUp);

    // 8. Dynamic resize handler
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      // Keep height relative
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Keyboard case float rotation animation (slow sinusoidal float)
      keyboardGroup.position.y = Math.sin(time * 1.2) * 0.06;

      // Smooth camera tilt lerp
      keyboardGroup.rotation.x += (targetRotX - keyboardGroup.rotation.x) * 0.08;
      keyboardGroup.rotation.y += (targetRotY - keyboardGroup.rotation.y) * 0.08;

      // Raycast hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keyboardGroup.children, true);

      let currentHoveredCap: typeof keycaps[0] | null = null;
      if (intersects.length > 0) {
        // Find main keycap group
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

      // Update hover visual states and textures dynamically
      keycaps.forEach((cap) => {
        const isHovered = currentHoveredCap === cap;
        const isKeyPressed = pressedKey === cap.skill.key;

        // Target heights: Hover shifts keycap up, active/press depresses it
        if (isKeyPressed) {
          cap.targetY = cap.restY - 0.09;
        } else if (isHovered) {
          cap.targetY = cap.restY + 0.12; // Rise up
        } else {
          cap.targetY = cap.restY; // Return to rest
        }

        // Interpolate position (smooth spring-like lerping)
        cap.currentY += (cap.targetY - cap.currentY) * 0.18;
        cap.mesh.position.y = cap.currentY;

        // Material texture updates based on hover states
        const topMesh = cap.mesh.children[1] as THREE.Mesh;
        if (topMesh && Array.isArray(topMesh.material)) {
          const topMat = topMesh.material[2] as THREE.MeshStandardMaterial;
          if (topMat) {
            const currentTex = isHovered ? keyHoverTextures[cap.skill.key] : keyTextures[cap.skill.key];
            if (topMat.map !== currentTex) {
              topMat.map = currentTex;
              topMat.needsUpdate = true;
            }
          }
        }
      });

      // Synchronize states with React for details panel UI
      if (currentHoveredCap) {
        if (hoveredSkill?.key !== currentHoveredCap.skill.key) {
          setHoveredSkill(currentHoveredCap.skill);
          // Set glow spotlights to skill color
          spotLight.color.setHex(parseInt(currentHoveredCap.skill.glow.replace("#", "0x")));
          ledMesh2.material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
        }
        dom.style.cursor = "pointer";
      } else {
        if (hoveredSkill !== null) {
          setHoveredSkill(null);
          ledMesh2.material = new THREE.MeshBasicMaterial({ color: 0x3f3f46 });
        }
        dom.style.cursor = "default";
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean up references
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousemove", handleMouseMove);
      dom.removeEventListener("mouseleave", handleMouseLeave);
      dom.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("keydown", handlePhysicalKeyDown);
      window.removeEventListener("keyup", handlePhysicalKeyUp);
      window.removeEventListener("resize", handleResize);

      // Dispose geometries & materials
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="py-36 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col items-center gap-12 text-center">
        {/* Header Title */}
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-widest text-indigo-500 uppercase">
            Tactile Playground
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-2">
            Interactive 3D Keyboard
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light mt-3 max-w-xl mx-auto">
            Experience realistic Three.js mechanics. Move your mouse to rotate, hover keycaps to inspect skills, or press physical keys on your keyboard to watch the switches activate.
          </p>
        </div>

        {/* 3D Scene View & Skill Sidebar */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-4">
          
          {/* Column 1: WebGL 3D Canvas (Spans 7 columns) */}
          <div ref={containerRef} className="lg:col-span-7 h-[420px] md:h-[480px] w-full flex items-center justify-center relative bg-neutral-900/10 dark:bg-neutral-950/20 border border-neutral-200/40 dark:border-neutral-850/40 rounded-3xl overflow-hidden shadow-inner backdrop-blur-sm">
            
            {/* Legend guide */}
            <div className="absolute top-4 left-6 text-[9px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              RENDER_ENGINE: THREE_JS v0.185
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
                              <h4 className="text-xl font-bold font-sans text-neutral-950 dark:text-neutral-50 leading-tight">
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
                      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner bg-neutral-950 text-neutral-300 p-4 font-mono text-[9px] leading-normal">
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
