export type CategoryKey = "dev" | "ai" | "finance" | "media" | "college" | "misc" | "games" | "design" | "random";

export interface AppEntry {
  id: string;           // 8-character ID
  name: string;         // max 24 chars
  url: string;          // full URL with https://
  category: CategoryKey;
  icon: string;         // Lucide icon name (e.g. 'Code', 'Brain', 'Terminal')
  tag: string;          // max 16 chars, uppercase (e.g. 'AI EDITOR')
  pinned: boolean;
  order: number;
  addedAt: string;      // ISO timestamp
  openCount: number;
}

export interface Category {
  key: CategoryKey;
  label: string;       // Display name
}

export interface LaunchPadPreferences {
  theme: "system" | "light" | "dark";
  defaultView: CategoryKey | "all";
}

export interface LaunchPadStore {
  version: number;
  apps: AppEntry[];
  categories: Category[];
  preferences: LaunchPadPreferences;
}
