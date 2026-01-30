"use client";

import { useEffect } from "react";
import { collection, doc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { buildSeedWrites, shouldSeed } from "@/lib/seedFirestore";

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

      const boardsSnap = await getDocs(
        query(collection(firestore, "boards"), limit(1))
      );
      const incidentsSnap = await getDocs(
        query(collection(firestore, "incidents"), limit(1))
      );

      if (!shouldSeed({ boards: boardsSnap.size, incidents: incidentsSnap.size })) {
        return;
      }

      const writes = buildSeedWrites(user.uid);
      await Promise.all(
        writes.map((write) =>
          setDoc(doc(collection(firestore, write.collection), write.id), write.data)
        )
      );
    });

    return () => unsubscribe();
  }, []);

  return null;
}
