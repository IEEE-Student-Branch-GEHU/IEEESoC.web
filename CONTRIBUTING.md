# Contributing Guidelines

Thank you for contributing to the **IEEESoc Web Portal**! This document provides information on setting up your local environment, coding standards, and submitting pull requests.

---

## Technical Stack

*   **Frontend**: React (v19) + TypeScript (v5)
*   **Styling**: Vanilla CSS + TailwindCSS v4 integration (via `@tailwindcss/vite` plugin)
*   **Build Tool**: Vite (v6)

---

## Local Development Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 2. Installation
```bash
npm install
```

### 3. Environment Config
Rename `.env.example` to `.env` and fill in any required keys:
```bash
cp .env.example .env
```

### 4. Running the Dev Server
```bash
npm run dev
```
By default, the server runs on [http://localhost:3000](http://localhost:3000).

---

## Code Quality & Standards

### 1. Linting
Verify TypeScript typing and compile flags before submitting a PR:
```bash
npm run lint
```

### 2. Styling Rules
*   Prefer organized CSS structures utilizing TailwindCSS classes or modular CSS variables.
*   Keep designs aligned with the established `slate-950` dark mode theme and glassmorphic telemetry logs layout.

### 3. Submitting Pull Requests
*   **Branch Naming**: Use prefixed branches (e.g. `feat/timeline-animation`, `fix/terminal-alignment`).
*   **PR Titles**: Write concise titles referencing the implemented updates.
*   **Description**: Briefly explain your changes and test steps.
