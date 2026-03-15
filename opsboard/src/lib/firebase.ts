import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getFirebaseClientConfig,
  isAnonymousAuthEnabled as readAnonymousAuthEnabled,
  isFirebaseConfigured as readIsFirebaseConfigured,
} from "./runtimeConfig";

const firebaseConfig = getFirebaseClientConfig();

export const isFirebaseConfigured = readIsFirebaseConfigured(firebaseConfig);
export const isAnonymousAuthEnabled = readAnonymousAuthEnabled();

const app = isFirebaseConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
