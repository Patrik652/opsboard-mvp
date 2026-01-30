# Opsboard MVP

**Command your work. Prove your reliability.**

Opsboard is a Trello-style operations board that combines project management with incident response and operational monitoring. Built for teams who need to manage work while tracking reliability and maintaining audit trails for compliance.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

## Live Demo

**https://opsboard-mvp.web.app**

## Features

### Boards
Trello-style Kanban boards with lists (Backlog, In Progress, Done) and cards with priority levels.

### Incidents
Track live incidents with severity levels (low/med/high) and states (open/monitoring/resolved).

### Status
Public-facing service health dashboard showing overall system status and individual service cards.

### Audit
Compliance-ready audit log timeline capturing every action with timestamps.

### Analytics
"Reliability Pulse" dashboard with key metrics: cards in flight, open incidents, uptime percentage.

### AI Operations (Stub)
Placeholder for AI/LLM integration - ready for MCP tool calls.

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Space Grotesk font |
| **Backend** | Firebase Auth (anonymous), Firestore |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Deployment** | Firebase Hosting |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Patrik652/opsboard-mvp.git
cd opsboard-mvp/opsboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
opsboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   └── (app)/                # Protected app routes
│   │       ├── boards/
│   │       ├── incidents/
│   │       ├── status/
│   │       ├── audit/
│   │       ├── analytics/
│   │       └── ai/
│   ├── components/
│   │   ├── auth/                 # DemoLogin, SeedOnLogin
│   │   ├── layout/               # Sidebar, Topbar
│   │   ├── boards/               # BoardView
│   │   ├── incidents/            # IncidentList
│   │   ├── audit/                # AuditTimeline
│   │   ├── analytics/            # AnalyticsDashboard
│   │   └── ai/                   # AiPanel
│   └── lib/
│       ├── firebase.ts           # Firebase config
│       ├── types.ts              # TypeScript types
│       └── seed.ts               # Demo data
```

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm test          # Unit tests (Vitest)
npm run test:e2e  # E2E tests (Playwright)
npm run lint      # ESLint
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Anonymous provider)
3. Enable Firestore Database
4. Copy your config to `src/lib/firebase.ts`

## Design

- Dark theme with Zinc backgrounds
- Emerald accent color
- Space Grotesk typography
- Subtle grid overlay for technical aesthetic

## License

MIT

---

Built with Next.js, React, and Firebase.
