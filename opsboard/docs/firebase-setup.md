# Firebase Setup

1) Firebase Console → Project Settings → Your apps → Web app
2) Copy the Firebase SDK snippet values
3) Create `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_ENABLE_ANON_AUTH=true
```

4) Enable Auth → Sign-in method → Anonymous
5) Enable Firestore → Start in production/test mode

Without `NEXT_PUBLIC_FIREBASE_ENABLE_ANON_AUTH=true`, the app opens in offline demo mode and does not call Firebase Auth.
Once configured, the **Try demo account** button will work and seed demo data.
