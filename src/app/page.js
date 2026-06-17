'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import Tracks from '../components/Tracks';
import Timeline from '../components/Timeline';
import CommandCenter from '../components/CommandCenter';
import Footer from '../components/Footer';

export default function Home() {
  const [view, setView] = useState('editorial'); // 'editorial' | 'command'
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for global top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Scroll Progress indicator */}
      <motion.div 
        className={`scroll-progress-bar ${view === 'command' ? 'dark' : ''}`}
        style={{ scaleX: scrollProgress }}
      />

      <Header currentView={view} onViewChange={setView} />

      <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {view === 'editorial' ? (
            <motion.div
              key="editorial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            >
              <Hero onExploreClick={() => setView('command')} />
              
              {/* Notched Transition Card Section */}
              <section className="section-custom featured-painting-section">
                <Image 
                  src="/assets/landscape.png" 
                  alt="Classical oil landscape" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="featured-painting-bg"
                />
                <div className="notched-card-container">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="notched-card"
                  >
                    <span className="notched-card-tag">MANIFESTO</span>
                    <h3 className="notched-card-title">A Renaissance of Craftsmanship</h3>
                    <p className="notched-card-desc">
                      Entering the fellowship is not a passive enrollment. It is a commitment 
                      to push production-grade software that is documented, verified, and permanent.
                    </p>
                  </motion.div>
                </div>
              </section>

              <Manifesto />
              <Tracks />
              <Timeline />
            </motion.div>
          ) : (
            <motion.div
              key="command"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--color-ink)', paddingUp: '120px' }}
            >
              {/* Offset header spacing */}
              <div style={{ height: '80px' }} />
              <CommandCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer currentView={view} />
    </div>
  );
}
