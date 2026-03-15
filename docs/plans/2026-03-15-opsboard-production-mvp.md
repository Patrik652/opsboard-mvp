# Opsboard Production MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship Opsboard as a portfolio-grade production MVP with Google sign-in, per-user Firestore persistence, starter workspace bootstrap, live board and incident workflows, deterministic copilot, and release-quality verification.

**Architecture:** Keep App Router pages thin and move all runtime behavior behind feature and repository layers. Separate `demo` and `authenticated` modes explicitly, store authenticated data under `users/{uid}/...`, and make audit generation a first-class side effect of every meaningful write.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Firebase Auth, Firestore, Firebase Hosting, Vitest, React Testing Library, Playwright.

**Required execution discipline:** Apply @superpowers:test-driven-development, @superpowers:systematic-debugging, and @superpowers:verification-before-completion for every task.

---

### Task 1: Build Session and Runtime Mode Foundation

**Files:**
- Create: `opsboard/src/features/session/types.ts`
- Create: `opsboard/src/features/session/sessionStore.ts`
- Create: `opsboard/src/features/session/SessionProvider.tsx`
- Create: `opsboard/src/features/session/useSession.ts`
- Modify: `opsboard/src/app/layout.tsx`
- Modify: `opsboard/src/app/page.tsx`
- Modify: `opsboard/src/components/auth/DemoLogin.tsx`
- Test: `opsboard/src/features/session/SessionProvider.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "./SessionProvider";
import { useSession } from "./useSession";

function Probe() {
  const session = useSession();
  return <div>{session.mode}:{session.status}</div>;
}

test("defaults to signed-out demo-capable session state", () => {
  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>
  );

  expect(screen.getByText("demo:signed-out")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/session/SessionProvider.test.tsx`

Expected: FAIL with module not found or missing provider implementation.

**Step 3: Write minimal implementation**

```ts
// opsboard/src/features/session/types.ts
export type RuntimeMode = "demo" | "authenticated";
export type SessionStatus = "signed-out" | "loading" | "ready" | "error";

export type SessionState = {
  mode: RuntimeMode;
  status: SessionStatus;
  userId: string | null;
  error: string | null;
};
```

```tsx
// opsboard/src/features/session/SessionProvider.tsx
const initialState: SessionState = {
  mode: "demo",
  status: "signed-out",
  userId: null,
  error: null,
};
```

Add provider wiring to `src/app/layout.tsx` and make landing page buttons choose explicit `demo` or `authenticated` entry paths.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/session/SessionProvider.test.tsx src/components/auth/DemoLogin.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/session \
  opsboard/src/app/layout.tsx \
  opsboard/src/app/page.tsx \
  opsboard/src/components/auth/DemoLogin.tsx

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add session and runtime mode foundation"
```

---

### Task 2: Define Production Domain Models and Firestore Path Helpers

**Files:**
- Create: `opsboard/src/features/data/model.ts`
- Create: `opsboard/src/features/data/paths.ts`
- Create: `opsboard/src/features/data/timestamps.ts`
- Modify: `opsboard/src/lib/types.ts`
- Test: `opsboard/src/features/data/paths.test.ts`

**Step 1: Write the failing test**

```ts
import { userCollectionPath, userDocPath } from "./paths";

