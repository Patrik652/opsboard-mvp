import { fireEvent, render, screen } from "@testing-library/react";
import BoardView from "./BoardView";

const lists = [
  { id: "l1", name: "Backlog" },
  { id: "l2", name: "Done" },
];

const cards = [{ id: "c1", boardId: "b1", listId: "l1", title: "Task", priority: "low" }];

test("renders board title", () => {
  render(<BoardView title="Opsboard" lists={[]} cards={[]} />);
  expect(screen.getByText("Opsboard")).toBeInTheDocument();
});

test("shows create card input when clicking New card", () => {
  render(<BoardView title="Opsboard" lists={lists} cards={cards} />);
  fireEvent.click(screen.getByRole("button", { name: /New card/i }));
  expect(screen.getByPlaceholderText(/Card title/i)).toBeInTheDocument();
});
