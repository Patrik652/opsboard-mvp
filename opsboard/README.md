# Opsboard MVP

Opsboard is a Trello-style operations board fused with incident response, audit trails, and live metrics. It is designed to look and feel like a real Ops platform while staying simple enough for an MVP demo.

## Features

- Boards + cards (Trello-style)
- Incident tracking + status page
- Audit log timeline
- Analytics dashboard
- AI ops copilot (stub panel)
- Seed demo data for a quick wow factor

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Firebase Auth + Firestore
- Vitest + React Testing Library
- Playwright E2E

## Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Firebase Setup

Create a Firebase project and fill in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Without Firebase config, the demo login button is disabled but the UI still works for viewing pages.

## Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

## Release Checklist

- [ ] Add Firebase env vars (or provide demo project)
- [ ] `npm test`
- [ ] `npm run test:e2e`
- [ ] `npm run build`
- [ ] Deploy to Firebase Hosting or Vercel

