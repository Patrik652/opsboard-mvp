"use client";

import { useContext } from "react";
import { SessionContext } from "./sessionStore";

export function useSession() {
  return useContext(SessionContext);
}
