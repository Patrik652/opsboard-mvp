"use client";

import { useState } from "react";
import type { BoardList } from "@/features/data/model";

type CardComposerProps = {
  lists: BoardList[];
  isSaving?: boolean;
  error?: string | null;
  onAddCard: (input: { title: string; listId: string }) => Promise<void> | void;
  onCancel?: () => void;
};

export default function CardComposer({
  lists,
  isSaving = false,
  error = null,
  onAddCard,
  onCancel,
}: CardComposerProps) {
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
          disabled={isSaving || !draftTitle.trim() || !draftListId}
          type="button"
          onClick={async () => {
            if (!draftTitle.trim() || !draftListId) return;
            await onAddCard({ title: draftTitle.trim(), listId: draftListId });
            setDraftTitle("");
            setDraftListId(lists[0]?.id ?? "");
          }}
        >
          {isSaving ? "Saving..." : "Add card"}
        </button>
        {onCancel ? (
          <button
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
            disabled={isSaving}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <div className="mt-3 text-xs text-rose-300">{error}</div> : null}
    </div>
  );
}
