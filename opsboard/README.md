# Opsboard MVP

Opsboard is a Trello-style operations board fused with incident response, audit trails, and live metrics. It is designed to feel like a professional Ops platform while staying simple enough for a fast MVP.

Live demo: https://opsboard-mvp.web.app

## Features

- Boards + cards (Trello-style)
- Incident tracking + status page
- Audit log timeline
- Analytics dashboard
- AI ops copilot (stub panel)
- Seed demo data for a quick wow factor

## Product Flow

1) **Try demo account** (Anonymous Auth)
2) **Auto-seed** demo data on first login
3) Navigate **Boards → Incidents → Status → Audit → Analytics → AI**

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

Enable:
- Authentication → Sign-in method → Anonymous
- Firestore → Create database

## Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

## Build

```bash
npm run build
```

## Deploy (Firebase Hosting)

See: `opsboard/docs/firebase-hosting.md`

## Release Checklist

- [ ] Add Firebase env vars (or provide demo project)
- [ ] `npm test`
- [ ] `npm run test:e2e`
- [ ] `npm run build`
- [ ] Deploy to Firebase Hosting or Vercel
