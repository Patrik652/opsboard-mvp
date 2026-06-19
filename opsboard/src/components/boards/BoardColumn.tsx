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
    <div className="rounded-xl border border-border bg-panel/60 p-4">
      <div className="mb-3 text-sm uppercase tracking-wide text-text-muted">{list.name}</div>
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg border border-border bg-panel-muted p-3">
            <div className="text-sm font-medium text-text-primary">{card.title}</div>
            <div className="mt-2 text-xs text-text-subtle">Priority: {card.priority}</div>
            <div className="mt-3">
              <label className="sr-only" htmlFor={`${card.id}-list`}>
                Move {card.title}
              </label>
              <select
                className="w-full rounded-lg border border-border-strong bg-panel px-3 py-2 text-xs text-text-body"
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
