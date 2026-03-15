"use client";

import { useState } from "react";
import type { BoardList, Card } from "@/features/data/model";
import BoardColumn from "./BoardColumn";
import CardComposer from "./CardComposer";

type BoardViewProps = {
  title: string;
  lists: BoardList[];
  cards: Card[];
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string | null;
  onCreateCard?: (input: {
    title: string;
    listId: string;
    description?: string;
  }) => Promise<void>;
  onMoveCard?: (cardId: string, listId: string) => Promise<void>;
};

export default function BoardView({
  title,
  lists,
  cards,
  isLoading = false,
  isSaving = false,
  error = null,
  onCreateCard,
  onMoveCard,
}: BoardViewProps) {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <button
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          disabled={isLoading || !onCreateCard || lists.length === 0}
          type="button"
          onClick={() => setShowComposer(true)}
        >
          New card
        </button>
      </div>

      {showComposer ? (
        <CardComposer
          lists={lists}
          error={error}
          isSaving={isSaving}
          onAddCard={async ({ title: cardTitle, listId }) => {
            if (!onCreateCard) {
              return;
            }

            await onCreateCard({
              title: cardTitle,
              listId,
            });
            setShowComposer(false);
          }}
          onCancel={() => setShowComposer(false)}
        />
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading board workspace...
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {lists.map((list) => (
          <BoardColumn
            key={list.id}
            list={list}
            lists={lists}
            cards={cards.filter((card) => card.listId === list.id)}
            isSaving={isSaving}
            onMoveCard={onMoveCard}
          />
        ))}
      </div>
    </section>
  );
}
