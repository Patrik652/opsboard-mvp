export type UserCollection = "boards" | "incidents" | "services" | "auditLogs" | "snapshots";

export function userDocPath(userId: string): string {
  return `users/${userId}`;
}

export function userCollectionPath(userId: string, collection: UserCollection): string {
  return `${userDocPath(userId)}/${collection}`;
}

export function boardListsPath(userId: string, boardId: string): string {
  return `${userCollectionPath(userId, "boards")}/${boardId}/lists`;
}

export function boardCardsPath(userId: string, boardId: string): string {
  return `${userCollectionPath(userId, "boards")}/${boardId}/cards`;
}
