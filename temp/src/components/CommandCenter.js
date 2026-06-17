'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Terminal, Cpu, Award, Zap, Code, ShieldAlert, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

// Mock Databases
const PROJECTS_DATABASE = [
  {
    id: 1,
    title: "Athens Auth Layer",
    track: "Security & Web3",
    difficulty: "hard",
    desc: "Implementing zero-knowledge client authentication handshakes with custom WebAssembly compilers.",
    longDesc: "This project aims to build a modern authentication system utilizing ZK-proof cryptography compiled to WebAssembly. Fellows will design cryptographic signatures, optimize edge runtime execution times, and audit the handshake against known timing attacks.",
    issues: ["Implement ZK proof verification in Rust", "Compile auth protocol to Wasm", "Integrate edge caching for ZK payloads"],
    mentors: ["Ares Security Lead", "Athena Principal Researcher"],
    stack: "Rust / Wasm / Cloudflare Workers",
    count: 3
  },
  {
    id: 2,
    title: "Lyceum Markdown Parser",
    track: "Full-Stack & Mobile",
    difficulty: "medium",
    desc: "A high-performance markdown engine styled with museum typography presets and custom plugins.",
    longDesc: "A core parsing engine built in pure JavaScript (or Rust/Wasm bindings) that generates semantic HTML matching our editorial design standards. Includes plugins for bibliography tables, Greek footnotes, and responsive image containers.",
    issues: ["Write lexical parser for inline serifs", "Add LaTeX mathematical rendering support", "Optimize AST parsing speeds by 40%"],
    mentors: ["Hephaestus Dev Lead", "Aristotle Content Strategist"],
    stack: "TypeScript / CSS Grid / Playfair Font",
    count: 3
  },
  {
    id: 3,
    title: "Atlas Caching Proxy",
    track: "Cloud & Infrastructure",
    difficulty: "hard",
    desc: "Building a Go-based reverse proxy that intercepts network requests and handles distributed caching.",
    longDesc: "A network proxy written in Go to coordinate hot-path cache validation. Fellows will work on custom cache eviction algorithms, TCP socket management, and multi-tenant rate limiting.",
    issues: ["Implement LRU cache in Go with mutex locking", "Add Prometheus metrics monitoring endpoint", "Handle TCP socket pooling under 50k concurrent reqs"],
    mentors: ["Atlas Devops Architect"],
    stack: "Go / Docker / Prometheus",
    count: 3
  },
  {
    id: 4,
    title: "Delphi Prediction Pipeline",
    track: "AI & Core Analytics",
    difficulty: "easy",
    desc: "Structuring real-time analytics dashboards that visualize local LLM confidence outputs.",
    longDesc: "Build an interactive analytics deck that hooks into local model endpoints. Highlights confidence thresholds, prompt token usage, and latency streams with smooth editorial charts.",
    issues: ["Set up PyTorch analytics pipeline script", "Render token streaming chart with SVG canvas", "Add confidence score threshold slider controls"],
    mentors: ["Aristotle AI Director"],
    stack: "Python / React / ChartJS",
    count: 3
  },
  {
    id: 5,
    title: "Prometheus Document Compiler",
    track: "Research & Frontier",
    difficulty: "easy",
    desc: "A CLI tool to compile raw research docx notes into clean, structured Markdown folios.",
    longDesc: "A Python-based compiler designed to parse raw formatting from academic text editors and translate them into standard GitHub-flavored Markdown. Ensures tables are perfectly aligned and citation keys are mapped correctly.",
    issues: ["Write DOCX-to-HTML element node mapper", "Implement bibtex parser compiler plugin", "Generate table of contents generator"],
    mentors: ["Prometheus Research Fellow"],
    stack: "Python / DOCX-library / Regex",
    count: 3
  },
  {
    id: 6,
    title: "Parthenon CDN Edge",
    track: "Cloud & Infrastructure",
    difficulty: "medium",
    desc: "A geographically distributed edge network server optimized for loading large-scale classical images.",
    longDesc: "Setting up custom CDN headers and compression presets (avif/webp) at serverless edge layers. Ensures large art assets load instantly across all devices without rendering delays.",
    issues: ["Set up AVIF image compressor node", "Optimize cloudflare routing scripts", "Write edge cache-control custom rules"],
    mentors: ["Atlas Devops Architect", "Hephaestus Dev Lead"],
    stack: "NextJS / Cloudflare CDN / Node",
    count: 3
  }
];

