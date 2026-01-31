"use client";

import { useMemo, useState } from "react";
import type { Card } from "@/lib/types";

type List = { id: string; name: string };

type BoardViewProps = {
  title: string;
  lists: List[];
  cards: Card[];
};

export default function BoardView({ title, lists, cards }: BoardViewProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftListId, setDraftListId] = useState(lists[0]?.id ?? "");
  const [localCards, setLocalCards] = useState<Card[]>(cards);

  const resolvedLists = useMemo(() => lists, [lists]);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <button
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          type="button"
          onClick={() => {
            setShowComposer(true);
            if (!draftListId && lists[0]?.id) {
              setDraftListId(lists[0].id);
            }
          }}
        >
          New card
        </button>
      </div>

      {showComposer ? (
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-zinc-400">New card</div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              placeholder="Card title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <select
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              value={draftListId}
              onChange={(event) => setDraftListId(event.target.value)}
            >
              {resolvedLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <button
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900"
              type="button"
              onClick={() => {
                if (!draftTitle.trim() || !draftListId) return;
                const newCard: Card = {
                  id: `local-${Date.now()}`,
                  boardId: "local",
                  listId: draftListId,
                  title: draftTitle.trim(),
                  priority: "med",
                };
                setLocalCards((prev) => [newCard, ...prev]);
                setDraftTitle("");
                setShowComposer(false);
              }}
            >
              Add card
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {resolvedLists.map((list) => (
          <div key={list.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="mb-3 text-sm uppercase tracking-wide text-zinc-400">
              {list.name}
            </div>
            <div className="space-y-3">
              {localCards
                .filter((card) => card.listId === list.id)
                .map((card) => (
                  <div key={card.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-sm font-medium text-zinc-100">{card.title}</div>
                    <div className="mt-2 text-xs text-zinc-500">Priority: {card.priority}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
