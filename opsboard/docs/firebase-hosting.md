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
npm run build --prefix opsboard
firebase deploy --only hosting
```

This uses `opsboard/out` as the hosting public directory.
