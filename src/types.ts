/**
 * Shared types for IEEESOC'26 Hall of Chronicles.
 */

export interface ChronicleArtifact {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "Architectural" | "Mythological" | "Technical" | "Relic";
  imageUrl: string;
  loadIndex: number; // Cognitive Load Index %
  purityIndex: number; // Integrity / Purity %
  cyberMeshLevel: number; // Defensive Cyber Mesh Index (1-10)
  archivist: string;
  dateCreated: string;
}

export interface KeeperLeaderboardRow {
  rank: number;
  name: string;
  role: string;
  chroniclesCount: number;
  reputationPoints: number;
  imageUrl: string;
  status: "active" | "dormant" | "synchronizing";
}

export interface TelemetryLog {
  id: string;
  timestamp: string; // e.g., "[12:04:01]"
  message: string;
  type: "info" | "warning" | "success" | "critical";
}

export interface BotSimulatorState {
  botName: string;
  role: string;
  status: "idle" | "running" | "optimizing" | "critical";
  hydraulicPressure: number; // MPa
  laserIntensity: number; // %
  opticArraySync: number; // %
  coreTemperature: number; // °C
  efficiencyFactor: number; // %
  logs: TelemetryLog[];
}
