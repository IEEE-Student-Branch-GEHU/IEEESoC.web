# IEEESoc Web App Portal

The user-facing digital lyceum web portal for the Graphic Era Hill University IEEE Student Branch fellowship program. The application serves as the centralized interface for tracking fellowship progress, showcasing project portfolios, viewing active codebase crates, interacting with bot event simulators, and presenting the developer rankings leaderboard.

---

## Key Features

*   **Access Terminal & Command Center**: Interactive mock dashboard console displaying system telemetrials, system logs, and security-validated session logins.
*   **Active Leaderboards**: Displays real-time ranking matrices of fellows and mentors filterable by track (AI, Full-Stack, DevOps, Security, Frontier) and synced to the bot backend.
*   **Project Crate Marketplace**: Highlights curated open-source repositories and scopes allocated to cohort tracks.
*   **Developer Gallery Portfolio**: Shows submitted classical-themed digital assets and developer contributions.
*   **Integrated Webhook Simulator**: Provides a mock testing deck to simulate GitHub webhook actions (PR opened, merges, self-merge warnings) and trace processing pipelines.

---

## Technical Stack

*   **Core**: React (v19) and TypeScript (v5)
*   **Styling**: TailwindCSS v4 with Vite integration and custom CSS variables
*   **Bundling**: Vite (v6) development server and static build pipeline
*   **Icons**: Lucide React icon library

---

## Getting Started & Installation

### 1. Prerequisites
Ensure Node.js (v18.0.0 or higher) is installed on your local machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Copy the example environment variables:
```bash
cp .env.example .env
```
Configure your Gemini API keys or backend endpoints if necessary.

### 4. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser to interact with the application.

### 5. Build for Production
To generate static production assets:
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.

---

## Project Structure

```
├── .env.example              # Environment variables template
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite config (TailwindCSS integration)
├── index.html                # Single-page application entry point
├── package.json              # Script directives & dependencies
└── src/
    ├── main.tsx              # React mounting root
    ├── index.css             # Tailwind base styles and styling tokens
    ├── App.tsx               # Main application container and view switcher
    ├── data.ts               # Program data catalogs and mock artifacts
    ├── types.ts              # Interface structures and type bindings
    └── components/
        ├── AccessTerminalModal.tsx  # Interactive console modal
        ├── BotSimulatorView.tsx     # Bot deck and pipeline monitor logs
        ├── CrateView.tsx            # Track repositories view
        ├── GalleryView.tsx          # Classical portfolio catalog
        └── LeaderboardView.tsx      # Paginated fellow and mentor rankings
```
