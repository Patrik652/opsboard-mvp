import BoardView from "@/components/boards/BoardView";
import { buildSeedData } from "@/lib/seed";

export default function BoardsPage() {
  const seed = buildSeedData("demo");
  const board = seed.boards[0];

  return (
    <BoardView title={board.name} lists={board.lists} cards={seed.cards} />
  );
}
