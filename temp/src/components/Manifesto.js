'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Manifesto() {
  const line1 = "We do not build for temporary convenience.";
  const line2 = "We craft code as permanent architecture, designed to stand the test of time, just like the marble temples of old.";
  const line3 = "The IEEEsoc'26 Fellowship is a modern academy—a digital Lyceum where theory meets execution. We gather under the banner of open source to forge infrastructure, test frontiers, and elevate software to high art.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="section-custom manifesto-section" id="manifesto">
      <div className="container-custom">
        <div className="manifesto-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="manifesto-philosophy"
          >
            <p className="philosopher-quote">
              &ldquo;Wisdom begins in wonder.&rdquo;
            </p>
            <span className="philosopher-name">— Socrates</span>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="manifesto-body"
          >
            <motion.h2 variants={itemVariants} className="manifesto-heading">
              {line1}
            </motion.h2>
            <motion.p variants={itemVariants} className="manifesto-text">
              {line2}
            </motion.p>
            <motion.p variants={itemVariants} className="manifesto-text">
              {line3}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
