import type { Card } from "@/lib/types";

type List = { id: string; name: string };

type BoardViewProps = {
  title: string;
  lists: List[];
  cards: Card[];
};

export default function BoardView({ title, lists, cards }: BoardViewProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200">
          New card
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {lists.map((list) => (
          <div key={list.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="mb-3 text-sm uppercase tracking-wide text-zinc-400">
              {list.name}
            </div>
            <div className="space-y-3">
              {cards
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
