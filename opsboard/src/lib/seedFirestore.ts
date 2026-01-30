import { buildSeedData } from "./seed";

export type SeedWrite = {
  collection: "boards" | "cards" | "incidents" | "auditLogs";
  id: string;
  data: Record<string, unknown>;
};

export function shouldSeed(counts: { boards: number; incidents: number }) {
  return counts.boards === 0 && counts.incidents === 0;
}

export function buildSeedWrites(userId: string): SeedWrite[] {
  const seed = buildSeedData(userId);
  const timestamp = Date.now();

  return [
    ...seed.boards.map((board) => ({
      collection: "boards" as const,
      id: board.id,
      data: { ...board, userId, createdAt: timestamp, updatedAt: timestamp },
    })),
    ...seed.cards.map((card) => ({
      collection: "cards" as const,
      id: card.id,
      data: { ...card, userId, createdAt: timestamp, updatedAt: timestamp },
    })),
    ...seed.incidents.map((incident) => ({
      collection: "incidents" as const,
      id: incident.id,
      data: { ...incident, userId, createdAt: timestamp, updatedAt: timestamp },
    })),
    ...seed.auditLogs.map((log) => ({
      collection: "auditLogs" as const,
      id: log.id,
      data: { ...log, userId, createdAt: log.createdAt ?? timestamp },
    })),
  ];
}
