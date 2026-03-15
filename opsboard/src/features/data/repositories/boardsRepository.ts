import type { Board, Card, Priority } from "../model";

export type CreateCardInput = {
  userId: string;
  boardId: string;
  listId: string;
  title: string;
  description?: string;
  priority?: Priority;
};

export type UpdateCardInput = Partial<
  Pick<Card, "title" | "description" | "priority" | "listId" | "linkedIncidentId" | "archivedAt">
>;

export type BoardsRepository = {
  listBoards: (userId: string) => Promise<Board[]>;
  listCards: (userId: string, boardId?: string) => Promise<Card[]>;
  createCard: (input: CreateCardInput) => Promise<Card>;
  updateCard: (userId: string, boardId: string, cardId: string, input: UpdateCardInput) => Promise<Card>;
};
