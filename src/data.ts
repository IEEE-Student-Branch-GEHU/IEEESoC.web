import { ChronicleArtifact, KeeperLeaderboardRow } from "./types";

export const ARTIFACT_IMAGES = {
  column: "/images/column.png",
  castle: "/images/castle.png",
  athena: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a1?q=80&w=600&auto=format&fit=crop",
  socrates: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  hephaestus: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop",
  aristotle: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=600&auto=format&fit=crop",
  atlas: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  ares: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
  prometheus: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
  neuralLattice: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop",
  gildedGuardian: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=600&auto=format&fit=crop",
  valerius: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
};

export const DEFAULT_ARTIFACTS: ChronicleArtifact[] = [
  {
    id: "art-1",
    code: "ARCH-0112",
    name: "Neural Lattice Core",
    description: "Multi-layered digital cognitive grid optimized for neural energy transfer.",
    category: "Technical",
    imageUrl: ARTIFACT_IMAGES.neuralLattice,
    loadIndex: 82,
    purityIndex: 94,
    cyberMeshLevel: 8,
    archivist: "Valerius",
    dateCreated: "2026-03-04"
  },
  {
    id: "art-2",
    code: "ARCH-0931",
    name: "Athena Support Column",
    description: "Virtual load-bearing column embodying logical architectures and layout frameworks.",
    category: "Architectural",
    imageUrl: ARTIFACT_IMAGES.athena,
    loadIndex: 12,
    purityIndex: 100,
    cyberMeshLevel: 9,
    archivist: "Lysandra",
    dateCreated: "2026-01-18"
  },
  {
    id: "art-3",
    code: "MTHS-4192",
    name: "Hephaestus Core Matrix",
    description: "The core engine powering physical forging protocols, generating high-velocity thermal cycles.",
    category: "Mythological",
    imageUrl: ARTIFACT_IMAGES.hephaestus,
    loadIndex: 74,
    purityIndex: 88,
    cyberMeshLevel: 7,
    archivist: "Eli",
    dateCreated: "2025-11-22"
  },
  {
    id: "art-4",
    code: "TECH-1140",
    name: "Prometheus Pulse Reactor",
    description: "Synthesized flame ignition driver providing steady energy grids across the digital lyceum.",
    category: "Technical",
    imageUrl: ARTIFACT_IMAGES.prometheus,
    loadIndex: 91,
    purityIndex: 96,
    cyberMeshLevel: 10,
    archivist: "Cleon",
    dateCreated: "2026-05-09"
  },
  {
    id: "art-5",
    code: "RELC-8832",
    name: "Socratic Logic Prism",
    description: "Double-sided mirror refracting dialectical inquiries into secure digital storage cells.",
    category: "Relic",
    imageUrl: ARTIFACT_IMAGES.socrates,
    loadIndex: 35,
    purityIndex: 99,
    cyberMeshLevel: 6,
    archivist: "Valerius",
    dateCreated: "2025-08-14"
  },
  {
    id: "art-6",
    code: "MTHS-5501",
    name: "Atlas Load Distributor",
    description: "Gravitational dispersion matrix used to prevent frame permission overheads in high load canvases.",
    category: "Architectural",
    imageUrl: ARTIFACT_IMAGES.atlas,
    loadIndex: 48,
    purityIndex: 91,
    cyberMeshLevel: 8,
    archivist: "Eli",
    dateCreated: "2026-04-20"
  },
  {
    id: "art-7",
    code: "RELC-1940",
    name: "Ares Secure Shield",
    description: "Thick firewall layer styled after classical iron wardens, enforcing strict cyber-mesh integrity.",
    category: "Relic",
    imageUrl: ARTIFACT_IMAGES.ares,
    loadIndex: 60,
    purityIndex: 95,
    cyberMeshLevel: 10,
    archivist: "Lysandra",
    dateCreated: "2026-02-15"
  },
  {
    id: "art-8",
    code: "TECH-4004",
    name: "Aristotelian Organon Module",
    description: "An advanced categorizer utilizing nested matrices to index, sort, and store incoming relics.",
    category: "Technical",
    imageUrl: ARTIFACT_IMAGES.aristotle,
    loadIndex: 55,
    purityIndex: 97,
    cyberMeshLevel: 7,
    archivist: "Cleon",
    dateCreated: "2026-06-01"
  }
];

export const DEFAULT_KEEPERS: KeeperLeaderboardRow[] = [
  {
    rank: 1,
    name: "Archivist Valerius",
    role: "Grand Library Custodian",
    chroniclesCount: 892440,
    reputationPoints: 9840,
    imageUrl: ARTIFACT_IMAGES.valerius,
    status: "active"
  },
  {
    rank: 2,
    name: "Keeper Lysandra",
    role: "Vault Hermit & Cryptographer",
    chroniclesCount: 712045,
    reputationPoints: 7850,
    imageUrl: ARTIFACT_IMAGES.athena, // beautiful classical portrait
    status: "active"
  },
  {
    rank: 3,
    name: "Scribe Cleon",
    role: "Metaphysical Pulse Recorder",
    chroniclesCount: 543900,
    reputationPoints: 6120,
    imageUrl: ARTIFACT_IMAGES.socrates,
    status: "synchronizing"
  },
  {
    rank: 4,
    name: "Chronos Overseer Eli",
    role: "High-Frequency Timekeeper",
    chroniclesCount: 395210,
    reputationPoints: 4900,
    imageUrl: ARTIFACT_IMAGES.atlas,
    status: "active"
  },
  {
    rank: 5,
    name: "Sentry Aletheia",
    role: "Integrity Verification Unit",
    chroniclesCount: 288650,
    reputationPoints: 3400,
    imageUrl: ARTIFACT_IMAGES.ares,
    status: "dormant"
  }
];

export const LITER_QUOTES = [
  {
    id: "quote-1",
    quote: "Knowledge is the wing wherewith we fly to heaven.",
    author: "Digital Archives"
  },
  {
    id: "quote-2",
    quote: "He who has a mind to forge must sync with the matrix fire.",
    author: "Oracle Hephaestus"
  },
  {
    id: "quote-3",
    quote: "Virtue is the perfect balance of regulatory integrity.",
    author: "Lattice Archivist"
  },
  {
    id: "quote-4",
    quote: "The unexamined log is not worth printing on the console terminal.",
    author: "Sec-Ops Socrates"
  }
];

export const CORE_TELEMETRIAL_LOGS_PRESET = [
  { id: "log-1", timestamp: "[12:04:01]", message: "Initializing hydraulic stabilizers...", type: "info" as const },
  { id: "log-2", timestamp: "[12:04:05]", message: "STABLE: Pressure 1.4 MPa attained.", type: "success" as const },
  { id: "log-3", timestamp: "[12:04:12]", message: "WARNING: Slight latency in optic sensory response array.", type: "warning" as const },
  { id: "log-4", timestamp: "[12:04:20]", message: "Core cooling cycle activated. Temp stable at 42°C.", type: "info" as const },
  { id: "log-5", timestamp: "[12:04:32]", message: "Neural synchronization locked at 84% integrity.", type: "success" as const }
];
