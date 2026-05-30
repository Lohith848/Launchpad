"use client";

import React, { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on "/" keypress (unless user is already typing in an input/textarea)
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Blur or clear on "Escape"
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setSearchQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchQuery]);

  return (
    <div className="search-wrap select-none">
      <Search className="search-icon h-4 w-4" style={{ color: "var(--text-ghost)", pointerEvents: "none" }} />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search apps by name or category tag..."
        autoComplete="off"
        spellCheck="false"
      />
      <div className="search-kbd">
        /
      </div>
    </div>
  );
};
