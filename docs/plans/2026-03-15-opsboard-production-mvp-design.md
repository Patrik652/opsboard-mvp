# Opsboard Production MVP Design

**Date:** 2026-03-15
**Status:** Validated
**Product Direction:** Portfolio-grade production MVP

## Goal

Turn Opsboard from a seeded showcase into a real single-user operations workspace with:

- Google sign-in
- persistent per-user data in Firebase
- starter workspace bootstrap
- full board and incident workflows
- deterministic copilot over live data
- auditability, recovery snapshots, analytics, and deploy hardening

## Product Decisions

- Product shape: `single-user operational workspace`
- Core workflow: `ops board + incident response`
- Backend: `Firebase Auth + Firestore + Firebase Hosting`
- AI mode: `deterministic copilot`
- Auth mode: `Google sign-in + demo mode`
- First-login onboarding: `starter workspace`

## Modes and Boundaries

Opsboard must have two explicit runtime modes:

1. `demo`
   - no authenticated backend required
   - local browser persistence only
   - safe for instant portfolio walkthroughs
   - cannot write into production collections

2. `authenticated`
   - Google-authenticated Firebase user
   - data lives under that user’s Firestore namespace
   - starter workspace created once, idempotently
   - all reads and writes flow through repository/service boundaries

The app must never mix demo seed data with authenticated Firestore state in the same execution path.

## System Architecture

### UI Layer

- `opsboard/src/app`
  - route shells and page composition
- `opsboard/src/components`
  - presentational UI and interaction controls

### Application Layer

- `opsboard/src/features/session`
  - auth/session state
  - runtime mode selection
  - route gating
- `opsboard/src/features/workspace`
  - starter workspace bootstrap
  - workspace-level orchestration
- `opsboard/src/features/boards`
  - board/list/card commands and queries
- `opsboard/src/features/incidents`
  - incident lifecycle and card linking
- `opsboard/src/features/status`
  - service health state
- `opsboard/src/features/audit`
  - audit event creation and querying
- `opsboard/src/features/analytics`
  - derived metrics and summaries
- `opsboard/src/features/copilot`
  - deterministic scoring, summary, and action planning

### Data Access Layer

- `opsboard/src/features/data`
  - Firestore path helpers
  - converters
  - repository implementations
  - demo/local-storage adapters

No page or component should call Firestore or `buildSeedData()` directly.

## Firestore Model

Use per-user namespacing:

- `users/{userId}`
- `users/{userId}/boards/{boardId}`
- `users/{userId}/boards/{boardId}/lists/{listId}`
- `users/{userId}/boards/{boardId}/cards/{cardId}`
- `users/{userId}/incidents/{incidentId}`
- `users/{userId}/services/{serviceId}`
- `users/{userId}/auditLogs/{auditLogId}`
- `users/{userId}/snapshots/{snapshotId}`

Common fields:

- `id`
- `createdAt`
- `updatedAt`
- `createdBy`
- optional `archivedAt`
- optional `resolvedAt`
- optional `source`

Domain-specific requirements:

- cards: `title`, `description`, `priority`, `boardId`, `listId`, optional `linkedIncidentId`
- incidents: `title`, `summary`, `severity`, `state`, `impact`, `relatedCardIds`, `affectedServiceIds`
- services: `name`, `status`, `description`
- audit logs: `actor`, `action`, `entityType`, `entityId`, `details`, `metadata`
- snapshots: recovery payload built from live workspace state

## Starter Workspace Bootstrap

On first successful Google sign-in:

1. create `users/{userId}` profile if missing
2. check whether required workspace collections already contain starter records
3. if empty, create:
   - one board
   - three default lists
   - starter cards
   - starter incidents
   - starter services
   - initial audit entries
4. if partially created, finish missing records without duplicating existing ones

Bootstrap must be idempotent.

## Primary User Flows

### Boards

- create card
- edit card title, description, priority
- move card between lists
- archive card
- link card to incident

### Incidents

- create incident manually
- create incident from card
- update severity/state/summary
- resolve incident
- show linked cards and affected services

### Status

- view services and their current health
- manually update service status
- optionally update affected services when resolving/opening incidents

### Audit

- show ordered workspace history
- every meaningful write emits an audit event via the application layer

### Analytics

- derive metrics from live workspace data
- no seed-only calculations

### Copilot

- consume current incidents, high-priority cards, audit history, and service state
- output:
  - risk score
  - risk level
  - summary
  - immediate action list
  - execution trace

## Error Handling and UX Rules

Every write flow needs explicit UI states:

- `idle`
- `saving`
- `success`
- `error`

Requirements:

- preserve user input on error
- show concrete retryable message
- do not silently swallow Firestore or auth failures
- revalidate or update local view state immediately after a successful write

## Security Rules

Firestore rules must enforce:

- authenticated users can only read/write their own namespace
- path rule: `request.auth.uid == userId`
- demo mode performs no writes to production collections

## Testing Strategy

### Unit

- starter workspace bootstrap idempotency
- repository mapping and path helpers
- deterministic copilot scoring
- analytics derivations
- audit event generation

### Component

- auth landing flow
- boards CRUD interaction states
- incident create/resolve flow
- status updates
- operations snapshot creation

### E2E

- demo entry
- authenticated starter workspace boot path
- create/move/update card
- create/resolve incident
- audit visibility
- analytics refresh

## Delivery Standard

The project is only “done” when all of the following are true:

- `npm run lint`
- `npm test -- --run`
- `npm run test:e2e`
- `npm run build`
- Firebase rules and deploy config are committed
- README documents demo mode, Google auth, Firebase setup, and release steps

## Milestones

1. Session/auth foundation
2. Per-user Firestore model and repository layer
3. Starter workspace bootstrap
4. Demo/auth mode separation
5. Boards + incidents live CRUD
6. Status, audit, analytics, operations on live data
7. Deterministic copilot
8. Security rules, E2E, release polish