test("builds per-user collection paths", () => {
  expect(userDocPath("user-1")).toBe("users/user-1");
  expect(userCollectionPath("user-1", "incidents")).toBe("users/user-1/incidents");
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/data/paths.test.ts`

Expected: FAIL with missing paths module.

**Step 3: Write minimal implementation**

```ts
// opsboard/src/features/data/paths.ts
export type UserCollection =
  | "boards"
  | "incidents"
  | "services"
  | "auditLogs"
  | "snapshots";

export function userDocPath(userId: string) {
  return `users/${userId}`;
}

export function userCollectionPath(userId: string, collection: UserCollection) {
  return `${userDocPath(userId)}/${collection}`;
}

export function boardListsPath(userId: string, boardId: string) {
  return `${userCollectionPath(userId, "boards")}/${boardId}/lists`;
}

export function boardCardsPath(userId: string, boardId: string) {
  return `${userCollectionPath(userId, "boards")}/${boardId}/cards`;
}
```

Also define V2 production types in `model.ts` with shared `createdAt`, `updatedAt`, `createdBy`, and domain-specific fields for cards, incidents, services, audit logs, and snapshots.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/data/paths.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/data \
  opsboard/src/lib/types.ts

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add production data model and path helpers"
```

---

### Task 3: Create Firestore and Demo Repository Adapters

**Files:**
- Create: `opsboard/src/features/data/repositories/boardsRepository.ts`
- Create: `opsboard/src/features/data/repositories/incidentsRepository.ts`
- Create: `opsboard/src/features/data/repositories/servicesRepository.ts`
- Create: `opsboard/src/features/data/repositories/auditRepository.ts`
- Create: `opsboard/src/features/data/repositories/workspaceRepository.ts`
- Create: `opsboard/src/features/data/repositories/demoWorkspaceRepository.ts`
- Create: `opsboard/src/features/data/repositories/firestoreWorkspaceRepository.ts`
- Test: `opsboard/src/features/data/repositories/workspaceRepository.test.ts`

**Step 1: Write the failing test**

```ts
import { createDemoWorkspaceRepository } from "./demoWorkspaceRepository";

test("demo repository returns starter workspace data from local persistence", async () => {
  const repo = createDemoWorkspaceRepository();
  const workspace = await repo.getWorkspace("demo-user");

  expect(workspace.boards.length).toBeGreaterThan(0);
  expect(workspace.incidents.length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/data/repositories/workspaceRepository.test.ts`

Expected: FAIL with missing repository implementation.

**Step 3: Write minimal implementation**

```ts
export type WorkspaceRepository = {
  getWorkspace: (userId: string) => Promise<WorkspaceSnapshot>;
  createCard: (input: CreateCardInput) => Promise<CardRecord>;
  updateCard: (cardId: string, input: UpdateCardInput) => Promise<CardRecord>;
  createIncident: (input: CreateIncidentInput) => Promise<IncidentRecord>;
  updateIncident: (incidentId: string, input: UpdateIncidentInput) => Promise<IncidentRecord>;
  listAuditLogs: (userId: string) => Promise<AuditLogRecord[]>;
};
```

Demo adapter can wrap `buildSeedData()` and local storage. Firestore adapter should stay thin and only translate typed inputs to collection reads and writes.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/data/repositories/workspaceRepository.test.ts src/lib/seed.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add opsboard/src/features/data/repositories
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add workspace repository adapters"
```

---

### Task 4: Implement Idempotent Starter Workspace Bootstrap

**Files:**
- Create: `opsboard/src/features/workspace/bootstrapStarterWorkspace.ts`
- Create: `opsboard/src/features/workspace/starterWorkspace.ts`
- Modify: `opsboard/src/components/auth/SeedOnLogin.tsx`
- Modify: `opsboard/src/lib/seed.ts`
- Modify: `opsboard/src/lib/seedFirestore.ts`
- Test: `opsboard/src/features/workspace/bootstrapStarterWorkspace.test.ts`

**Step 1: Write the failing test**

```ts
import { bootstrapStarterWorkspace } from "./bootstrapStarterWorkspace";

test("bootstrapStarterWorkspace skips records that already exist", async () => {
  const writes: string[] = [];

  await bootstrapStarterWorkspace({
    userId: "user-1",
    hasExistingWorkspace: async () => true,
    writeRecord: async (path) => void writes.push(path),
  });

  expect(writes).toEqual([]);
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/workspace/bootstrapStarterWorkspace.test.ts`

Expected: FAIL with missing bootstrap module.

**Step 3: Write minimal implementation**

```ts
export async function bootstrapStarterWorkspace(deps: {
  userId: string;
  hasExistingWorkspace: () => Promise<boolean>;
  writeRecord: (path: string, data: Record<string, unknown>) => Promise<void>;
}) {
  if (await deps.hasExistingWorkspace()) {
    return { created: false };
  }

  const starter = buildStarterWorkspace(deps.userId);
  for (const item of starter) {
    await deps.writeRecord(item.path, item.data);
  }

  return { created: true };
}
```

Refactor `SeedOnLogin.tsx` so it bootstraps only authenticated user data and never touches top-level collections.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/workspace/bootstrapStarterWorkspace.test.ts src/lib/seedFirestore.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/workspace \
  opsboard/src/components/auth/SeedOnLogin.tsx \
  opsboard/src/lib/seed.ts \
  opsboard/src/lib/seedFirestore.ts

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add idempotent starter workspace bootstrap"
```

---

### Task 5: Add Google Sign-In and Authenticated App Gate

**Files:**
- Create: `opsboard/src/features/session/firebaseSession.ts`
- Create: `opsboard/src/components/auth/GoogleLoginButton.tsx`
- Create: `opsboard/src/components/auth/RequireWorkspace.tsx`
- Modify: `opsboard/src/lib/firebase.ts`
- Modify: `opsboard/src/app/page.tsx`
- Modify: `opsboard/src/app/(app)/layout.tsx`
- Modify: `opsboard/src/components/auth/DemoLogin.tsx`
- Test: `opsboard/src/components/auth/GoogleLoginButton.test.tsx`

**Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import GoogleLoginButton from "./GoogleLoginButton";

test("shows Google sign-in CTA", () => {
  render(<GoogleLoginButton />);
  fireEvent.click(screen.getByRole("button", { name: /Continue with Google/i }));
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/components/auth/GoogleLoginButton.test.tsx`

Expected: FAIL with missing component or missing provider integration.

**Step 3: Write minimal implementation**

```tsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

export default function GoogleLoginButton() {
  return (
    <button onClick={() => auth ? signInWithPopup(auth, provider) : Promise.resolve()}>
      Continue with Google
    </button>
  );
}
```

Then gate the `(app)` area so authenticated users see live workspace data and signed-out users are redirected to `/`.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/components/auth/GoogleLoginButton.test.tsx src/components/auth/DemoLogin.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/session/firebaseSession.ts \
  opsboard/src/components/auth/GoogleLoginButton.tsx \
  opsboard/src/components/auth/RequireWorkspace.tsx \
  opsboard/src/lib/firebase.ts \
  opsboard/src/app/page.tsx \
  'opsboard/src/app/(app)/layout.tsx' \
  opsboard/src/components/auth/DemoLogin.tsx

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add Google auth and authenticated app gate"
```

---

### Task 6: Wire Boards CRUD to Live Repository Data

**Files:**
- Create: `opsboard/src/features/boards/useBoardsViewModel.ts`
- Create: `opsboard/src/features/boards/boardCommands.ts`
- Modify: `opsboard/src/app/(app)/boards/page.tsx`
- Modify: `opsboard/src/components/boards/BoardView.tsx`
- Modify: `opsboard/src/components/boards/CardComposer.tsx`
- Modify: `opsboard/src/components/boards/BoardColumn.tsx`
- Test: `opsboard/src/components/boards/BoardView.test.tsx`

**Step 1: Write the failing test**

```tsx
test("adds a card through the live board view model", async () => {
  render(<BoardView title="Opsboard" lists={[{ id: "backlog", name: "Backlog" }]} cards={[]} />);

  fireEvent.click(screen.getByRole("button", { name: /New card/i }));
  fireEvent.change(screen.getByPlaceholderText(/Card title/i), {
    target: { value: "Ship starter workspace" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Add card/i }));

  expect(await screen.findByText("Ship starter workspace")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/components/boards/BoardView.test.tsx`

Expected: FAIL because the page still uses local-only state or missing repository wiring.

**Step 3: Write minimal implementation**

Create a view model that loads board state from the active repository and exposes:

```ts
type BoardsViewModel = {
  board: BoardRecord | null;
  lists: BoardListRecord[];
  cards: CardRecord[];
  isLoading: boolean;
  error: string | null;
  createCard: (input: CreateCardInput) => Promise<void>;
  moveCard: (cardId: string, listId: string) => Promise<void>;
};
```

Replace `useState(cards)` in `BoardView.tsx` with command handlers from that view model.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/components/boards/BoardView.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/boards \
  'opsboard/src/app/(app)/boards/page.tsx' \
  opsboard/src/components/boards/BoardView.tsx \
  opsboard/src/components/boards/CardComposer.tsx \
  opsboard/src/components/boards/BoardColumn.tsx

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: wire boards to live repository data"
```

---

### Task 7: Implement Incident Lifecycle and Automatic Audit Writes

**Files:**
- Create: `opsboard/src/features/incidents/incidentCommands.ts`
- Create: `opsboard/src/features/incidents/useIncidentsViewModel.ts`
- Create: `opsboard/src/features/audit/writeAuditEvent.ts`
- Modify: `opsboard/src/app/(app)/incidents/page.tsx`
- Modify: `opsboard/src/components/incidents/IncidentList.tsx`
- Modify: `opsboard/src/features/platform/audit/auditLogger.ts`
- Test: `opsboard/src/features/incidents/incidentCommands.test.ts`
- Test: `opsboard/src/components/incidents/IncidentList.test.tsx`

**Step 1: Write the failing test**

```ts
import { createIncident } from "./incidentCommands";

test("createIncident emits an audit event", async () => {
  const audit = vi.fn();
  const save = vi.fn(async (input) => ({ id: "inc-1", ...input }));

  await createIncident(
    { title: "API saturation", severity: "high" },
    { saveIncident: save, writeAudit: audit }
  );

  expect(audit).toHaveBeenCalledWith(
    expect.objectContaining({ action: "incident.created", entityType: "incident" })
  );
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/incidents/incidentCommands.test.ts`

Expected: FAIL with missing command module.

**Step 3: Write minimal implementation**

```ts
export async function createIncident(
  input: CreateIncidentInput,
  deps: {
    saveIncident: (input: CreateIncidentInput) => Promise<IncidentRecord>;
    writeAudit: (entry: AuditWriteInput) => Promise<void>;
  }
) {
  const incident = await deps.saveIncident(input);
  await deps.writeAudit({
    action: "incident.created",
    entityType: "incident",
    entityId: incident.id,
    details: `Created incident ${incident.title}`,
  });
  return incident;
}
```

Add resolve and link-card flows with the same pattern.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/incidents/incidentCommands.test.ts src/components/incidents/IncidentList.test.tsx src/features/platform/audit/auditLogger.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/incidents \
  opsboard/src/features/audit \
  'opsboard/src/app/(app)/incidents/page.tsx' \
  opsboard/src/components/incidents/IncidentList.tsx \
  opsboard/src/features/platform/audit/auditLogger.ts

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add incident lifecycle and audit integration"
```

---

### Task 8: Move Status, Analytics, and Operations to Live Derived Data

**Files:**
- Create: `opsboard/src/features/status/useServicesViewModel.ts`
- Create: `opsboard/src/features/analytics/buildWorkspaceMetrics.ts`
- Modify: `opsboard/src/app/(app)/status/page.tsx`
- Modify: `opsboard/src/app/(app)/analytics/page.tsx`
- Modify: `opsboard/src/app/(app)/operations/page.tsx`
- Modify: `opsboard/src/components/analytics/AnalyticsDashboard.tsx`
- Modify: `opsboard/src/components/operations/ReliabilityOpsPanel.tsx`
- Test: `opsboard/src/features/analytics/buildWorkspaceMetrics.test.ts`
- Test: `opsboard/src/components/operations/ReliabilityOpsPanel.test.tsx`

**Step 1: Write the failing test**

```ts
import { buildWorkspaceMetrics } from "./buildWorkspaceMetrics";

test("buildWorkspaceMetrics derives cards, incidents, and uptime from workspace state", () => {
  const metrics = buildWorkspaceMetrics({
    cards: [{ id: "c1" }, { id: "c2" }],
    incidents: [{ id: "i1", state: "open" }],
    services: [{ id: "svc-1", status: "operational" }],
  } as never);

  expect(metrics.totalCards).toBe(2);
  expect(metrics.openIncidents).toBe(1);
  expect(metrics.uptime).toMatch(/%/);
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/analytics/buildWorkspaceMetrics.test.ts`

Expected: FAIL with missing metric builder.

**Step 3: Write minimal implementation**

```ts
export function buildWorkspaceMetrics(snapshot: WorkspaceSnapshot) {
  const totalCards = snapshot.cards.length;
  const openIncidents = snapshot.incidents.filter((item) => item.state !== "resolved").length;
  const degraded = snapshot.services.filter((item) => item.status !== "operational").length;
  const uptime = `${Math.max(0, 100 - degraded * 5).toFixed(1)}%`;
  return { totalCards, openIncidents, uptime };
}
```

Then refactor status and operations pages to consume repository-backed data and persist recovery snapshots per user.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/analytics/buildWorkspaceMetrics.test.ts src/components/analytics/AnalyticsDashboard.test.tsx src/components/operations/ReliabilityOpsPanel.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/status \
  opsboard/src/features/analytics \
  'opsboard/src/app/(app)/status/page.tsx' \
  'opsboard/src/app/(app)/analytics/page.tsx' \
  'opsboard/src/app/(app)/operations/page.tsx' \
  opsboard/src/components/analytics/AnalyticsDashboard.tsx \
  opsboard/src/components/operations/ReliabilityOpsPanel.tsx

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: drive status analytics and operations from live data"
```

---

### Task 9: Upgrade Copilot to Deterministic Live Workspace Analysis

**Files:**
- Create: `opsboard/src/features/copilot/runDeterministicCopilot.ts`
- Modify: `opsboard/src/features/ai/agents/coordinator.ts`
- Modify: `opsboard/src/components/ai/AiPanel.tsx`
- Modify: `opsboard/src/app/(app)/ai/page.tsx`
- Test: `opsboard/src/features/copilot/runDeterministicCopilot.test.ts`
- Test: `opsboard/src/components/ai/AiPanel.test.tsx`

**Step 1: Write the failing test**

```ts
import { runDeterministicCopilot } from "./runDeterministicCopilot";

test("raises risk when high severity incidents and high priority cards overlap", () => {
  const report = runDeterministicCopilot({
    incidents: [{ id: "i1", severity: "high", state: "open" }],
    cards: [{ id: "c1", priority: "high" }],
    auditLogs: [],
    services: [],
  } as never);

  expect(report.risk.score).toBeGreaterThanOrEqual(70);
  expect(report.actionPlan.immediate.length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm test -- --run src/features/copilot/runDeterministicCopilot.test.ts`

Expected: FAIL with missing module.

**Step 3: Write minimal implementation**

```ts
export function runDeterministicCopilot(snapshot: WorkspaceSnapshot): IncidentWorkflowReport {
  const highIncidents = snapshot.incidents.filter((item) => item.severity === "high" && item.state !== "resolved");
  const highCards = snapshot.cards.filter((item) => item.priority === "high");
  const score = Math.min(100, highIncidents.length * 35 + highCards.length * 15);

  return {
    risk: {
      score,
      level: score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low",
    },
    summary: {
      headline: highIncidents[0]?.title ?? "Workspace stable",
      narrative: `Open incidents: ${snapshot.incidents.length}; high-priority cards: ${highCards.length}.`,
    },
    actionPlan: {
      immediate: highIncidents.length ? ["Triage affected services", "Assign incident owner"] : ["Review backlog"],
    },
    trace: [{ agent: "deterministic-copilot", durationMs: 1 }],
  };
}
```

Refactor the AI page to use live workspace state instead of `buildSeedData("demo")`.

**Step 4: Run test to verify it passes**

Run: `cd opsboard && npm test -- --run src/features/copilot/runDeterministicCopilot.test.ts src/components/ai/AiPanel.test.tsx src/features/ai/agents/coordinator.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/src/features/copilot \
  opsboard/src/features/ai/agents/coordinator.ts \
  opsboard/src/components/ai/AiPanel.tsx \
  'opsboard/src/app/(app)/ai/page.tsx'

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: add deterministic copilot over live workspace data"
```

---

### Task 10: Add Firestore Security Rules and Release-Grade Verification

**Files:**
- Create: `opsboard/firestore.rules`
- Create: `opsboard/firestore.indexes.json`
- Modify: `firebase.json`
- Modify: `opsboard/tests/e2e/demo.spec.ts`
- Create: `opsboard/tests/e2e/workspace.spec.ts`
- Modify: `opsboard/README.md`
- Modify: `README.md`

**Step 1: Write the failing E2E**

```ts
import { expect, test } from "@playwright/test";

test("demo mode can create a card and surface it in the board", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open demo workspace|Try demo account/i }).click();
  await page.getByRole("button", { name: /New card/i }).click();
  await page.getByPlaceholder("Card title").fill("Run portfolio smoke check");
  await page.getByRole("button", { name: /Add card/i }).click();
  await expect(page.getByText("Run portfolio smoke check")).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `cd opsboard && npm run test:e2e -- tests/e2e/workspace.spec.ts`

Expected: FAIL until live/demo repository paths and UI writes are fully wired.

**Step 3: Write minimal implementation**

Add Firestore rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Update `firebase.json` to include Firestore config and make README release steps explicit.

**Step 4: Run full verification**

Run:

```bash
cd opsboard
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

Expected:

- ESLint exits `0`
- Vitest exits `0`
- Playwright exits `0`
- Next build exits `0`

**Step 5: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add \
  opsboard/firestore.rules \
  opsboard/firestore.indexes.json \
  firebase.json \
  opsboard/tests/e2e \
  opsboard/README.md \
  README.md

git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: harden firestore security and release verification"
```

---

### Task 11: Final Review and Portfolio Polish

**Files:**
- Modify as needed from previous tasks only
- Review: `/home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan/docs/plans/2026-03-15-opsboard-production-mvp-design.md`
- Review: `/home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan/docs/plans/2026-03-15-opsboard-production-mvp.md`

**Step 1: Re-read the validated design**

Confirm the implementation still matches:

- single-user workspace
- Google sign-in + demo mode
- Firebase per-user persistence
- starter workspace bootstrap
- deterministic copilot

**Step 2: Run final verification commands**

Run:

```bash
cd /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan/opsboard
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

Expected: all commands exit `0`.

**Step 3: Review git diff**

Run:

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan status --short
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan diff --stat
```

Expected: only intended production MVP changes remain.

**Step 4: Commit**

```bash
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan add -A
git -C /home/pato/projects/learning/AbleToCompete/.worktrees/portfolio-v1-plan commit -m "feat: complete opsboard production mvp"
```
