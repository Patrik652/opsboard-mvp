import type { Card } from "@/lib/types";

type List = { id: string; name: string };

type BoardColumnProps = {
  list: List;
  cards: Card[];
};

export default function BoardColumn({ list, cards }: BoardColumnProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-3 text-sm uppercase tracking-wide text-zinc-400">{list.name}</div>
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="text-sm font-medium text-zinc-100">{card.title}</div>
            <div className="mt-2 text-xs text-zinc-500">Priority: {card.priority}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
