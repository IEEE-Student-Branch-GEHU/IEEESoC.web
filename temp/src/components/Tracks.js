'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TRACKS_DATA = [
  {
    num: "I",
    name: "Full-Stack & Mobile",
    stack: "Next.js / React Native / Rust",
    desc: "Forging highly reactive user interfaces and robust web applications. Focus on speed, micro-interactions, and offline-first capabilities.",
    sculpture: "/assets/hephaestus_cutout.png",
    alt: "Hephaestus"
  },
  {
    num: "II",
    name: "AI & Core Analytics",
    stack: "PyTorch / JAX / WebGPU",
    desc: "Building low-latency inference pipelines, local LLM architectures, and data visualization tools that illuminate hidden models.",
    sculpture: "/assets/aristotle_cutout.png",
    alt: "Aristotle"
  },
  {
    num: "III",
    name: "Cloud & Infrastructure",
    stack: "Docker / Go / Kubernetes",
    desc: "Bearing the weight of heavy traffic. Tuning caching, database connection pooling, serverless edges, and reliable cloud deployments.",
    sculpture: "/assets/atlas_cutout.png",
    alt: "Atlas"
  },
  {
    num: "IV",
    name: "Security & Web3",
    stack: "Solidity / Rust / Wasm",
    desc: "Designing secure systems, auditing smart contracts, protecting against runtime exploits, and orchestrating decentralized handshakes.",
    sculpture: "/assets/ares_cutout.png",
    alt: "Ares"
  },
  {
    num: "V",
    name: "Research & Frontier",
    stack: "LaTeX / Python / Markdown",
    desc: "Venturing into unmapped academic landscapes. Structuring literature reviews, compiling benchmarks, and translating complex concepts.",
    sculpture: "/assets/prometheus_cutout.png",
    alt: "Prometheus"
  }
];

export default function Tracks() {
  return (
    <section className="section-custom tracks-section" id="tracks">
      <div className="container-custom">
        <div className="tracks-intro">
          <h2 className="tracks-intro-title">The Five Disciplines</h2>
          <p className="tracks-intro-subtitle">
            Curated pathways corresponding to classical virtues. 
            Choose your craftsmanship focus.
          </p>
        </div>

        <div className="tracks-grid">
          {TRACKS_DATA.map((track, i) => (
            <div key={i} className="track-card">
              <span className="track-num">{track.num}</span>
              
              <div className="track-sculpture-wrapper">
                <Image
                  src={track.sculpture}
                  alt={track.alt}
                  width={160}
                  height={200}
                  className="track-sculpture-img"
                />
              </div>

              <div className="track-info">
                <h3 className="track-name">{track.name}</h3>
                <span className="track-stack">{track.stack}</span>
                <p className="track-desc">{track.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
