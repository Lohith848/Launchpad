"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useApp } from "@/context/AppContext";
import { AppCard } from "./AppCard";
import { AppEntry, CategoryKey } from "@/types";
import { Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface AppGridProps {
  onAddClick: () => void;
  onEditClick: (app: AppEntry) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({ onAddClick, onEditClick }) => {
  const {
    apps,
    reorderApps,
    activeCategory,
    searchQuery,
    editMode,
    categories,
    incrementOpenCount,
  } = useApp();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getFilteredApps = () => {
    let list = [...apps];

    if (activeCategory !== "all" && !searchQuery) {
      list = list.filter((app) => app.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.tag.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => a.order - b.order);
  };

  const filteredApps = getFilteredApps();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = apps.findIndex((app) => app.id === active.id);
    const newIndex = apps.findIndex((app) => app.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(apps, oldIndex, newIndex).map((app, idx) => ({
        ...app,
        order: idx,
      }));
      reorderApps(reordered);
    }
  };

  const renderPinnedStrip = () => {
    const pinnedApps = apps.filter((app) => app.pinned).sort((a, b) => a.order - b.order);
    if (pinnedApps.length === 0 || searchQuery || activeCategory !== "all" || editMode) {
      return null;
    }

    return (
      <section className="pinned-section" aria-label="Pinned apps">
        <div className="pinned-label">★ PINNED</div>
        <div className="pinned-strip">
          {pinnedApps.map((app) => {
            const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.HelpCircle;
            return (
              <a
                key={`pinned-${app.id}`}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pinned-card"
                onClick={(e) => {
                  e.preventDefault();
                  incrementOpenCount(app.id);
                  window.open(app.url, "_blank", "noopener,noreferrer");
                }}
              >
                <div className="pinned-icon">
                  <IconComponent className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                </div>
                <div>
                  <div className="pinned-name">{app.name}</div>
                  <div className="pinned-tag">{app.tag || app.category}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    );
  };

  const renderAddCard = () => (
    <div
      onClick={onAddClick}
      className="app-card app-card-add"
      role="button"
      tabIndex={0}
      aria-label="Add new application shortcut"
    >
      <div className="card-icon">
        <Plus className="h-4 w-4" style={{ color: "var(--text-ghost)" }} />
      </div>
      <span className="card-name">ADD APP</span>
      <span className="card-tag">NEW SHORTCUT</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Favorites Strip */}
      {renderPinnedStrip()}

      {/* Main Apps Layout */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={filteredApps.map((a) => a.id)} strategy={rectSortingStrategy}>
          <div style={{ minHeight: "200px" }}>
            {filteredApps.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "48px",
                  border: "1px dashed var(--border-default)",
                  borderRadius: "4px",
                  background: "transparent",
                }}
              >
                <span className="card-tag" style={{ color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.10em" }}>
                  NO APPLICATIONS FOUND
                </span>
                <span className="pinned-tag" style={{ marginTop: "6px" }}>
                  {searchQuery ? "TRY REFINING YOUR QUERY OR PRESS ESC" : "CLICK ADD APP TO REGISTER A NEW SHORTCUT"}
                </span>
              </div>
            ) : editMode || searchQuery || activeCategory !== "all" ? (
              /* Flat view (Edit launcher, category filters, search filters) */
              <div className="app-grid">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} onEditClick={onEditClick} />
                ))}
                {!searchQuery && activeCategory !== "all" && renderAddCard()}
              </div>
            ) : (
              /* Section-grouped view (Default overview dashboard) */
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {categories.map((cat) => {
                  const catApps = filteredApps.filter((app) => app.category === cat.key);
                  if (catApps.length === 0) return null;

                  return (
                    <section key={cat.key} className="app-section">
                      <div className="section-head">
                        <span className={`cat-badge cat-badge-${cat.key}`}>
                          {cat.label}
                        </span>
                        <span className="section-count">
                          {catApps.length} {catApps.length === 1 ? "ITEM" : "ITEMS"}
                        </span>
                      </div>
                      <div className="app-grid">
                        {catApps.map((app) => (
                          <AppCard key={app.id} app={app} onEditClick={onEditClick} />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {/* Add Application Card trigger block */}
                <section className="app-section">
                  <div className="section-head">
                    <span className="cat-badge cat-badge-misc">
                      ACTIONS
                    </span>
                  </div>
                  <div className="app-grid">
                    {renderAddCard()}
                  </div>
                </section>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
