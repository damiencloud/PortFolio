'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";
import * as THREE from "three";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { skills } from "@/content";
import * as LucideIcons from "lucide-react";

// --------------------------------------------------------------------------
// Spline Configuration Parameter
// Replace this URL with your custom Spline design (.splinecode or .json scene)
// --------------------------------------------------------------------------
const SPLINE_SCENE_URL = "https://prod.spline.design/j7vO2k9YwB92P2aK/scene.splinecode";

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

// Meta lookup for brand details, custom vector logos, and tooltips
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

// React Error Boundary to catch Spline compilation or asset loading errors
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Spline loading error caught. Rendering Three.js fallback keyboard:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Master component wrapper
export function InteractiveKeyboard() {
  return (
    <SplineErrorBoundary fallback={<ThreeJSKeyboardFallback />}>
      <SplineKeyboard />
    </SplineErrorBoundary>
  );
}

// --------------------------------------------------------------------------
// Spline 3D Keyboard Scene Component
// --------------------------------------------------------------------------
function SplineKeyboard() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const splineRef = useRef<any>(null);

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const playClickSound = () => {
    if (isMutedRef.current) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

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
    } catch (e) {}
  };

  const triggerHaptic = () => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(6);
      }
    } catch (e) {}
  };

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

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setSplineLoaded(true);

    try {
      splineApp.addEventListener("mouseDown", (e: any) => {
        const targetName = e.target?.name;
        if (!targetName) return;

        const matched = skillsRef.current.find(s => 
          s.name.toLowerCase() === targetName.toLowerCase() ||
          s.key.toLowerCase() === targetName.toLowerCase() ||
          s.legend.toLowerCase() === targetName.toLowerCase()
        );

        if (matched) {
          setSelectedSkill(matched);
          playClickSound();
          triggerHaptic();
        }
      });

      splineApp.addEventListener("mouseHover", (e: any) => {
        const targetName = e.target?.name;
        if (!targetName) {
          setHoveredSkill(null);
          return;
        }

        const matched = skillsRef.current.find(s => 
          s.name.toLowerCase() === targetName.toLowerCase() ||
          s.key.toLowerCase() === targetName.toLowerCase() ||
          s.legend.toLowerCase() === targetName.toLowerCase()
        );

        if (matched) {
          setHoveredSkill(matched);
        } else {
          setHoveredSkill(null);
        }
      });
    } catch (err) {
      console.warn("Spline event registration failed:", err);
    }
  };

  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const cap = skillsRef.current.find((k) => k.key === key);
      if (cap) {
        setSelectedSkill(cap);
        playClickSound();
        triggerHaptic();

        if (splineRef.current) {
          try {
            const obj = splineRef.current.findObjectByName(cap.name) ||
                        splineRef.current.findObjectByName(cap.legend) ||
                        splineRef.current.findObjectByName(cap.key.toUpperCase());
            if (obj) {
              gsap.killTweensOf(obj.position);
              const originalY = obj.position.y;
              gsap.to(obj.position, {
                y: originalY - 12,
                duration: 0.08,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
              });
            }
          } catch (err) {}
        }
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyDown);
    };
  }, [splineLoaded]);

  return (
    <section className="py-20 md:py-36 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col items-center gap-12 text-center">
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-widest text-indigo-500 uppercase">
            Signature Interaction
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-2">
            Interactive 3D Keyboard
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light mt-3 max-w-xl mx-auto">
            Experience realistic Spline 3D mechanics and visual rendering. Hover keycaps to preview skill details or interact via typing on your physical keyboard.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-4">
          <div className="lg:col-span-7 h-[420px] md:h-[480px] w-full flex items-center justify-center relative bg-neutral-900/10 dark:bg-neutral-950/20 border border-neutral-200/40 dark:border-neutral-850/40 rounded-3xl overflow-hidden shadow-inner backdrop-blur-sm">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-105 dark:hover:bg-neutral-850 hover:text-indigo-500 transition-colors z-20 cursor-pointer"
              aria-label="Toggle mechanical switch click sound"
            >
              {isMuted ? <LucideIcons.VolumeX size={15} /> : <LucideIcons.Volume2 size={15} />}
            </button>

            {!splineLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-50/10 dark:bg-neutral-900/10 backdrop-blur-sm z-10">
                <LucideIcons.Loader2 className="animate-spin text-indigo-500" size={32} />
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Compiling Spline 3D Scene...
                </p>
              </div>
            )}

            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={handleSplineLoad}
              className="h-full w-full block cursor-grab active:cursor-grabbing"
            />
          </div>

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
                      <div 
                        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none -z-10 opacity-30 transition-all duration-300"
                        style={{ backgroundColor: active.glow }}
                      />

                      <div>
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

                        <p className="text-neutral-600 dark:text-neutral-450 text-sm font-sans font-light leading-relaxed mb-4">
                          {active.desc}
                        </p>
                      </div>

                      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner bg-neutral-955 text-neutral-300 p-4 font-mono text-[9px] leading-normal">
                        <div className="flex items-center justify-between text-neutral-550 border-b border-neutral-900 pb-1.5 mb-1.5 font-mono">
                          <span>SPLINE_TERMINAL</span>
                          <span>SWITCH_{active.legend}</span>
                        </div>
                        <div className="text-indigo-400">
                          $ get --capability {active.name.toLowerCase().replace(/[^a-z0-9]/g, "")}
                        </div>
                        <div className="text-emerald-400">
                          &gt; Spline 3D object active: OK ({active.legend})
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
                      Move your mouse to inspect keycaps in Spline, click virtual keys, or type on your physical keyboard to load detailed competency metrics.
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