const INITIAL_CONTRIBUTORS = [
  { id: 1, name: "Purvansh Joshi", prsMerged: 12, points: 1450, rank: 1, avatar: "⚡" },
  { id: 2, name: "Aarav Sharma", prsMerged: 9, points: 1120, rank: 2, avatar: "🔥" },
  { id: 3, name: "Ananya Patel", prsMerged: 8, points: 980, rank: 3, avatar: "🌟" },
  { id: 4, name: "Kabir Singh", prsMerged: 6, points: 760, rank: 4, avatar: "🛡️" },
  { id: 5, name: "Ishaan Sen", prsMerged: 5, points: 640, rank: 5, avatar: "🎯" }
];

const INITIAL_MENTORS = [
  { id: 1, name: "Dr. Aristotle", reviews: 42, avgSpeed: "1.4 hrs", score: 98, track: "AI & Analytics" },
  { id: 2, name: "Hephaestus Eng", reviews: 38, avgSpeed: "2.1 hrs", score: 95, track: "Full-Stack & Mobile" },
  { id: 3, name: "Atlas Ops", reviews: 31, avgSpeed: "1.8 hrs", score: 92, track: "Cloud & Infra" },
  { id: 4, name: "Ares Sec", reviews: 29, avgSpeed: "0.9 hrs", score: 96, track: "Security & Web3" }
];

