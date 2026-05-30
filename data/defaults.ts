import { Category, AppEntry, LaunchPadPreferences } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  { key: "dev", label: "Dev Tools" },
  { key: "ai", label: "AI Assistants" },
  { key: "finance", label: "Finance" },
  { key: "media", label: "Media & Social" },
  { key: "college", label: "College" },
  { key: "misc", label: "Websites" },
  { key: "games", label: "Games" },
  { key: "design", label: "Design inspo" },
  { key: "random", label: "random" },
];

export const DEFAULT_PREFERENCES: LaunchPadPreferences = {
  theme: "light",
  defaultView: "all",
};

export const DEFAULT_APPS: AppEntry[] = [
  { id: 'cursor',   name: 'Cursor',      url: 'https://cursor.so',         category: 'dev',     icon: 'Code',       tag: 'AI EDITOR',   pinned: true,  order: 0, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'vscode',   name: 'VS Code Web', url: 'https://vscode.dev',        category: 'dev',     icon: 'Terminal',   tag: 'EDITOR',      pinned: false, order: 1, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'github',   name: 'GitHub',      url: 'https://github.com',        category: 'dev',     icon: 'Github',     tag: 'REPOSITORY',  pinned: true,  order: 2, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'supabase', name: 'Supabase',    url: 'https://supabase.com',      category: 'dev',     icon: 'Database',   tag: 'DATABASE',    pinned: false, order: 3, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'vercel',   name: 'Vercel',      url: 'https://vercel.com',        category: 'dev',     icon: 'Triangle',   tag: 'HOSTING',     pinned: false, order: 4, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'claude',   name: 'Claude',      url: 'https://claude.ai',         category: 'ai',      icon: 'Brain',      tag: 'AI CHAT',     pinned: true,  order: 0, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'groq',     name: 'Groq',        url: 'https://groq.com',          category: 'ai',      icon: 'Zap',        tag: 'LLM API',     pinned: false, order: 1, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'v0',       name: 'v0.dev',      url: 'https://v0.dev',            category: 'ai',      icon: 'Wand2',      tag: 'UI GEN',      pinned: false, order: 2, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'groww',    name: 'Groww',       url: 'https://groww.in',          category: 'finance', icon: 'TrendingUp', tag: 'INVEST',      pinned: false, order: 0, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'pph',      name: 'PeoplePerHr', url: 'https://peopleperhour.com', category: 'finance', icon: 'Briefcase',  tag: 'FREELANCE',   pinned: false, order: 1, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'yt',       name: 'YouTube',     url: 'https://youtube.com',       category: 'media',   icon: 'Play',       tag: 'VIDEO',       pinned: false, order: 0, addedAt: new Date().toISOString(), openCount: 0 },
  { id: 'tg',       name: 'Telegram',    url: 'https://web.telegram.org',  category: 'misc',    icon: 'Send',       tag: 'CHAT',        pinned: false, order: 0, addedAt: new Date().toISOString(), openCount: 0 },
];
export const DEFAULT_PREFS: LaunchPadPreferences = {
  theme: "light",
  defaultView: "all",
};
