"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Clock } from "@/components/launcher/Clock";
import { SearchBar } from "@/components/launcher/SearchBar";
import { FilterPills } from "@/components/launcher/FilterPills";
import { AppGrid } from "@/components/launcher/AppGrid";
import { AddAppModal } from "@/components/launcher/AddAppModal";
import { EditAppModal } from "@/components/launcher/EditAppModal";
import { AppEntry } from "@/types";
import { Edit, Download, Upload, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const {
    isHydrated,
    editMode,
    toggleEditMode,
    exportData,
    importData,
    apps,
  } = useApp();

  const { resolvedTheme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppEntry | null>(null);

  // Global keyboard listeners for Windows (Alt/Ctrl-based)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modal and edit mode
      if (e.key === "Escape") {
        setIsAddOpen(false);
        setEditingApp(null);
      }

      // Alt+N or Ctrl+N to open Add App modal
      if ((e.altKey || e.ctrlKey) && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        setIsAddOpen(true);
      }

      // Alt+E or Ctrl+E to toggle Edit Mode
      if ((e.altKey || e.ctrlKey) && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        toggleEditMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleEditMode]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = importData(text);
        if (success) {
          alert("Backup data imported successfully");
        } else {
          alert("Invalid backup file. Please check schema");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!isHydrated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-base)",
          fontFamily: "var(--font-mono)",
          color: "var(--text-ghost)",
          fontSize: "10px",
          letterSpacing: "0.12em",
        }}
      >
        LOADING LAUNCHPAD CONSOLE...
      </div>
    );
  }

  return (
    <div className="shell">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* TOP BAR */}
      <header className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        {/* Brand Block */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="brand-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#4A4A42" strokeWidth="1.5">
              <rect x="2" y="2" width="5" height="5" />
              <rect x="9" y="2" width="5" height="5" />
              <rect x="2" y="9" width="5" height="5" />
              <rect x="9" y="9" width="5" height="5" />
            </svg>
          </div>
          <div>
            <div className="brand-text">LAUNCHPAD</div>
            <div className="brand-meta">BY LOHITH</div>
          </div>
        </div>

        {/* Clock Block */}
        <Clock />
      </header>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <SearchBar />

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* A. Edit Mode button */}
          <button
            onClick={toggleEditMode}
            className="tb-btn"
            style={{
              borderColor: editMode ? "var(--border-active)" : "var(--border-default)",
              background: editMode ? "var(--bg-raised)" : "var(--bg-surface)",
              color: editMode ? "var(--text-primary)" : "var(--text-dim)",
            }}
            title="Arrange shortcuts / Configure apps"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>{editMode ? "SAVE" : "EDIT LAUNCHER"}</span>
          </button>

          {/* B. Sync backlog buttons */}
          <button
            onClick={exportData}
            className="tb-btn"
            title="Export config database (.json)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>EXPORT</span>
          </button>

          <button
            onClick={handleImportClick}
            className="tb-btn"
            title="Import config database (.json)"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>IMPORT</span>
          </button>

          {/* C. Theme Switcher */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="tb-btn tb-btn-icon"
            title="Toggle console theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <FilterPills />

      {/* MAIN APP GRID */}
      <main className="app-sections" aria-label="All apps">
        <AppGrid
          onAddClick={() => setIsAddOpen(true)}
          onEditClick={(app) => setEditingApp(app)}
        />
      </main>

      {/* FOOTER STATUS BAR */}
      <footer className="statusbar" aria-label="Status">
        <div className="status-left">
          <div className="status-item">
            <div className="status-dot" />
            ONLINE
          </div>
          <div className="status-item">
            {apps.length} {apps.length === 1 ? "APP" : "APPS"}
          </div>
          <div className="status-item">
            PWA READY
          </div>
        </div>

        <div className="kbd-hints">
          <div><span className="kbd">/</span> SEARCH</div>
          <div><span className="kbd">ESC</span> CLEAR</div>
          <div><span className="kbd">ALT+N</span> ADD APP</div>
          <div><span className="kbd">ALT+E</span> EDIT</div>
        </div>
      </footer>

      {/* POPUP MODALS */}
      <AddAppModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditAppModal
        isOpen={editingApp !== null}
        onClose={() => setEditingApp(null)}
        app={editingApp}
      />
    </div>
  );
}
