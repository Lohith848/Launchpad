"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as LucideIcons from "lucide-react";
import { AppEntry } from "@/types";
import { useApp } from "@/context/AppContext";

interface AppCardProps {
  app: AppEntry;
  onEditClick: (app: AppEntry) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onEditClick }) => {
  const { editMode, incrementOpenCount } = useApp();
  
  // Sortable hook settings (dragging disabled when editMode is false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: app.id,
    disabled: !editMode,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const renderIcon = () => {
    const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.HelpCircle;
    return <IconComponent className="h-4 w-4" style={{ color: "var(--text-muted)" }} />;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (editMode) {
      e.preventDefault();
      onEditClick(app);
    } else {
      incrementOpenCount(app.id);
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(editMode ? listeners : {})}
      onClick={handleCardClick}
      className={`app-card ${app.pinned ? "pinned" : ""}`}
      tabIndex={0}
      aria-label={`Launch ${app.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !editMode) {
          incrementOpenCount(app.id);
          window.open(app.url, "_blank", "noopener,noreferrer");
        }
      }}
    >
      {/* Pinned Dot Indicator */}
      <div className="card-pin-dot" />

      {/* Icon Container */}
      <div className="card-icon">
        {renderIcon()}
      </div>

      {/* Card Info */}
      <span className="card-name">
        {app.name}
      </span>
      <span className="card-tag">
        {app.tag || app.category}
      </span>
    </div>
  );
};
