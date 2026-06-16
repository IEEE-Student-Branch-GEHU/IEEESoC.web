'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero({ onExploreClick }) {
  const { scrollY } = useScroll();

  // Cinematic scroll parallax for the statue
  const statueY = useTransform(scrollY, [0, 600], [30, -50]);
  const statueScale = useTransform(scrollY, [0, 600], [0.95, 1.05]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="section-custom hero-section" id="hero">
      <div className="container-custom">
        <motion.div style={{ opacity: contentOpacity }} className="hero-content">
          <div className="hero-text-block">
            <div className="hero-meta">1st June &ndash; 1st September 2026</div>
            
            <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 7vw, 94px)', lineHeight: '0.9', marginBottom: '20px' }}>
              IEEEsoc&apos;26 <br />
              <span>Fellowship</span>
            </h1>
            
            <h2 style={{ fontFamily: 'var(--font-helvetica-now)', fontSize: '20px', fontWeight: '500', color: 'var(--color-ink)', marginBottom: '24px', lineHeight: '1.4', maxWidth: '540px' }}>
              The National Open-Source Fellowship for Elite Student Developers
            </h2>
            
            <p className="hero-desc" style={{ marginBottom: '28px' }}>
              A 12-week intensive fellowship for builders, thinkers, and researchers. 
              Join a curated cohort dedicated to crafting classical software infrastructure.
            </p>

            <div className="hero-stats" style={{ marginBottom: '32px' }}>
              <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Select Fellows</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">5</span>
                <span className="stat-label">Academic Tracks</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12 Weeks</span>
                <span className="stat-label">Duration</span>
              </div>
            </div>

            <button onClick={onExploreClick} className="btn-pill">
              Enter the Forum
            </button>
          </div>

          <div className="sculpture-wrapper">
            <motion.div 
              style={{ y: statueY, scale: statueScale }}
              className="sculpture-img-container"
            >
              <img
                src="/assets/athena_cutout.png?v=4"
                alt="Athena, Goddess of Wisdom"
                width={400}
                height={550}
                className="sculpture-image"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
