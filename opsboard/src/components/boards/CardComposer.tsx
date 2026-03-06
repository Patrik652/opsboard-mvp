"use client";

import { useState } from "react";

type List = { id: string; name: string };

type CardComposerProps = {
  lists: List[];
  onAddCard: (input: { title: string; listId: string }) => void;
};

export default function CardComposer({ lists, onAddCard }: CardComposerProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftListId, setDraftListId] = useState(lists[0]?.id ?? "");

  return (
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
          {lists.map((list) => (
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
            onAddCard({ title: draftTitle.trim(), listId: draftListId });
            setDraftTitle("");
          }}
        >
          Add card
        </button>
      </div>
    </div>
  );
}
