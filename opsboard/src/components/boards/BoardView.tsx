"use client";

import { useState } from "react";
import BoardColumn from "./BoardColumn";
import CardComposer from "./CardComposer";
import type { Card } from "@/lib/types";
import { pageTitleClassName } from "@/lib/uiClassNames";

type List = { id: string; name: string };

type BoardViewProps = {
  title: string;
  lists: List[];
  cards: Card[];
};

export default function BoardView({ title, lists, cards }: BoardViewProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [localCards, setLocalCards] = useState<Card[]>(cards);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={pageTitleClassName}>{title}</h1>
        <button
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          type="button"
          onClick={() => setShowComposer(true)}
        >
          New card
        </button>
      </div>

      {showComposer ? (
        <CardComposer
          lists={lists}
          onAddCard={({ title: cardTitle, listId }) => {
            const newCard: Card = {
              id: `local-${Date.now()}`,
              boardId: "local",
              listId,
              title: cardTitle,
              priority: "med",
            };
            setLocalCards((prev) => [newCard, ...prev]);
            setShowComposer(false);
          }}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {lists.map((list) => (
          <BoardColumn
            key={list.id}
            list={list}
            cards={localCards.filter((card) => card.listId === list.id)}
          />
        ))}
      </div>
    </section>
  );
}
