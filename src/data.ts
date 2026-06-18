import { ChronicleArtifact, KeeperLeaderboardRow } from "./types";

export const ARTIFACT_IMAGES = {
  column: "https://lh3.googleusercontent.com/aida/AP1WRLvjx4_WGAxw7EcdVV0xRwg9d_0iavGqTna0VClTxlGr5Shzi0BYb_UI5FyLLGHZ9qf5AJmokF6mrCc8k5Wrf6_-ZZ9FdRqlHKk42bKYxRLwVmCMo16FCtGzeTWv_41vdn5ErjuxLVlMkzDTzcD4af6kePbOf8ChdtemSrSW2fcNzzsZAlpO2taSXlitqPJ_qwX0KKDqwuq2OZ7uzWz4kcTb_m_--x9o7LdeANQXN9nu12cJ9N_i4AIzekc",
  castle: "https://lh3.googleusercontent.com/aida/AP1WRLskmyjlNaX0hOFEtZC3krrVw8oyuDwhpms4YVr46AXIqDxtqZWJyjHPxnNPtnzUwGlNrEVo-quHd0ZUNB3TeN_v6dLQrhXjzax8Js7t98HIK4LjYgZgbcglSCmSh2meD-g6IIeF9H_lcaLY_5K_oBKNWU_rUGAacV1ez4Ev5-GEqWd-guoNpLFjWHwBzffbfKV5cVB-M1sgK_2cWB6z3n7wZqGP77qD2v8G8Ft76ry2yOT0dpfTuK3bLuo",
  athena: "https://lh3.googleusercontent.com/aida/AP1WRLvzW28XliyeXRBcvhQb0AMMAsb1sVk5lyc-qBE_2shOnC5qBWhX5McUzkr3lw1uZaaHSQl5U5jpxou5-mx6y9XD43EVP4EONh6iu1IRz74haIST6I-8RcKTRSnhEw7xn2DlOnfsAH5AQxdAGYwTtzSSWTcAjdxfSTY6abaA8vKYjjCCrH5kfOCZQixuFuNpHrBzeYYK4rx1fd0SXkyxq7t7sv2xocZSzCKBRX2ylNtDFnrmCTleHbzDsw",
  socrates: "https://lh3.googleusercontent.com/aida/AP1WRLtL0BnnkKrfRg4rNj_3mAEDRnMETM4ZS5EtfQVQgjrYAGz82z74d_5UHbJnvW-EycKEal6zYVRoi8usZgVzPoWjR9VhitVZs05tkIAYPC59n5pDQO5gVj1sf32MqLvQ4tpC17N8OVXcjDCtxJxM4aWK34loqB4MQEEE9PaqaqOwC4obRRQi6zP4ga6CCB3me-oFe4jGP49o52yB7ofqhIqwMGMxEXB_zvyzT7Atm3Fz6wLjf-VNCl-rRlE",
  hephaestus: "https://lh3.googleusercontent.com/aida/AP1WRLvdCLFQsDKHzmGQva0jSSSDkzk_X4AqZi83O6xxO4SebmIyOsuJ8B9HVs1ng8KGU8xzSKCLC-Dzg6DB4g1h9IP2Dg6YhxgUTmRx313qswI2hQVZZtR67eMgeD03PnPZTakvrnvf1nu1hm4MLoNCD5IKEDcT2CmVjcAaRu0MATlXfn_D_hO9uJ-zExRYKcoq0eWelR764KE_k3C--3R61XNxw94DdzOOcEHOAYRGX5QAw0Ndq8dYX8QTc30",
  aristotle: "https://lh3.googleusercontent.com/aida/AP1WRLtPFB-kQOw2UhoNiLDg_4_AetoGg0amuph6wUfdt346XPUA0IZIIB4QDe2s8YJYsqWw1U9nWJJYQ-LZhQQa3wwaxaaaPCIpyGdaNxiFgCCKAYPApUUT4N2khPg23RU6reEJocUzRYuoecFecpVKeinmzMBHhUtNEIaQofX_Qni5K3SOYQ8LSloBaUJ7wqnXY7tEcZr-b2SLarXuh7IUn4-VS8VkD5jd3TUMCqpLb5lPAm5oMEbsuacm89Q",
  atlas: "https://lh3.googleusercontent.com/aida/AP1WRLuqu6xqtl1vCQ2tmGCq2GwbzT0REISTsePRld9lCVDkTgczAj_iP2FcXpXPnk3gr7RUBibrqs4TIXqIYnDlSeBISjSwkAcKeRV8V_bu_N_7XZetQ7A2tlJDZLziB_ZVP0IFbykJTKRHLPuEbg89Q3utiutIki9zYlS7AF6jmtplPGdjHD2HBipDoQl-7bxRGTv767wVuSnOWelGuRm8dTbEYW03r0MxwIpKTeZjjiBpc64NxdLRXGMAzps",
  ares: "https://lh3.googleusercontent.com/aida/AP1WRLsmPdxx1HvmjncIqvN1fXcIdeqPBcnlp1V223BQrukR2yAnDS6-3vXBwxerAESbxAGKM7pbt16s2s6XhOsWaLBNO6dRZE2r5LXxKYw28TTb9CD2fRiNGSWuGhbBack7FTaLXG90RJQ1yJJQarU5cdbK-_bYKqPZt9PyI2Bog0IyR73xcwQ7IgZ6X-JLsc9_xW7DUs9j0MGX-u4TlJ0pfrmP2nNclRfINbfHnDM31fZWCG60BSKcwrQtwgA",
  prometheus: "https://lh3.googleusercontent.com/aida/AP1WRLvm3Wgezsr7_O3RgO9NjGwRl1eIUwqvTzgeP9Y1qJSS2CgcEPFR3khn6ScmuGsL4WQ2qoTa5tiB-Vg0DrREI6bzgx9hFHAxXC00ISH-pbjcIWQ92D1YQbjTWJ4UcXsSl3K9hk6IXTYlA2Ql8PDI5JOlSrRkxCjROieRGNTChBmUgO2ZxQbb0mjgJa14fjIpWFvJivUl30rChtdq_COm3Jwnsn1ATgwwrYzeJDLOGvTBgCPP_yZd4Gf-vrQ",
  neuralLattice: "https://lh3.googleusercontent.com/aida-public/AB6AXuADyhAIG5m6qhPEAfX3956kznqTKjMolCzI6scqQkRtv2L2cqru41giQB8M1JV_107_zScJqZpIWj7Wn2_diFQ-H4v4DmuQEnV2OtEZjkC0QC67Fz2ajQMWHL7I3kRr_VkZyAOgzRllL_vFetH51hQ096fuEnmgel2MwHnmLjjfWZvpIpAIvPkNT3WYlkGWJbGupwuuiSpl9ToXWj73ihO8Pxq74maAakI2WB38c3f6mx4OViEf9DDJor8UYMDoz1iGi_wTkhHwHN0",
  gildedGuardian: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-vprsbZzk9_ylOw9b4EA26bs-pgiNaf3GMrhC19wxmIFxVQbQ1HSSnh4VSdg4BYNY0v3sRotrTHrQgc_DX7yjN7YypnYXeRE_8mFYPCb0unf8D3F9wKR9XuJhDnW8gbePrBgLHXpIb405gdC6pOdZ0GQb2xHZycXtC1z1JbgwuGgk-ezt7THPj810qwT641kn4YevnNgfZx_EL8EEE9GBvo8a8hLgKv2cZ4aQ9JsObODI8Oxabw70HenfYCOBj67EkHQOntsNgvQ",
  valerius: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmZ5FprQwVrmTDcK65wDf78sygYeP1x5lX3xTNr9CPlbWH3slZ39Ndcfa2zykJd4liB292pdWLdk6ffLAgLS0A47uzNOoARsLpB0aK0ADS_pxzbIhxZlvrgwv8Yau1r3I78mrflAAQwn09_XDwm-bmZmHyHWrtJL1pIWmLf8ciVF8Qj-cyIjvvcZ8PcICgByZD2qL2peGsQJP8Iy1IIhLpLAjVsJSg4DUUgfPRyF0m-O65WL3ZQszrYsIyISIXjTVWAD5YXd3eSeY"
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
