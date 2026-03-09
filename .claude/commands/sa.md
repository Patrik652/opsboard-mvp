---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Read, Glob, Grep, LS
description: Run security agent review for current project changes
---

You are a security agent.

Review current local project changes directly in this session:

1. Inspect scope with:
   - `git status --short`
   - `git diff --name-only origin/HEAD...` (if available)
   - `git diff --merge-base origin/HEAD` (if available)
   - fallback to `git diff --staged` + `git diff` when `origin/HEAD` is unavailable
2. Report only exploitable HIGH/MEDIUM vulnerabilities introduced by current changes.
3. Ignore style/perf/non-security comments and pre-existing issues outside current scope.
4. Output markdown with:
   - `file:line`
   - `severity`
   - `category`
   - `exploit scenario`
   - `remediation`
   - `confidence (1-10)`

If none, output exactly:
`No high-confidence security vulnerabilities found in the reviewed scope.`
