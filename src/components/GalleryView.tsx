import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ARTIFACT_IMAGES, LITER_QUOTES } from "../data";
import { Shield, Lightbulb, Construction, Sparkles } from "lucide-react";

interface GalleryViewProps {
  onEnterLyceum: () => void;
  onExploreCrate: () => void;
}

export default function GalleryView({ onEnterLyceum, onExploreCrate }: GalleryViewProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLybUnlocked, setIsLybUnlocked] = useState(false);
  const [activeArmoryCore, setActiveArmoryCore] = useState<string | null>(null);

  // Auto-cycle through quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % LITER_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const armoryCores = [
    {
      id: "hephaestus",
      icon: Construction,
      title: "Hephaestus Core",
      subtitle: "Thermal Forge Synchronizer",
      description: "Structural digital forging protocols active. Automates lattice grid structural reinforcement and handles architectural metadata compilation cycles.",
      status: "STABLE",
      color: "border-amber-600/30 text-amber-800"
    },
    {
      id: "ares",
      icon: Shield,
      title: "Ares Shield Network",
      subtitle: "Cryptographic Mesh Barrier",
      description: "Defensive cybersecurity mesh initialized. Monitores perimeter nodes and enforces rigorous firewall isolation against external frame query vulnerabilities.",
      status: "SHIELDED",
      color: "border-rose-700/30 text-rose-950"
    },
    {
      id: "prometheus",
      icon: Lightbulb,
      title: "Prometheus Flame",
      subtitle: "Cognitive Processing Node",
      description: "Cognitive AI sentience modules synchronized. Dispatches asynchronous intelligence prompts and maintains semantic data consistency across archives.",
      status: "IGNITED",
      color: "border-sky-700/30 text-sky-950"
    }
  ];

  const handleEnterLyceumClick = () => {
    setIsLybUnlocked(true);
    onEnterLyceum();
    const entrySection = document.getElementById("wisdom-atrium-section");
    if (entrySection) {
      entrySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen">

      {/* VIEW-SECTION ACTIVE: HERO LANDING SCREEN */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 z-20">
        <div className="max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="font-mono text-xs text-on-surface/60 uppercase tracking-[0.3em] mb-4 block">
              The Digital Renaissance
            </span>
          </motion.div>

          {/* Large classical heading */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="font-serif text-5xl sm:text-7xl md:text-[84px] leading-[1.05] mb-12 tracking-tight text-on-surface"
          >
            HALL OF<br/>CHRONICLES
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              id="enter-lyceum-button"
              onClick={handleEnterLyceumClick}
              className="group relative px-12 py-5 notched-card bg-surface-bright hover:bg-surface-container-highest transition-all cursor-pointer duration-300"
            >
              <span className="relative z-10 font-mono text-xs font-semibold text-on-surface tracking-widest uppercase">
                Enter The Lyceum
              </span>
            </button>

            <button 
              onClick={onExploreCrate}
              className="px-10 py-5 border border-on-surface font-mono text-xs font-medium uppercase tracking-widest hover:bg-surface-container transition-all"
            >
              Examine Vault
            </button>
          </motion.div>
        </div>

        {/* Scroll helper */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50 text-on-surface">
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll to Ascend</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-on-surface"
          />
        </div>
      </section>

      {/* DYNAMIC CHAMBER CONTENT REVEAL (THE HALL OF WISDOM) */}
      <section 
        id="wisdom-atrium-section"
        className="relative bg-surface-container/60 border-t border-b border-on-surface/10 py-24 px-4 z-20 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center relative py-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-on-surface/5">
            <span className="font-serif text-[180px] select-none italic">“</span>
          </div>

          <span className="font-mono text-xs uppercase text-on-surface/50 tracking-widest mb-6 block">
            The Hall of Wisdom
          </span>

          {/* Animating quotes smoothly */}
          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <blockquote className="font-serif text-2xl md:text-4xl italic leading-relaxed text-on-surface px-4 md:px-12">
                  "{LITER_QUOTES[currentQuoteIndex].quote}"
                </blockquote>
                <cite className="font-mono text-xs uppercase tracking-[0.2em] not-italic text-on-surface-variant block">
                  — {LITER_QUOTES[currentQuoteIndex].author}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote navigations */}
          <div className="flex justify-center gap-2 mt-8">
            {LITER_QUOTES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentQuoteIndex(i)}
                className={`w-2.5 h-2.5 rounded-full border border-on-surface transition-all ${
                  currentQuoteIndex === i ? "bg-on-surface scale-110" : "bg-transparent opacity-45"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CHAMBER II: THE ARMORY - Grid of high-fidelity cores */}
      <section className="relative py-28 px-4 md:px-margin-desktop z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs text-on-surface/50 tracking-widest uppercase block mb-2">
                Chamber II: The Armory
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-on-surface tracking-tight">
                Architectural Grid Forges
              </h2>
            </div>
            <div className="h-[2px] w-24 md:w-48 bg-on-surface/15 hidden md:block"></div>
            <p className="font-sans text-sm text-on-surface-variant max-w-sm">
              Each registry coordinates modular digital cores responsible for maintaining stability thresholds.
            </p>
          </div>

          {/* Bento-style grid of core files */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {armoryCores.map((core) => {
              const Icon = core.icon;
              const isSelected = activeArmoryCore === core.id;

              return (
                <div 
                  key={core.id}
                  onClick={() => setActiveArmoryCore(isSelected ? null : core.id)}
                  className={`notched-card p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 transform group hover:-translate-y-1 ${
                    isSelected ? "bg-surface-container-high border-on-surface ring-1 ring-on-surface" : "bg-surface"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary-container/20 border border-on-surface/10 rounded-lg group-hover:bg-primary-container/40 transition-colors">
                        <Icon className="w-8 h-8 text-on-surface" />
                      </div>
                      <span className="status-chip font-mono text-[9px] px-2 py-0.5 uppercase bg-primary-container text-on-surface tracking-wider">
                        {core.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl text-on-surface group-hover:text-primary transition-colors">
                        {core.title}
                      </h3>
                      <p className="font-mono text-[11px] text-on-surface/60 uppercase">
                        {core.subtitle}
                      </p>
                    </div>

                    <p className="font-sans text-xs text-on-surface-variant/80 leading-relaxed pt-2">
                      {core.description}
                    </p>
                  </div>

                  {/* Expandable specs info inside core */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-4 border-t border-on-surface/10"
                      >
                        <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                          <div>
                            <span className="text-on-surface/50 block">OPERATIONAL COST</span>
                            <span className="text-on-surface font-semibold">14.2 GFLOPs</span>
                          </div>
                          <div>
                            <span className="text-on-surface/50 block">INTEGRITY MATRIX</span>
                            <span className="text-on-surface font-semibold">SECURE (99.8%)</span>
                          </div>
                          <div>
                            <span className="text-on-surface/50 block">HARDWARE ALLOC</span>
                            <span className="text-on-surface font-semibold">CLUST_T4_09</span>
                          </div>
                          <div>
                            <span className="text-on-surface/50 block">ENCRYPTION TYPE</span>
                            <span className="text-on-surface font-semibold">ED25519_ROT_4</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 flex items-center justify-between font-mono text-[10px] text-on-surface/50">
                    <span>SECT_REF_0110A</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {isSelected ? "Collapse Spec ▲" : "Inspect Spec ▼"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative castle visual callout */}
          <div className="mt-16 notched-card relative p-8 md:p-12 overflow-hidden bg-surface flex flex-col md:flex-row items-center gap-8 md:justify-between">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
              <img 
                referrerPolicy="no-referrer"
                src={ARTIFACT_IMAGES.castle} 
                alt="Castle wireframe" 
                className="w-full h-full object-cover grayscale"
              />
            </div>

            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-on-surface/60 uppercase tracking-widest">
                  IMPERIAL SECURE GATEWAY
                </span>
              </div>
              <h3 className="font-serif text-3xl text-on-surface">
                Ready to review digital relics?
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                Vault Section 04 contains curated blueprints, cryptographic stones, and neural grids forged across centuries. Select Project Crate below to analyze metadata indices immediately.
              </p>
            </div>

            <button 
              onClick={onExploreCrate}
              className="relative relative-z-10 group px-8 py-4 notched-card bg-on-surface hover:bg-neutral-800 transition-colors cursor-pointer text-surface font-mono text-xs font-semibold uppercase tracking-wider"
            >
              Analyze Vault
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
