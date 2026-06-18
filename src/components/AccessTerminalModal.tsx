import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, ArrowRight, CornerDownLeft, Sparkles, AlertTriangle } from "lucide-react";
import { ChronicleArtifact } from "../types";

interface AccessTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifacts: ChronicleArtifact[];
  onTriggerOverclock: () => void;
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

interface CommandLine {
  text: string;
  type: "input" | "output" | "error" | "success";
  id: string;
}

export default function AccessTerminalModal({
  isOpen,
  onClose,
  artifacts,
  onTriggerOverclock,
  onAddLogMessage
}: AccessTerminalModalProps) {
  const [terminalInput, setTerminalInput] = useState("");
  const [history, setHistory] = useState<CommandLine[]>([
    { id: "1", type: "success", text: "LOGICAL MATRIX COMPILATION INTEGRITY: ONLINE" },
    { id: "2", type: "output", text: "Welcome to IEEESOC'26 Lyceum Core. System stabilized." },
    { id: "3", type: "output", text: "Type 'help' to review directory controls and command registries." }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = terminalInput.trim().toLowerCase();
    if (!query) return;

    const newLines: CommandLine[] = [
      { id: "input-" + Date.now(), type: "input", text: `root@lyceum_core:~# ${terminalInput}` }
    ];

    switch (query) {
      case "help":
        newLines.push(
          { id: "out-h1", type: "output", text: "Available System Registries:" },
          { id: "out-h2", type: "output", text: "  about       - Describe IEEESOC'26 architectural design." },
          { id: "out-h3", type: "output", text: "  list        - List active cryptographic artifacts & categories." },
          { id: "out-h4", type: "output", text: "  simulate    - Trigger a simulation overclock in the main forge." },
          { id: "out-h5", type: "output", text: "  status      - Display core health parameters and climate levels." },
          { id: "out-h6", type: "output", text: "  clear       - Wipe terminal readouts screen." },
          { id: "out-h7", type: "output", text: "  exit        - Close command shell console." }
        );
        break;

      case "about":
        newLines.push({
          id: "out-ab",
          type: "output",
          text: "IEEESOC'26 represents the grand 'Digital Renaissance' corridor. Built upon the classical high-contrast 'Renaissance Putty' aesthetic pairing, our framework syncs museum-like gallery layouts with physical cyber-mesh automatons."
        });
        break;

      case "list":
        newLines.push({ id: "out-l0", type: "success", text: `Scanning cataloged indices... Unlocking ${artifacts.length} entries.` });
        artifacts.forEach((art, idx) => {
          newLines.push({
            id: `out-art-${idx}`,
            type: "output",
            text: `  [+] ${art.code} - ${art.name} (${art.category}) | Purity: ${art.purityIndex}%`
          });
        });
        break;

      case "simulate":
        onTriggerOverclock();
        newLines.push({ 
          id: "out-sim", 
          type: "success", 
          text: "AUTHENTICATION CERTIFIED. Dispatching hyper-velocity logical instructions directly to the Gilded Guardian." 
        });
        onAddLogMessage("Remote console issued simulated hyper-velocity trigger: OVERCLOCK PRIMED.", "critical");
        break;

      case "status":
        newLines.push(
          { id: "out-st1", type: "output", text: "System Health Summary:" },
          { id: "out-st2", type: "success", text: "  - Vault Section 04: CONNECTED & INTEGRAL" },
          { id: "out-st3", type: "output", text: "  - Thermal Core Index: STABLE (34.2°C)" },
          { id: "out-st4", type: "output", text: "  - Database Synchronic Block: #44,192 verified" }
        );
        break;

      case "clear":
        setHistory([]);
        setTerminalInput("");
        return;

      case "exit":
        onClose();
        setTerminalInput("");
        return;

      default:
        newLines.push({
          id: "out-err",
          type: "error",
          text: `Error: command '${query}' not recognized inside biological kernel. Type 'help' for registries.`
        });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setTerminalInput("");
  };

  const executeQuickCommand = (cmd: string) => {
    setTerminalInput(cmd);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="notched-card bg-inverse-surface border border-surface-bright/20 w-full max-w-4xl h-[90vh] md:h-[650px] p-4 sm:p-6 flex flex-col justify-between text-surface-bright relative shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-surface-bright/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary-fixed-dim" />
                <div>
                  <h3 className="font-mono text-sm font-semibold tracking-wider text-surface-bright uppercase">
                    LYCEUM COMMAND SHELL
                  </h3>
                  <span className="font-mono text-[9px] text-surface-bright/40 block uppercase">
                    Node: root@lyceum_core_terminal_shell
                  </span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-surface-bright/10 text-surface-bright/60 hover:text-surface-bright transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2 mb-3 bg-white/5 p-2 rounded justify-start items-center">
              <span className="font-mono text-[9px] text-surface-bright/40 uppercase mr-1">Quick Codes:</span>
              <button 
                onClick={() => executeQuickCommand("help")}
                className="font-mono text-[9px] uppercase px-2 py-0.5 border border-surface-bright/10 rounded hover:bg-surface-bright/10 text-surface-bright/80"
              >
                help
              </button>
              <button 
                onClick={() => executeQuickCommand("list")}
                className="font-mono text-[9px] uppercase px-2 py-0.5 border border-surface-bright/10 rounded hover:bg-surface-bright/10 text-surface-bright/80"
              >
                list
              </button>
              <button 
                onClick={() => executeQuickCommand("status")}
                className="font-mono text-[9px] uppercase px-2 py-0.5 border border-surface-bright/10 rounded hover:bg-surface-bright/10 text-surface-bright/80"
              >
                status
              </button>
              <button 
                onClick={() => executeQuickCommand("simulate")}
                className="font-mono text-[9px] text-rose-300 uppercase px-2 py-0.5 border border-rose-500/20 rounded hover:bg-rose-500/10 text-surface-bright/80"
              >
                simulate
              </button>
            </div>

            {/* Terminal lines feed */}
            <div className="flex-grow overflow-y-auto no-scrollbar font-mono text-xs text-left p-3 bg-black/30 rounded border border-surface-bright/5 space-y-2 mb-4 scroll-smooth">
              {history.map((line) => {
                let textColor = "text-surface-bright/80";
                if (line.type === "input") textColor = "text-amber-300 font-medium";
                if (line.type === "success") textColor = "text-emerald-400";
                if (line.type === "error") textColor = "text-rose-400 font-semibold";

                return (
                  <div key={line.id} className="break-words leading-relaxed whitespace-pre-wrap">
                    {line.text}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-surface-bright/10 pt-4">
              <span className="font-mono text-xs text-amber-300 shrink-0 select-none">
                root@lyceum_core:~#
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type help for command registry..."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-grow bg-transparent border-none text-surface-bright placeholder-surface-bright/30 focus:outline-none focus:ring-0 font-mono text-xs py-1"
              />
              <button
                type="submit"
                className="p-1.5 hover:bg-surface-bright/10 text-primary-fixed-dim rounded shrink-0 transition-colors"
                title="Execute code instructions"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
