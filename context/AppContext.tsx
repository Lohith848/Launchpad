"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppEntry, Category, LaunchPadPreferences, CategoryKey, LaunchPadStore } from "@/types";
import { DEFAULT_APPS, DEFAULT_CATEGORIES, DEFAULT_PREFERENCES } from "@/data/defaults";

interface AppContextType {
  apps: AppEntry[];
  categories: Category[];
  preferences: LaunchPadPreferences;
  activeCategory: CategoryKey | "all";
  searchQuery: string;
  editMode: boolean;
  isHydrated: boolean;
  setActiveCategory: (cat: CategoryKey | "all") => void;
  setSearchQuery: (query: string) => void;
  toggleEditMode: () => void;
  addApp: (app: Omit<AppEntry, "id" | "addedAt" | "openCount" | "order" | "pinned">) => void;
  updateApp: (id: string, updated: Partial<AppEntry>) => void;
  deleteApp: (id: string) => void;
  reorderApps: (reordered: AppEntry[]) => void;
  incrementOpenCount: (id: string) => void;
  updatePreferences: (prefs: Partial<LaunchPadPreferences>) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "launchpad_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [preferences, setPreferences] = useState<LaunchPadPreferences>(DEFAULT_PREFERENCES);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);

  // 1. Initial hydration from localStorage (runs once on mount)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: LaunchPadStore = JSON.parse(stored);
        if (parsed.version === 1) {
          // If stored app icon was object-based from previous version, convert to string
          const cleanedApps = (parsed.apps || []).map((app: any) => {
            let iconStr = "Code";
            if (typeof app.icon === "object" && app.icon !== null) {
              if (app.icon.type === "lucide") {
                iconStr = app.icon.name;
              } else if (app.icon.type === "emoji") {
                iconStr = "Sparkles";
              } else if (app.icon.type === "initials") {
                iconStr = "Code";
              } else if (app.icon.type === "url") {
                iconStr = "Globe";
              }
            } else if (typeof app.icon === "string") {
              iconStr = app.icon;
            }
            return {
              ...app,
              icon: iconStr,
              addedAt: app.addedAt || app.createdAt || new Date().toISOString(),
            } as AppEntry;
          });
          setApps(cleanedApps);
          
          // Merge default categories to make sure new categories are included
          const existingKeys = new Set((parsed.categories || []).map((c: any) => c.key));
          const mergedCategories = [...(parsed.categories || [])];
          DEFAULT_CATEGORIES.forEach((defaultCat) => {
            if (!existingKeys.has(defaultCat.key)) {
              mergedCategories.push(defaultCat);
            }
          });
          setCategories(mergedCategories);

          setPreferences(parsed.preferences || DEFAULT_PREFERENCES);
          if (parsed.preferences?.defaultView) {
            setActiveCategory(parsed.preferences.defaultView);
          }
        } else {
          initializeDefaults();
        }
      } else {
        initializeDefaults();
      }
    } catch (e) {
      console.error("Failed to load LaunchPad storage, fallback to defaults.", e);
      initializeDefaults();
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const initializeDefaults = () => {
    setApps(DEFAULT_APPS);
    setCategories(DEFAULT_CATEGORIES);
    setPreferences(DEFAULT_PREFERENCES);
    setActiveCategory(DEFAULT_PREFERENCES.defaultView);
    
    const initialStore: LaunchPadStore = {
      version: 1,
      apps: DEFAULT_APPS,
      categories: DEFAULT_CATEGORIES,
      preferences: DEFAULT_PREFERENCES,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStore));
  };

  // 2. Sync changes back to localStorage (only runs after hydration to prevent blank overrides)
  useEffect(() => {
    if (!isHydrated) return;

    const store: LaunchPadStore = {
      version: 1,
      apps,
      categories,
      preferences,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  }, [apps, categories, preferences, isHydrated]);

  // 3. Actions
  const toggleEditMode = () => setEditMode((prev) => !prev);

  const addApp = (newApp: Omit<AppEntry, "id" | "addedAt" | "openCount" | "order" | "pinned">) => {
    // Generate simple 8-char nanoid alternative
    const id = Math.random().toString(36).substring(2, 10);
    
    // Find next order index
    const categoryApps = apps.filter((a) => a.category === newApp.category);
    const order = categoryApps.length;

    const entry: AppEntry = {
      ...newApp,
      id,
      pinned: false,
      order,
      addedAt: new Date().toISOString(),
      openCount: 0,
    };

    setApps((prev) => [...prev, entry]);
  };

  const updateApp = (id: string, updated: Partial<AppEntry>) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updated } : app))
    );
  };

  const deleteApp = (id: string) => {
    setApps((prev) => {
      const remaining = prev.filter((app) => app.id !== id);
      // Re-index orders within categories to maintain gap-free orders
      const grouped: { [key: string]: AppEntry[] } = {};
      remaining.forEach((app) => {
        if (!grouped[app.category]) grouped[app.category] = [];
        grouped[app.category].push(app);
      });

      const reindexed: AppEntry[] = [];
      Object.keys(grouped).forEach((catKey) => {
        grouped[catKey]
          .sort((a, b) => a.order - b.order)
          .forEach((app, idx) => {
            reindexed.push({ ...app, order: idx });
          });
      });

      // Also add back apps that didn't fall into categorized groups
      const leftover = remaining.filter((app) => !grouped[app.category]);
      return [...reindexed, ...leftover];
    });
  };

  const reorderApps = (reordered: AppEntry[]) => {
    setApps(reordered);
  };

  const incrementOpenCount = (id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              openCount: app.openCount + 1,
            }
          : app
      )
    );
  };

  const updatePreferences = (newPrefs: Partial<LaunchPadPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const exportData = () => {
    const store: LaunchPadStore = {
      version: 1,
      apps,
      categories,
      preferences,
    };
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `launchpad-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      // Basic validation
      if (parsed.version === 1 && Array.isArray(parsed.apps) && Array.isArray(parsed.categories)) {
        // Validate each app entry has required fields
        const cleanedApps = parsed.apps.map((app: any) => {
          let iconStr = "Code";
          if (typeof app.icon === "object" && app.icon !== null) {
            iconStr = app.icon.name || "Code";
          } else if (typeof app.icon === "string") {
            iconStr = app.icon;
          }
          return {
            id: app.id || Math.random().toString(36).substring(2, 10),
            name: app.name || "Unnamed",
            url: app.url || "https://",
            category: app.category || "misc",
            icon: iconStr,
            tag: app.tag || "APP",
            pinned: !!app.pinned,
            order: typeof app.order === "number" ? app.order : 0,
            addedAt: app.addedAt || app.createdAt || new Date().toISOString(),
            openCount: typeof app.openCount === "number" ? app.openCount : 0,
          } as AppEntry;
        });

        setApps(cleanedApps);
        setCategories(parsed.categories);
        if (parsed.preferences) {
          setPreferences(parsed.preferences);
          if (parsed.preferences.defaultView) {
            setActiveCategory(parsed.preferences.defaultView);
          }
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to parse imported json data", e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        apps,
        categories,
        preferences,
        activeCategory,
        searchQuery,
        editMode,
        isHydrated,
        setActiveCategory,
        setSearchQuery,
        toggleEditMode,
        addApp,
        updateApp,
        deleteApp,
        reorderApps,
        incrementOpenCount,
        updatePreferences,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
