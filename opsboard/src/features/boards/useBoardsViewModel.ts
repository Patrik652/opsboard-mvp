"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";
import type { Board, BoardList, Card, Priority } from "@/features/data/model";
import {
  resolveWorkspaceRepository,
  resolveWorkspaceUserId,
} from "@/features/data/repositories/runtimeWorkspaceRepository";
import { useSession } from "@/features/session/useSession";
import { createBoardCard, moveBoardCard } from "./boardCommands";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load board workspace.";
}

export type CreateBoardCardInput = {
  title: string;
  listId: string;
  description?: string;
  priority?: Priority;
};

export type BoardsViewModel = {
  board: Board | null;
  lists: BoardList[];
  cards: Card[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  createCard: (input: CreateBoardCardInput) => Promise<void>;
  moveCard: (cardId: string, listId: string) => Promise<void>;
};

export function useBoardsViewModel(): BoardsViewModel {
  const { mode, status, userId } = useSession();
  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workspaceUserId = resolveWorkspaceUserId(mode, userId);

  const loadWorkspace = useEffectEvent(async () => {
    if (!workspaceUserId) {
      startTransition(() => {
        setBoard(null);
        setCards([]);
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const workspace = await repository.getWorkspace(workspaceUserId);
      const nextBoard = workspace.boards[0] ?? null;

      startTransition(() => {
        setBoard(nextBoard);
        setCards(nextBoard ? workspace.cards.filter((card) => card.boardId === nextBoard.id) : []);
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (mode === "authenticated" && status !== "ready") {
      return;
    }

    void loadWorkspace();
  }, [mode, status, workspaceUserId]);

  const createCard = async (input: CreateBoardCardInput) => {
    if (!workspaceUserId || !board) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const nextCard = await createBoardCard(
        {
          userId: workspaceUserId,
          boardId: board.id,
          listId: input.listId,
          title: input.title,
          description: input.description,
          priority: input.priority,
        },
        { repository }
      );

      startTransition(() => {
        setCards((current) => [nextCard, ...current]);
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  const moveCard = async (cardId: string, listId: string) => {
    if (!workspaceUserId || !board) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const nextCard = await moveBoardCard(
        {
          userId: workspaceUserId,
          boardId: board.id,
          cardId,
          listId,
        },
        { repository }
      );

      startTransition(() => {
        setCards((current) =>
          current.map((card) => (card.id === cardId ? nextCard : card))
        );
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    board,
    lists: board?.lists ?? [],
    cards,
    isLoading,
    isSaving,
    error,
    createCard,
    moveCard,
  };
}
