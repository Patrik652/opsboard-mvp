# Case study: a visual guardrail for AI-assisted UI

**One line:** I gave an app a safety net so that AI *and* humans can change the UI fast — and any unintended visual change is caught automatically before it ships, with no paid design tool required.

Reference implementation: the open-source **Opsboard** app. Merged work: [PR #1](https://github.com/Patrik652/opsboard-mvp/pull/1) · green CI: [run](https://github.com/Patrik652/opsboard-mvp/actions/runs/27822961402).

---

## The problem

Teams now edit UI with AI assistants (Cursor, Claude Code, Copilot). That's fast, but it's risky:

- **Visual drift.** An AI tweak to one component quietly shifts spacing, colour, or a font somewhere else. Nobody notices until a customer does.
- **Inconsistent design tokens.** The AI (and people) pick colours "by feel" — `zinc-900` here, `emerald-400` there — so the design system rots and the app slowly looks off-brand.
- **No safety net.** Unit tests check logic, not *appearance*. A button can be the wrong colour and every test still passes.

Most answers to this are "use Figma and a designer." That's a paid seat, a handoff, and a tool the AI can't drive.

## The solution

A guardrail built from three things the app already has — **code + semantic design tokens + automated visual checks** — so the running app *is* the source of truth and every change is verified.

1. **Semantic design tokens.** Colours and text styles become named roles (`bg-panel`, `text-accent`, `text-danger`, `text-text-muted`) instead of raw palette values. People and AI now reach for a role, not a random shade.
2. **Visual regression tests.** Automated screenshots of every screen, on desktop and mobile, compared pixel-for-pixel against an approved baseline. A real change is flagged instantly.
3. **Continuous Integration (CI).** On every proposed change, a robot runs the linter, the build, the visual checks, and the unit tests. If anything drifts, the change can't be merged green.

## The evidence

| What | Result |
|---|---|
| Screens under visual watch | **8 pages × 2 viewports = 16 automated visual checks** (desktop 1440×900 + mobile 390×844) |
| Design-token cleanup | **raw colour values cut from 225 → 4** (−98%); the rest now speak in named roles |
| Automated gate per change | **lint + build + visual regression + 39 unit tests**, enforced in CI |
| Proven on real infrastructure | validated on an actual **GitHub Actions** runner, not just a laptop |

A visual diff in action — the tool highlights exactly what moved, so a reviewer sees the change in seconds instead of hunting for it:

- before/after/diff, mobile: `docs/plans/assets/poc-2026-06-19/diff-mobile.png`
- before/after/diff, desktop: `docs/plans/assets/poc-2026-06-19/diff-desktop.png`
- the approved baselines that every change is checked against: `tests/visual/__screenshots__/` (16 images)
- how it's wired: `docs/design-guardrail.md` (runbook) · `.github/workflows/opsboard-design-guardrail.yml`

## Why it matters to you

- **Safer AI-assisted iteration.** Let AI move fast on the UI; the guardrail catches what it breaks.
- **Regressions are visible *before* merge,** not after a customer reports them.
- **No paid Figma seat or design handoff required** to keep the UI consistent — the system lives in your codebase.
- **It's a foundation, not a ceiling.** A visual design canvas (Figma/Pencil) can be added later if you want one — but you get the safety benefit immediately, without it.

## Honest caveats

- **CI is the source of truth for the baselines.** Screenshot rendering differs slightly between machines, so approved images are generated on the CI runner. Local runs are for fast feedback; CI is authoritative.
- **A real redesign is a deliberate step.** When you *intend* to change how something looks, you approve the new baseline on purpose (a one-line review action). The guardrail never silently hides a change — and the sensitivity threshold is never loosened to make a diff "go away."

---

## 3-minute demo script

**Goal:** show that an unintended UI change is caught automatically. Don't explain the token migration in depth — show the *catch*.

1. **(30s) The baselines.** Open `tests/visual/__screenshots__/` — "these 16 approved screenshots are what the app is supposed to look like, desktop and mobile, for every page."
2. **(45s) Break something on purpose.** In the editor, change one heading's text or colour (mimic an AI edit). "Pretend an assistant did this and didn't tell us."
3. **(45s) The guardrail catches it.** Run `npm run verify:visual` (or show the CI check on the pull request). It fails on exactly the changed screen and prints/links the diff image. "Red. It tells us *which* screen and *what* moved."
4. **(30s) The diff image.** Open the diff PNG — the changed pixels are highlighted. "A reviewer sees it in seconds."
5. **(30s) The green path.** Revert (or approve the new baseline intentionally) → CI goes green → "now it can merge. Nothing ships without passing this."

**Show first:** the failing CI check on the PR (most convincing — it's the robot, not me).
**Proves it:** the red `verify:visual` step + the diff image artifact.
**Don't overexplain:** the token taxonomy, the font self-hosting, the container pinning — those are *how*, the buyer cares about the *catch*.

---

## Outreach snippets

> Honesty guardrails: this is a reference implementation on an open-source demo app. It is **not** deployed for a client and has **no** paying users yet. Do not claim otherwise.

**Upwork proposal paragraph**

> Teams shipping UI with AI assistants get speed but lose control of how the product looks — small visual regressions and inconsistent styling slip through because tests check logic, not appearance. I build a lightweight "visual guardrail": your design values become named tokens, and an automated check screenshots every screen (desktop + mobile) on each change and flags any unintended visual difference before it merges — enforced in your CI. On a reference build I put 8 screens under 16 automated visual checks, cut raw colour usage by ~98% into named roles, and validated the whole gate on a real CI runner. No paid design-tool seat required. I can set this up on your codebase and hand you a short runbook so your team (and your AI tools) can keep moving fast safely.

**LinkedIn DM paragraph**

> Quick one — are you using AI tools to build/iterate your UI? They're fast but they cause silent visual drift (a colour or spacing shifts and no test catches it). I set up "visual guardrails": automated screenshot checks of every screen on each change, plus a semantic token system so styling stays consistent — all in your CI, no Figma seat needed. Just finished a reference build (16 automated visual checks across 8 screens, ~98% less raw colour drift, validated on real CI). Happy to show a 3-minute walkthrough of it catching a regression if it's useful.
