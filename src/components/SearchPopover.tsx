import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import type { PortalUser } from "../types";

export default function SearchPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PortalUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = sessionStorage.getItem("ieeesoc_token");
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setSearchResults(data.users);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <div ref={popoverRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center justify-center p-2.5 rounded-full border border-on-surface/10 hover:border-on-surface/30 transition-all cursor-pointer bg-surface-container-low/50 hover:bg-surface-container-low"
        title="Search Contributors"
      >
        <Search className="w-4 h-4 text-on-surface" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-surface border border-on-surface/10 notched-card shadow-2xl z-50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-on-surface/5 pb-2">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                Search Registry
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-on-surface/40 hover:text-on-surface cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface/40" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-[11px] text-on-surface"
              />
            </div>

            {isSearching && (
              <div className="py-4 text-center">
                <span className="font-mono text-[10px] text-on-surface/50 animate-pulse">Searching logs...</span>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar">
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-container-high rounded cursor-pointer transition-colors text-[11px]"
                  >
                    <div className="w-6 h-6 rounded-full bg-surface-container-high border border-on-surface/20 flex items-center justify-center overflow-hidden shrink-0">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                          {u.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-on-surface truncate">{u.name}</div>
                      <div className="font-mono text-[9px] text-on-surface/40 truncate">
                        {u.role} {u.githubUsername && `· @${u.githubUsername}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="py-3 text-center">
                <span className="font-mono text-[10px] text-on-surface/40">No archivists found.</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
