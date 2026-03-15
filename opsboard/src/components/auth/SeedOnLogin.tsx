"use client";

import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { bootstrapStarterWorkspace } from "@/features/workspace/bootstrapStarterWorkspace";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

export default function SeedOnLogin() {
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      return;
    }

    const firestore = db;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      await bootstrapStarterWorkspace({
        userId: user.uid,
        hasExistingWorkspace: async () => false,
        hasRecord: async (path) => {
          const existing = await getDoc(doc(firestore, path));
          return existing.exists();
        },
        writeRecord: async (path, data) => {
          await setDoc(doc(firestore, path), data);
        },
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
