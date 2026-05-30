"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CategoryKey } from "@/types";

export const FilterPills: React.FC = () => {
  const { categories, apps, activeCategory, setActiveCategory } = useApp();

  const getAppCount = (key: CategoryKey | "all") => {
    if (key === "all") return apps.length;
    return apps.filter((app) => app.category === key).length;
  };

  return (
    <nav className="filters" aria-label="Category filters" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "32px", padding: 0 }}>
      {/* ALL Pill */}
      <button
        onClick={() => setActiveCategory("all")}
        className={`pill ${activeCategory === "all" ? "active" : ""}`}
      >
        <span>ALL</span>
        <span className="pill-count">{getAppCount("all")}</span>
      </button>

      {/* Categories Loop */}
      {categories.map((cat) => {
        const count = getAppCount(cat.key);
        return (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`pill ${activeCategory === cat.key ? "active" : ""}`}
          >
            <span>{cat.label}</span>
            <span className="pill-count">{count}</span>
          </button>
        );
      })}
    </nav>
  );
};
