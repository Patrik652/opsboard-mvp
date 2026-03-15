import type { BoardList, Card } from "@/features/data/model";

type BoardColumnProps = {
  list: BoardList;
  lists: BoardList[];
  cards: Card[];
  isSaving?: boolean;
  onMoveCard?: (cardId: string, listId: string) => Promise<void>;
};

export default function BoardColumn({
  list,
  lists,
  cards,
  isSaving = false,
  onMoveCard,
}: BoardColumnProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-3 text-sm uppercase tracking-wide text-zinc-400">{list.name}</div>
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="text-sm font-medium text-zinc-100">{card.title}</div>
            <div className="mt-2 text-xs text-zinc-500">Priority: {card.priority}</div>
            <div className="mt-3">
              <label className="sr-only" htmlFor={`${card.id}-list`}>
                Move {card.title}
              </label>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200"
                disabled={isSaving || !onMoveCard}
                id={`${card.id}-list`}
                value={card.listId}
                onChange={async (event) => {
                  const nextListId = event.target.value;
                  if (!onMoveCard || nextListId === card.listId) {
                    return;
                  }

                  await onMoveCard(card.id, nextListId);
                }}
              >
                {lists.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
