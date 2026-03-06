# Firebase Hosting Deploy (Opsboard)

This repo is configured for Firebase Hosting with static export.

## One-time setup

```bash
npm install -g firebase-tools
firebase login
```

## Build + Deploy

Run these from repo root:

```bash
npm run deploy:firebase --prefix opsboard
```

This command performs:
1) Next.js static build
2) Static export integrity check (`out/*` critical pages exist)
3) `firebase deploy --only hosting`

Current production demo URL:

`https://opsboard-mvp-live.web.app`

## Demo Availability Smoke Check

After deploy:

```bash
npm run smoke:demo --prefix opsboard
```

The command fails if the live URL returns Firebase placeholder content such as "Site Not Found".
