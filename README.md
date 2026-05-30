# LaunchPad — Developer Panel

Tactile, high-precision desktop control panel and launcher for personal tools, bookmarks, and productivity shortcuts. Crafted with a premium mechanical keycap-inspired aesthetic.

---

## Key Features

- ⌨️ **Tactile Keycap Design**: A tactile layout featuring responsive active keycap depths, mechanical-click states, and vintage noise textures.
- **Light Mode by Default**: Refined to initialize in a gorgeous cream-colored Light Mode with high contrast.
- **Improved Dark Mode Contrast**: Upgraded theme color tokens to ensure all clock sub-elements, status counters, placeholders, and keyboard hints are clear, readable, and perfectly balanced.
- **Nine Color-Themed Categories**:
  - **Dev Tools** (Green Theme)
  - **AI Assistants** (Purple Theme)
  - **Finance** (Amber Theme)
  - **Media & Social** (Blue Theme)
  - **College** (Pink Theme)
  - **Websites** (Neutral Theme)
  - **Games** (Retro Red/Orange Theme) — *NEW*
  - **Design inspo** (Teal/Cyan Theme) — *NEW*
  - **random** (Magenta Theme) — *NEW*
- **State Persistence & Auto-Merge**: Safely hydrates from `localStorage` while dynamically merging any new system-default categories without breaking existing configurations.
- **Tactical Keyboard Shortcuts**:
  - `Alt+N` or `Ctrl+N` — Register a new application shortcut
  - `Alt+E` or `Ctrl+E` — Toggle launcher edit/rearrange mode
  - `/` — Focus the search console input
  - `ESC` — Clear search query or exit modal/edit mode
- **Tactile Actions**:
  - **Drag-and-Drop**: Easily rearrange application positions within or across views using a native grid layout powered by `@dnd-kit`.
  - **Backup Sync**: Sync and export/import your configuration settings seamlessly as a structured `.json` file.
  - **Favorites Strip**: Highlight pinned shortcuts to reside permanently in the prominent top strip.

---

## Technical Architecture

Built with a highly structured Next.js and TypeScript environment:
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **State Engine**: React Context Provider (`AppContext`) with standard local state hydration.
- **Drag-and-Drop**: [@dnd-kit (Core, Sortable, Modifiers)](https://github.com/clauderic/dnd-kit)
- **Theme Utility**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styles**: Tailwind base with custom variables in vanilla CSS for highly tactile and accurate visual states.

---

## Getting Started

### Prerequisites
Make sure you have Node.js and `pnpm` installed.

### Installation
1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/Lohith848/Launchpad.git
   cd Launchpad
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Launch the local development console server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the console.

---

## Build and Deployment

To construct an optimized, statically prerendered production bundle:
```bash
pnpm build
```

---

Lohith was bored !!

The server outputs verified production build pages ready for server-side hosting or direct static PWA hosting.
