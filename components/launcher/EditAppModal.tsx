"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { AppEntry, CategoryKey } from "@/types";
import { X, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface EditAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppEntry | null;
}

const POPULAR_LUCIDE_ICONS = [
  "Code", "Sparkles", "Terminal", "Database", "Globe", "TrendingUp", 
  "MessageSquare", "BookOpen", "Settings", "Activity", "Compass", "Layers",
  "Send", "Brain", "Zap", "Play", "Briefcase", "Github", "Triangle"
];

export const EditAppModal: React.FC<EditAppModalProps> = ({ isOpen, onClose, app }) => {
  const { updateApp, deleteApp, categories } = useApp();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<CategoryKey>("dev");
  const [tag, setTag] = useState("");
  const [pinned, setPinned] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("Code");
  const [error, setError] = useState("");

  useEffect(() => {
    if (app) {
      setName(app.name);
      setUrl(app.url);
      setCategory(app.category);
      setTag(app.tag);
      setPinned(app.pinned);
      setSelectedIcon(app.icon || "Code");
      setError("");
    }
  }, [app]);

  if (!isOpen || !app) return null;

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

    updateApp(app.id, {
      name: name.trim(),
      url: finalUrl,
      category,
      icon: selectedIcon,
      tag: tag.trim() || category.toUpperCase(),
      pinned,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`DELETE ${app.name.toUpperCase()} SHORTCUT?`)) {
      deleteApp(app.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">EDIT APPLICATION</span>
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

          {/* Toggle Pinned Option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--border-default)",
              padding: "10px 14px",
              marginBottom: "16px",
              background: "var(--bg-surface)",
            }}
          >
            <div>
              <div className="form-label" style={{ marginBottom: "2px" }}>PIN TO FAVORITES</div>
              <div className="card-tag" style={{ fontSize: "8px", textTransform: "none", color: "var(--text-muted)" }}>
                Always displays in the highlighted top row.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className="pill"
              style={{
                background: pinned ? "var(--bg-raised)" : "transparent",
                borderColor: pinned ? "var(--border-active)" : "var(--border-default)",
                color: pinned ? "var(--text-primary)" : "var(--text-ghost)",
                padding: "4px 10px",
              }}
            >
              {pinned ? "PINNED" : "UNPINNED"}
            </button>
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

          <div className="modal-footer" style={{ padding: "16px 0 0 0", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleDelete}
              className="tb-btn"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              DELETE
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={onClose} className="tb-btn btn-cancel">
                CANCEL
              </button>
              <button type="submit" className="btn-primary">
                SAVE CHANGES
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
