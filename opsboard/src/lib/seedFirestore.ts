import { boardCardsPath, boardListsPath, userCollectionPath, userDocPath } from "@/features/data/paths";
import { createTimestampFields } from "@/features/data/timestamps";
import { buildSeedData } from "./seed";

export type SeedWrite = {
  path: string;
  data: Record<string, unknown>;
};

export function buildSeedWrites(userId: string): SeedWrite[] {
  const seed = buildSeedData(userId);
  const timestamps = createTimestampFields();
  const starterSource = { createdBy: userId, source: "starter" as const };

  return [
    {
      path: userDocPath(userId),
      data: {
        id: userId,
        createdAt: timestamps.createdAt,
        updatedAt: timestamps.updatedAt,
      },
    },
    ...seed.boards.flatMap((board) => [
      {
        path: `${userCollectionPath(userId, "boards")}/${board.id}`,
        data: {
          ...board,
          ...timestamps,
          ...starterSource,
        },
      },
      ...board.lists.map((list) => ({
        path: `${boardListsPath(userId, board.id)}/${list.id}`,
        data: {
          ...list,
          boardId: board.id,
          ...timestamps,
          ...starterSource,
        },
      })),
    ]),
    ...seed.cards.map((card) => ({
      path: `${boardCardsPath(userId, card.boardId)}/${card.id}`,
      data: {
        ...card,
        ...timestamps,
        ...starterSource,
      },
    })),
    ...seed.incidents.map((incident) => ({
      path: `${userCollectionPath(userId, "incidents")}/${incident.id}`,
      data: {
        ...incident,
        ...timestamps,
        ...starterSource,
      },
    })),
    ...seed.services.map((service) => ({
      path: `${userCollectionPath(userId, "services")}/${service.id}`,
      data: {
        ...service,
        ...timestamps,
        ...starterSource,
      },
    })),
    ...seed.auditLogs.map((log) => ({
      path: `${userCollectionPath(userId, "auditLogs")}/${log.id}`,
      data: {
        ...log,
        createdBy: userId,
        source: "starter" as const,
        updatedAt: log.createdAt,
      },
    })),
  ];
}
