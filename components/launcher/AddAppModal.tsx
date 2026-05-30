"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { CategoryKey } from "@/types";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_LUCIDE_ICONS = [
  "Code", "Sparkles", "Terminal", "Database", "Globe", "TrendingUp", 
  "MessageSquare", "BookOpen", "Settings", "Activity", "Compass", "Layers",
  "Send", "Brain", "Zap", "Play", "Briefcase", "Github", "Triangle"
];

export const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose }) => {
  const { addApp, categories } = useApp();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<CategoryKey>("dev");
  const [tag, setTag] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Code");
  const [error, setError] = useState("");

  // Auto-fill tags based on name and URL inputs
  useEffect(() => {
    if (url && !tag) {
      try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        const hostname = parsed.hostname.replace("www.", "");
        const dotIdx = hostname.indexOf(".");
        const domainName = dotIdx !== -1 ? hostname.substring(0, dotIdx) : hostname;
        
        if (domainName) {
          const cleanTag = domainName.toUpperCase();
          setTag(cleanTag.slice(0, 16));
        }
      } catch (e) {
        // Silently catch invalid url parsing on type
      }
    }
  }, [url, tag]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Application name is required");
      return;
    }
    if (name.length > 24) {
      setError("Name must be 24 characters or less");
      return;
    }

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      new URL(finalUrl);
    } catch (_) {
      setError("Please enter a valid URL");
      return;
    }

    addApp({
      name: name.trim(),
      url: finalUrl,
      category,
      icon: selectedIcon,
      tag: tag.trim() || category.toUpperCase(),
    });

    // Reset Form
    setName("");
    setUrl("");
    setCategory("dev");
    setTag("");
    setSelectedIcon("Code");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">ADD APPLICATION</span>
          <button
            onClick={onClose}
            className="pill"
            style={{ padding: "4px 8px", border: "1px solid var(--border-default)" }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div
              style={{
                marginBottom: "14px",
                padding: "8px 12px",
                border: "1px solid var(--border-active)",
                background: "var(--bg-raised)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
              }}
            >
              ERROR: {error.toUpperCase()}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">APP NAME</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supabase"
              maxLength={24}
              className="form-input"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://supabase.com"
              className="form-input"
              autoComplete="off"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label className="form-label">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="form-input"
                style={{ background: "var(--bg-surface)", WebkitAppearance: "none", borderRadius: 0 }}
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key} style={{ background: "var(--bg-overlay)" }}>
                    {cat.label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">TAG</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. DATABASE"
                maxLength={16}
                className="form-input"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "0px" }}>
            <label className="form-label">ICON</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                gap: "4px",
                maxHeight: "100px",
                overflowY: "auto",
                border: "1px solid var(--border-default)",
                padding: "8px",
                background: "var(--bg-surface)",
              }}
            >
              {POPULAR_LUCIDE_ICONS.map((ico) => {
                const IconComp = (LucideIcons as any)[ico] || LucideIcons.HelpCircle;
                const isSelected = selectedIcon === ico;
                return (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setSelectedIcon(ico)}
                    style={{
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: isSelected ? "1px solid var(--border-active)" : "1px solid transparent",
                      background: isSelected ? "var(--bg-raised)" : "transparent",
                      cursor: "pointer",
                    }}
                    title={ico}
                  >
                    <IconComp className="h-4 w-4" style={{ color: isSelected ? "var(--text-primary)" : "var(--text-muted)" }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-footer" style={{ padding: "16px 0 0 0", borderTop: "none" }}>
            <button type="button" onClick={onClose} className="tb-btn btn-cancel">
              CANCEL
            </button>
            <button type="submit" className="btn-primary">
              ADD APPLICATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
