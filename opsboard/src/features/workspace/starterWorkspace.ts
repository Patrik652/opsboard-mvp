import { buildSeedWrites } from "@/lib/seedFirestore";

export function buildStarterWorkspace(userId: string) {
  return buildSeedWrites(userId);
}