// --------------------------------------------------------------------------
// Three.js Fallback 3D Keyboard Component
// --------------------------------------------------------------------------
function ThreeJSKeyboardFallback() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [logosLoaded, setLogosLoaded] = useState(false);
  const logosRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const logoFiles: { [key: string]: string } = {
      "python": "/tech-logos/python.svg",
      "javascript": "/tech-logos/javascript.svg",
      "html5": "/tech-logos/html5.svg",
      "css3": "/tech-logos/css3.svg",
      "sql": "/tech-logos/mysql.svg",
      "react.js": "/tech-logos/react.svg",
      "react": "/tech-logos/react.svg",
      "next.js": "/tech-logos/nextdotjs.svg",
      "tailwind css": "/tech-logos/tailwindcss.svg",
      "django": "/tech-logos/django.svg",
      "postgresql": "/tech-logos/postgresql.svg",
      "sqlite": "/tech-logos/sqlite.svg",
      "supabase": "/tech-logos/supabase.svg",
      "aws (lightsail, ec2)": "/tech-logos/amazonwebservices.svg",
      "aws": "/tech-logos/amazonwebservices.svg",
      "git & github": "/tech-logos/git.svg",
      "git": "/tech-logos/git.svg",
      "github": "/tech-logos/github.svg",
      "github actions": "/tech-logos/github.svg",
      "node.js": "/tech-logos/nodedotjs.svg",
      "express.js": "/tech-logos/express.svg",
      "docker": "/tech-logos/docker.svg",
      "mongodb": "/tech-logos/mongodb.svg",
      "vite": "/tech-logos/vite.svg",
      "framer motion": "/tech-logos/framer.svg",
      "gsap": "/tech-logos/greensock.svg"
    };

    const promises = Object.entries(logoFiles).map(([key, url]) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
          logosRef.current[key] = img;
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      setLogosLoaded(true);
    });
  }, []);

  const playClickSound = () => {
    if (isMutedRef.current) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

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
    } catch (e) {}
  };

  const triggerHaptic = () => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(6);
      }
    } catch (e) {}
  };

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
    if (!logosLoaded) return;
    if (!canvasRef.current || !containerRef.current) return;

    const currentSkills = skillsRef.current;
    let width = canvasRef.current.clientWidth;
    let height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 7.8);
    camera.lookAt(0, -0.2, 0);

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

    const ambientLight = new THREE.AmbientLight(0x1e1e2f, 2.2);
    scene.add(ambientLight);

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

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.6);
    fillLight.position.set(-6, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    const spotLight = new THREE.SpotLight(0xffffff, 8, 12, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 6, 0);
    scene.add(spotLight);

    const keyboardGroup = new THREE.Group();
    scene.add(keyboardGroup);

    const keySpacingX = 0.94;
    const keySpacingZ = 0.94;
    const columnsPerRow = 5;
    const totalRows = Math.ceil(currentSkills.length / columnsPerRow);

    const caseWidth = columnsPerRow * keySpacingX + 0.6;
    const caseDepth = totalRows * keySpacingZ + 0.6;

    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.32;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

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
      color: 0x18181b,
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

    const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(caseWidth / 2 - 0.28, 0.18, -caseDepth / 2 + 0.28);
    keyboardGroup.add(ledMesh);

    const keyTextures: { [key: string]: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } } = {};
    const keyHoverTextures: { [key: string]: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } } = {};

    const drawTechLogo = (
      ctx: CanvasRenderingContext2D,
      name: string,
      cx: number,
      cy: number,
      size: number,
      isHovered: boolean,
      isBumpMap: boolean = false
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      const r = size / 2;

      const drawSingleLogo = (img: HTMLImageElement, scale = 1.0) => {
        const aspect = img.width / img.height || 1;
        let drawW = size * scale;
        let drawH = size * scale;
        if (aspect > 1) {
          drawH = (size * scale) / aspect;
        } else {
          drawW = (size * scale) * aspect;
        }
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
      };

      const keyName = name.toLowerCase();

      if (keyName === "html & css") {
        const imgHtml = logosRef.current["html5"];
        const imgCss = logosRef.current["css3"];
        if (imgHtml && imgCss) {
          ctx.save();
          ctx.translate(-r * 0.45, 0);
          drawSingleLogo(imgHtml, 0.65);
          ctx.restore();
          ctx.save();
          ctx.translate(r * 0.45, 0);
          drawSingleLogo(imgCss, 0.65);
          ctx.restore();
        }
      } else if (keyName === "git & github") {
        const imgGit = logosRef.current["git"];
        const imgGithub = logosRef.current["github"];
        if (imgGit && imgGithub) {
          ctx.save();
          ctx.translate(-r * 0.45, 0);
          drawSingleLogo(imgGit, 0.65);
          ctx.restore();
          ctx.save();
          ctx.translate(r * 0.45, 0);
          drawSingleLogo(imgGithub, 0.65);
          ctx.restore();
        }
      } else {
        const img = logosRef.current[keyName];
        if (img) {
          drawSingleLogo(img, 0.95);
        } else {
          ctx.font = "bold 60px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(name.substring(0, 3).toUpperCase(), 0, 0);
        }
      }

      ctx.restore();
    };

    const generateKeyTexture = (legend: string, name: string, isHovered: boolean, brandColor: string) => {
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

      const colorCanvas = document.createElement("canvas");
      colorCanvas.width = 512;
      colorCanvas.height = 512;
      const colorCtx = colorCanvas.getContext("2d");
      if (!colorCtx) return null;

      colorCtx.fillStyle = brandColor;
      colorCtx.fillRect(0, 0, 512, 512);
      colorCtx.strokeStyle = "rgba(255,255,255,0.18)";
      colorCtx.lineWidth = 12;
      colorCtx.strokeRect(18, 18, 476, 476);
      colorCtx.font = "bold 60px monospace";
      colorCtx.fillStyle = "rgba(255,255,255,0.45)";
      colorCtx.fillText(legend, 64, 110);

      drawTechLogo(colorCtx, name, 256, 280, 200, isHovered, false);

      const colorTex = new THREE.CanvasTexture(colorCanvas);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.anisotropy = maxAnisotropy;
      colorTex.minFilter = THREE.LinearMipmapLinearFilter;
      colorTex.generateMipmaps = true;

      const bumpCanvas = document.createElement("canvas");
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext("2d");
      if (!bumpCtx) return null;

      bumpCtx.fillStyle = "#000000";
      bumpCtx.fillRect(0, 0, 512, 512);
      bumpCtx.strokeStyle = "#444444";
      bumpCtx.lineWidth = 12;
      bumpCtx.strokeRect(18, 18, 476, 476);
      bumpCtx.font = "bold 60px monospace";
      bumpCtx.fillStyle = "#888888";
      bumpCtx.fillText(legend, 64, 110);

      drawTechLogo(bumpCtx, name, 256, 280, 200, isHovered, true);

      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.anisotropy = maxAnisotropy;
      bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
      bumpTex.generateMipmaps = true;

      return { colorTex, bumpTex };
    };

    currentSkills.forEach((skill) => {
      const normal = generateKeyTexture(skill.legend, skill.name, false, skill.glow);
      const hover = generateKeyTexture(skill.legend, skill.name, true, skill.glow);
      if (normal) keyTextures[skill.key] = { map: normal.colorTex, bump: normal.bumpTex };
      if (hover) keyHoverTextures[skill.key] = { map: hover.colorTex, bump: hover.bumpTex };
    });

    const createKeycapGeometry = () => {
      const w = 0.72;
      const d = 0.72;
      const radius = 0.15;

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
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.07,
        bevelOffset: -0.045,
        bevelSegments: 5
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.rotateX(-Math.PI / 2);
      return geo;
    };

    const capGeo = createKeycapGeometry();

    const switchGeo = new THREE.BoxGeometry(0.78, 0.015, 0.78);
    const switchMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.85,
      metalness: 0.1
    });

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

      const swMesh = new THREE.Mesh(switchGeo, switchMat);
      swMesh.position.set(posX, 0.01, posZ);
      swMesh.receiveShadow = true;
      keyboardGroup.add(swMesh);

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

      const capColor = new THREE.Color(skill.glow);
      const textures = keyTextures[skill.key];

      const faceMaterials = [
        new THREE.MeshPhysicalMaterial({
          color: capColor,
          roughness: 0.36,
          metalness: 0.1,
          clearcoat: 0.9,
          clearcoatRoughness: 0.2
        }),
        new THREE.MeshPhysicalMaterial({
          color: capColor,
          map: textures.map,
          bumpMap: textures.bump,
          bumpScale: 0.0045,
          roughness: 0.22,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08
        })
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

    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastHoveredCap: typeof keycaps[0] | null = null;
    let isViewable = true;

    const observer = new IntersectionObserver((entries) => {
      isViewable = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(containerRef.current);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isViewable) return;

      const time = clock.getElapsedTime();

      const floatY = Math.sin(time * 0.95) * 0.05;
      const floatRotX = Math.sin(time * 0.8) * 0.015;
      const floatRotZ = Math.cos(time * 0.9) * 0.015;

      keyboardGroup.position.y = floatY;

      currentRotX += (targetRotX - currentRotX) * 0.085;
      currentRotY += (targetRotY - currentRotY) * 0.085;

      keyboardGroup.rotation.x = currentRotX + floatRotX;
      keyboardGroup.rotation.y = currentRotY;
      keyboardGroup.rotation.z = floatRotZ;

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

          const topMesh = prevCap.mesh.children[2] as THREE.Mesh;
          if (topMesh && Array.isArray(topMesh.material)) {
            const topMat = topMesh.material[1] as THREE.MeshPhysicalMaterial;
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

          const topMesh = newCap.mesh.children[2] as THREE.Mesh;
          if (topMesh && Array.isArray(topMesh.material)) {
            const topMat = topMesh.material[1] as THREE.MeshPhysicalMaterial;
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
