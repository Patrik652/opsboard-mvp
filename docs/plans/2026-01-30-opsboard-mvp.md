# Opsboard MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a visually impressive Opsboard MVP (Trello-style boards + incidents + audit log + analytics + AI stub) using Next.js and Firebase.

**Architecture:** Single Next.js app with Firebase Auth + Firestore. Client-side data access with snapshot listeners. Seed demo data on first login. Modular pages for Boards, Incidents, Status, Audit, Analytics, AI.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Firebase (Auth + Firestore), Vitest + RTL, Playwright.

---

### Task 1: Scaffold Next.js app

**Files:**
- Create: `package.json` (via scaffold)
- Create: `src/` (via scaffold)

**Step 1: Scaffold app**
Run: `pnpm create next-app@latest opsboard --ts --app --tailwind --eslint --src-dir --import-alias "@/*"`
Expected: New app created in `opsboard/`

**Step 2: Move into app and install deps**
Run: `cd opsboard && pnpm install`
Expected: Dependencies installed

**Step 3: Commit**
Run:
```bash
git add opsboard

git commit -m "chore: scaffold next app"
```

---

### Task 2: Configure Firebase SDK

**Files:**
- Create: `opsboard/src/lib/firebase.ts`
- Create: `opsboard/src/lib/firebase-admin.ts` (optional placeholder)
- Modify: `opsboard/.env.local` (local only)

**Step 1: Write minimal firebase client**
```ts
// opsboard/src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Step 2: Add `.env.local` placeholders**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Step 3: Commit**
```bash
git add opsboard/src/lib/firebase.ts opsboard/.env.local

git commit -m "chore: add firebase client"
```

---

### Task 3: Define data types and seed helpers

**Files:**
- Create: `opsboard/src/lib/types.ts`
- Create: `opsboard/src/lib/seed.ts`
- Test: `opsboard/src/lib/seed.test.ts`

**Step 1: Write failing test**
```ts
import { buildSeedData } from "./seed";

