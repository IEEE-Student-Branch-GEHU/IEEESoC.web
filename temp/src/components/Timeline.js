'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TIMELINE_PHASES = [
  {
    phase: "Phase 1",
    event: "Scouting & Enrollment",
    date: "June 1 – June 15, 2026",
    desc: "Submit your Github portfolio, select your primary discipline, and review the project crates in the marketplace. Initial screening of applications."
  },
  {
    phase: "Phase 2",
    event: "The Forge & Bonding",
    date: "June 16 – June 30, 2026",
    desc: "Final cohort matching, sandbox environment setup, and alignment with project mentors. Deep dives into the architecture."
  },
  {
    phase: "Phase 3",
    event: "Contribution Sprints",
    date: "July 1 – August 20, 2026",
    desc: "Twelve weeks of active build. Pull Requests are monitored and ranked in real-time by the IEEEsoc-Bot. Weekly syncs and code review labs."
  },
  {
    phase: "Phase 4",
    event: "The Grand Finale",
    date: "August 21 – September 1, 2026",
    desc: "Deployment validation, project showcases to judges, and awarding of fellowships, certificates, and core contributor badges."
  }
];

export default function Timeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="section-custom timeline-section" id="timeline">
      <div className="container-custom">
        <h2 className="timeline-title">The Odyssey of Learning</h2>
        
        <div className="timeline-flow">
          {/* Vertical timeline tracker line */}
          <div className="timeline-line" />
          <motion.div 
            style={{ scaleY }} 
            className="timeline-line-progress" 
          />

          {TIMELINE_PHASES.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="timeline-node"
              >
                <div className="timeline-marker" />
                
                {isLeft ? (
                  <>
                    <div className="timeline-side-left">
                      <span className="timeline-phase">{item.phase}</span>
                      <h3 className="timeline-event">{item.event}</h3>
                      <span className="timeline-date">{item.date}</span>
                    </div>
                    <div className="timeline-side-right">
                      <p className="timeline-details">{item.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="timeline-side-left">
                      <p className="timeline-details" style={{ textAlign: 'right' }}>{item.desc}</p>
                    </div>
                    <div className="timeline-side-right">
                      <span className="timeline-phase">{item.phase}</span>
                      <h3 className="timeline-event">{item.event}</h3>
                      <span className="timeline-date">{item.date}</span>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