const INITIAL_LOGS = [
  { time: "19:28:40", sender: "System", type: "info", content: "Lyceum Command Center online. Connection stable." },
  { time: "19:28:42", sender: "IEEEsoc-Bot", type: "bot", content: "Monitoring branches on IEEE-Student-Branch-GEHU/IEEESoC.web" },
  { time: "19:30:15", sender: "IEEEsoc-Bot", type: "success", content: "PR #1 (feat: complete IEEEsoc'26 fellowship platform) merged by Purvansh Joshi (+150 pts)" }
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // State for leaderboards & logs
  const [contributors, setContributors] = useState(INITIAL_CONTRIBUTORS);
  const [mentors, setMentors] = useState(INITIAL_MENTORS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Filter project database
  const filteredProjects = PROJECTS_DATABASE.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === 'all' || project.track === trackFilter;
    return matchesSearch && matchesTrack;
  });

  // Simulator Triggers
  const logActivity = (bot, type, content) => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { time: timeString, sender: bot, type, content }]);
  };

  const handleSimulateEvent = (type) => {
    const fellowsList = [...contributors];
    const randomFellowIdx = Math.floor(Math.random() * fellowsList.length);
    const fellow = fellowsList[randomFellowIdx];

    const mentorList = [...mentors];
    const randomMentorIdx = Math.floor(Math.random() * mentorList.length);
    const mentor = mentorList[randomMentorIdx];

    const projectList = PROJECTS_DATABASE;
    const randomProject = projectList[Math.floor(Math.random() * projectList.length)];

    if (type === 'opened') {
      logActivity(
        "IEEEsoc-Bot", 
        "info", 
        `PR #${Math.floor(Math.random()*200 + 10)} opened by ${fellow.name} inside ${randomProject.title}`
      );
    } 
    else if (type === 'assigned') {
      logActivity(
        "IEEEsoc-Bot", 
        "info", 
        `Issue [${randomProject.issues[0].substring(0, 25)}...] assigned to ${fellow.name}`
      );
    } 
    else if (type.startsWith('merged')) {
      let difficulty = 'easy';
      let addedPoints = 100;
      if (type === 'merged-medium') {
        difficulty = 'medium';
        addedPoints = 250;
      } else if (type === 'merged-hard') {
        difficulty = 'hard';
        addedPoints = 500;
      }

      // Update points and recalculate rank
      const updatedFellows = fellowsList.map((f, idx) => {
        if (f.id === fellow.id) {
          return {
            ...f,
            prsMerged: f.prsMerged + 1,
            points: f.points + addedPoints
          };
        }
        return f;
      });

      // Sort by points descending and update ranks
      const sortedFellows = updatedFellows
        .sort((a, b) => b.points - a.points)
        .map((f, idx) => ({ ...f, rank: idx + 1 }));

      setContributors(sortedFellows);

      // Increment mentor score
      const updatedMentors = mentorList.map(m => {
        if (m.id === mentor.id) {
          return { ...m, reviews: m.reviews + 1, score: Math.min(100, m.score + 1) };
        }
        return m;
      });
      setMentors(updatedMentors);

      // Log success activity
      logActivity(
        "IEEEsoc-Bot", 
        "success", 
        `PR merged by ${fellow.name} in ${randomProject.title} (${difficulty.toUpperCase()}! +${addedPoints} pts). Review approved by ${mentor.name}.`
      );

      // Blow Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <section className="section-custom command-section" id="command-center">
      <div className="container-custom">
        <div className="command-intro">
          <h2 className="command-title">Lyceum Command Center</h2>
          
          <div className="command-tabs">
            <button 
              onClick={() => setActiveTab('marketplace')} 
              className={`command-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            >
              Project Crate
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')} 
              className={`command-tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            >
              Leaderboards
            </button>
            <button 
              onClick={() => setActiveTab('simulator')} 
              className={`command-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            >
              Bot Simulator
            </button>
          </div>
        </div>

        {/* Tab 1: Marketplace */}
        {activeTab === 'marketplace' && (
          <div>
            <div className="marketplace-filters">
              <div className="search-input-wrap">
                <input 
                  type="text" 
                  placeholder="Search project crates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <select 
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="track-filter-select"
              >
                <option value="all">All Disciplines</option>
                <option value="Full-Stack & Mobile">Full-Stack & Mobile</option>
                <option value="AI & Core Analytics">AI & Core Analytics</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Security & Web3">Security & Web3</option>
                <option value="Research & Frontier">Research & Frontier</option>
              </select>
            </div>

            <div className="project-grid">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="project-card"
                >
                  <div className="project-header">
                    <span className="project-track">{project.track}</span>
                    <span className={`project-difficulty ${project.difficulty}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.desc}</p>
                  </div>

                  <div className="project-footer">
                    <span className="project-issues-count">{project.count} issues open</span>
                    <button className="project-apply-btn">Inspect Crate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-container">
            {/* Contributors Leaderboard */}
            <div className="leaderboard-column">
              <h3 className="leaderboard-heading">
                Fellows Forum <span>Contributors Ranking</span>
              </h3>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="leaderboard-th rank-col">Rank</th>
                    <th className="leaderboard-th">Fellow</th>
                    <th className="leaderboard-th">PRs</th>
                    <th className="leaderboard-th" style={{ textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <motion.tbody layout>
                  {contributors.map((fellow) => (
                    <motion.tr 
                      key={fellow.id} 
                      layoutId={`contributor-row-${fellow.id}`}
                      className="leaderboard-row"
                    >
                      <td className="leaderboard-td rank-col">{fellow.rank}</td>
                      <td className="leaderboard-td name-col">
                        <span style={{ marginRight: '8px' }}>{fellow.avatar}</span>
                        {fellow.name}
                      </td>
                      <td className="leaderboard-td meta-col">{fellow.prsMerged} merged</td>
                      <td className="leaderboard-td score-col">{fellow.points}</td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>

            {/* Mentors Leaderboard */}
            <div className="leaderboard-column">
              <h3 className="leaderboard-heading">
                Academy Sages <span>Mentor Activity</span>
              </h3>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="leaderboard-th">Sage</th>
                    <th className="leaderboard-th">Discipline</th>
                    <th className="leaderboard-th">Reviews</th>
                    <th className="leaderboard-th" style={{ textAlign: 'right' }}>Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr key={mentor.id} className="leaderboard-row">
                      <td className="leaderboard-td name-col">{mentor.name}</td>
                      <td className="leaderboard-td meta-col">{mentor.track}</td>
                      <td className="leaderboard-td meta-col">{mentor.reviews} approved</td>
                      <td className="leaderboard-td score-col">{mentor.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Bot Simulator */}
        {activeTab === 'simulator' && (
          <div className="simulator-layout">
            <div className="simulator-controls">
              <h3 className="simulator-title">Simulation Panel</h3>
              
              <div className="sim-group">
                <span className="sim-group-label">GitHub Events</span>
                <div className="sim-btn-grid">
                  <button onClick={() => handleSimulateEvent('opened')} className="sim-btn">
                    PR Opened
                  </button>
                  <button onClick={() => handleSimulateEvent('assigned')} className="sim-btn">
                    Issue Assigned
                  </button>
                  <button onClick={() => handleSimulateEvent('merged-easy')} className="sim-btn">
                    Merge Easy
                  </button>
                </div>
              </div>

              <div className="sim-group">
                <span className="sim-group-label">Core Merges</span>
                <div className="sim-btn-grid">
                  <button 
                    onClick={() => handleSimulateEvent('merged-medium')} 
                    className="sim-btn" 
                    style={{ gridColumn: 'span 2' }}
                  >
                    Merge Medium PR (+250)
                  </button>
                  <button 
                    onClick={() => handleSimulateEvent('merged-hard')} 
                    className="sim-btn" 
                    style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    Merge Hard PR (+500)
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--color-ash)', lineHeight: '1.4' }}>
                *Note: Merging PRs will trigger instant updates on the leaderboard table. Navigate back to &quot;Leaderboards&quot; tab to watch rows animate and reorder.
              </p>
            </div>

            {/* Terminal Feed */}
            <div className="sim-terminal">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                </div>
                <span>Terminal Session (Active)</span>
              </div>
              <div className="terminal-body">
                {logs.map((log, index) => (
                  <div key={index} className="terminal-line-item">
                    <span className="terminal-timestamp">[{log.time}]</span>
                    <span className="terminal-bot">&lt;{log.sender}&gt;:</span>
                    <span style={{ color: log.type === 'success' ? '#22c55e' : log.type === 'bot' ? '#60a5fa' : '#a1a1aa' }}>
                      {log.content}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="modal-content-wrap" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-notched">
                  <button 
                    onClick={() => setSelectedProject(null)} 
                    className="modal-close-btn"
                  >
                    <X size={18} />
                  </button>

                  <div className="project-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
                    <span className="project-track">{selectedProject.track}</span>
                    <span className={`project-difficulty ${selectedProject.difficulty}`}>
                      {selectedProject.difficulty}
                    </span>
                  </div>

                  <h3 className="project-title" style={{ fontSize: '32px' }}>{selectedProject.title}</h3>
                  
                  <div>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ash)', marginBottom: '8px' }}>
                      Crate Description
                    </h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-bone)', opacity: 0.9 }}>
                      {selectedProject.longDesc}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ash)', marginBottom: '8px' }}>
                      Discipline Technology Stack
                    </h4>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#60a5fa' }}>
                      {selectedProject.stack}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ash)', marginBottom: '8px' }}>
                      Assigned Sages
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {selectedProject.mentors.map((m, i) => (
                        <span key={i} style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          👤 {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ash)', marginBottom: '8px' }}>
                      Track Issues (Available for Scouting)
                    </h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
                      {selectedProject.issues.map((issue, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: 'var(--color-bone)' }}>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => {
                      logActivity("IEEEsoc-Bot", "info", `Purvansh Joshi applied to coordinate on ${selectedProject.title}`);
                      setSelectedProject(null);
                      confetti({ particleCount: 30, spread: 40 });
                    }} 
                    className="btn-pill" 
                    style={{ marginTop: '12px', width: '100%' }}
                  >
                    Commit to Crate
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
