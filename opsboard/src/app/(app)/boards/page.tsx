"use client";

import BoardView from "@/components/boards/BoardView";
import { useBoardsViewModel } from "@/features/boards/useBoardsViewModel";

export default function BoardsPage() {
  const { board, lists, cards, isLoading, isSaving, error, createCard, moveCard } =
    useBoardsViewModel();

  return (
    <BoardView
      title={board?.name ?? "Boards"}
      lists={lists}
      cards={cards}
      isLoading={isLoading}
      isSaving={isSaving}
      error={error}
      onCreateCard={createCard}
      onMoveCard={moveCard}
    />
  );
}
