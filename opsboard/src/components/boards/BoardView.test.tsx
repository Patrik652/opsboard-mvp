import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import BoardView from "./BoardView";

const lists = [
  { id: "l1", name: "Backlog" },
  { id: "l2", name: "Done" },
];

const cards = [{ id: "c1", boardId: "b1", listId: "l1", title: "Task", priority: "low" }];

function BoardHarness() {
  const [localCards, setLocalCards] = useState(cards);

  return (
    <BoardView
      title="Opsboard"
      lists={lists}
      cards={localCards}
      onCreateCard={async ({ title, listId }) => {
        setLocalCards((current) => [
          {
            id: "c2",
            boardId: "b1",
            listId,
            title,
            priority: "med",
          },
          ...current,
        ]);
      }}
      onMoveCard={async (cardId, listId) => {
        setLocalCards((current) =>
          current.map((card) => (card.id === cardId ? { ...card, listId } : card))
        );
      }}
    />
  );
}

test("renders board title", () => {
  render(<BoardView title="Opsboard" lists={[]} cards={[]} />);
  expect(screen.getByText("Opsboard")).toBeInTheDocument();
});

test("shows create card input when clicking New card", () => {
  render(
    <BoardView
      title="Opsboard"
      lists={lists}
      cards={cards}
      onCreateCard={async () => {}}
      onMoveCard={async () => {}}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: /New card/i }));
  expect(screen.getByPlaceholderText(/Card title/i)).toBeInTheDocument();
});

test("adds a card through the provided board command", async () => {
  render(<BoardHarness />);

  fireEvent.click(screen.getByRole("button", { name: /New card/i }));
  fireEvent.change(screen.getByPlaceholderText(/Card title/i), {
    target: { value: "Ship starter workspace" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Add card/i }));

  expect(await screen.findByText("Ship starter workspace")).toBeInTheDocument();
});