test("buildSeedData creates boards and incidents", () => {
  const seed = buildSeedData("user-1");
  expect(seed.boards.length).toBeGreaterThan(0);
  expect(seed.incidents.length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**
Run: `cd opsboard && pnpm test -- seed.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement minimal types + seed builder**
```ts
// opsboard/src/lib/types.ts
export type Board = { id: string; name: string; lists: { id: string; name: string }[] };
export type Card = { id: string; boardId: string; listId: string; title: string; priority: "low" | "med" | "high" };
export type Incident = { id: string; title: string; severity: "low" | "med" | "high"; state: "open" | "monitoring" | "resolved" };
export type AuditLog = { id: string; message: string; createdAt: number };

// opsboard/src/lib/seed.ts
import { Board, Card, Incident, AuditLog } from "./types";

export function buildSeedData(userId: string) {
  const boards: Board[] = [
    { id: "b1", name: "Opsboard", lists: [
      { id: "l1", name: "Backlog" },
      { id: "l2", name: "In Progress" },
      { id: "l3", name: "Done" },
    ]},
  ];

  const cards: Card[] = [
    { id: "c1", boardId: "b1", listId: "l1", title: "Prepare incident drill", priority: "high" },
    { id: "c2", boardId: "b1", listId: "l2", title: "Review audit pipeline", priority: "med" },
  ];

  const incidents: Incident[] = [
    { id: "i1", title: "Latency spike EU", severity: "high", state: "monitoring" },
    { id: "i2", title: "Webhook failures", severity: "med", state: "open" },
  ];

  const auditLogs: AuditLog[] = [
    { id: "a1", message: "Created incident: Latency spike EU", createdAt: Date.now() },
  ];

  return { boards, cards, incidents, auditLogs, userId };
}
```

**Step 4: Run test to verify it passes**
Run: `cd opsboard && pnpm test -- seed.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add opsboard/src/lib/types.ts opsboard/src/lib/seed.ts opsboard/src/lib/seed.test.ts

git commit -m "feat: add seed data builder"
```

---

### Task 4: Build authentication + demo login

**Files:**
- Create: `opsboard/src/components/auth/DemoLogin.tsx`
- Modify: `opsboard/src/app/page.tsx`

**Step 1: Write failing component test**
```tsx
import { render, screen } from "@testing-library/react";
import DemoLogin from "./DemoLogin";

test("shows demo login button", () => {
  render(<DemoLogin />);
  expect(screen.getByText(/Try demo account/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `cd opsboard && pnpm test -- DemoLogin.test.tsx`
Expected: FAIL (component not found)

**Step 3: Implement DemoLogin**
```tsx
"use client";

import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DemoLogin() {
  return (
    <button
      className="rounded-xl bg-emerald-500 px-6 py-3 text-black font-semibold"
      onClick={() => signInAnonymously(auth)}
    >
      Try demo account
    </button>
  );
}
```

**Step 4: Update landing page**
Add hero + DemoLogin to `page.tsx`

**Step 5: Run test to verify it passes**
Run: `cd opsboard && pnpm test -- DemoLogin.test.tsx`
Expected: PASS

**Step 6: Commit**
```bash
git add opsboard/src/components/auth/DemoLogin.tsx opsboard/src/app/page.tsx

git commit -m "feat: add demo login"
```

---

### Task 5: Seed Firestore on first login

**Files:**
- Create: `opsboard/src/lib/seedFirestore.ts`
- Modify: `opsboard/src/app/(app)/layout.tsx`
- Modify: `opsboard/src/components/auth/DemoLogin.tsx`

**Step 1: Write failing unit test**
```ts
import { shouldSeed } from "./seedFirestore";

test("shouldSeed returns true when no data", () => {
  expect(shouldSeed({ boards: 0, incidents: 0 })).toBe(true);
});
```

**Step 2: Run test to verify it fails**
Run: `cd opsboard && pnpm test -- seedFirestore.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement minimal seed helper**
```ts
export function shouldSeed(counts: { boards: number; incidents: number }) {
  return counts.boards === 0 && counts.incidents === 0;
}
```

**Step 4: Run test to verify it passes**
Run: `cd opsboard && pnpm test -- seedFirestore.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add opsboard/src/lib/seedFirestore.ts opsboard/src/lib/seedFirestore.test.ts

git commit -m "feat: add seed decision helper"
```

---

### Task 6: Build App shell and navigation

**Files:**
- Create: `opsboard/src/app/(app)/layout.tsx`
- Create: `opsboard/src/components/layout/Sidebar.tsx`
- Create: `opsboard/src/components/layout/Topbar.tsx`

**Step 1: Write failing component test for Sidebar**
```tsx
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

test("shows navigation items", () => {
  render(<Sidebar />);
  expect(screen.getByText(/Boards/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `cd opsboard && pnpm test -- Sidebar.test.tsx`
Expected: FAIL

**Step 3: Implement minimal Sidebar + Topbar**
Provide basic nav and brand

**Step 4: Run test to verify it passes**
Run: `cd opsboard && pnpm test -- Sidebar.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add opsboard/src/app/(app)/layout.tsx opsboard/src/components/layout/Sidebar.tsx opsboard/src/components/layout/Topbar.tsx

git commit -m "feat: add app shell"
```

---

### Task 7: Boards page (Trello-like)

**Files:**
- Create: `opsboard/src/app/(app)/boards/page.tsx`
- Create: `opsboard/src/components/boards/BoardView.tsx`
- Test: `opsboard/src/components/boards/BoardView.test.tsx`

**Step 1: Write failing component test**
```tsx
import { render, screen } from "@testing-library/react";
import BoardView from "./BoardView";

test("renders board title", () => {
  render(<BoardView title="Opsboard" lists={[]} cards={[]} />);
  expect(screen.getByText("Opsboard")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `cd opsboard && pnpm test -- BoardView.test.tsx`
Expected: FAIL

**Step 3: Implement BoardView**
Render lists + cards, simple move action

**Step 4: Run test to verify it passes**
Run: `cd opsboard && pnpm test -- BoardView.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add opsboard/src/app/(app)/boards/page.tsx opsboard/src/components/boards/BoardView.tsx opsboard/src/components/boards/BoardView.test.tsx

git commit -m "feat: add boards page"
```

---

### Task 8: Incidents page + Status page

**Files:**
- Create: `opsboard/src/app/(app)/incidents/page.tsx`
- Create: `opsboard/src/components/incidents/IncidentList.tsx`
- Create: `opsboard/src/app/(app)/status/page.tsx`

**Step 1: Write failing test for IncidentList**
**Step 2: Run to fail**
**Step 3: Implement component and pages**
**Step 4: Run to pass**
**Step 5: Commit**

---

### Task 9: Audit log page

**Files:**
- Create: `opsboard/src/app/(app)/audit/page.tsx`
- Create: `opsboard/src/components/audit/AuditTimeline.tsx`

**Steps:** same TDD cycle as above

---

### Task 10: Analytics dashboard

**Files:**
- Create: `opsboard/src/app/(app)/analytics/page.tsx`
- Create: `opsboard/src/components/analytics/AnalyticsDashboard.tsx`

**Steps:** same TDD cycle as above

---

### Task 11: AI assistant panel (stub)

**Files:**
- Create: `opsboard/src/app/(app)/ai/page.tsx`
- Create: `opsboard/src/components/ai/AiPanel.tsx`

**Steps:** same TDD cycle as above

---

### Task 12: Global styling and visual polish

**Files:**
- Modify: `opsboard/src/app/globals.css`
- Modify: `opsboard/tailwind.config.ts`

**Steps:** add fonts, color vars, gradients, animations; verify layout on desktop + mobile.

---

### Task 13: E2E tests

**Files:**
- Create: `opsboard/playwright.config.ts`
- Create: `opsboard/tests/e2e/basic.spec.ts`

**Steps:** login -> seed -> navigate -> create incident -> audit shows entry

---

### Task 14: Docs + Release checklist

**Files:**
- Create: `opsboard/README.md`
- Create: `opsboard/docs/demo-script.md`

**Steps:** document local setup, Firebase env vars, test commands, demo script.

---

Plan complete. Next step is to execute tasks with superpowers:executing-plans.
