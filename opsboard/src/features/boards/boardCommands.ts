import type { Card, Priority } from "@/features/data/model";
import type { WorkspaceRepository } from "@/features/data/repositories/workspaceRepository";

type CreateBoardCardCommandInput = {
  userId: string;
  boardId: string;
  listId: string;
  title: string;
  description?: string;
  priority?: Priority;
};

type MoveBoardCardCommandInput = {
  userId: string;
  boardId: string;
  cardId: string;
  listId: string;
};

export async function createBoardCard(
  input: CreateBoardCardCommandInput,
  dependencies: {
    repository: WorkspaceRepository;
  }
): Promise<Card> {
  return dependencies.repository.createCard(input);
}

export async function moveBoardCard(
  input: MoveBoardCardCommandInput,
  dependencies: {
    repository: WorkspaceRepository;
  }
): Promise<Card> {
  return dependencies.repository.updateCard(input.userId, input.boardId, input.cardId, {
    listId: input.listId,
  });
}
