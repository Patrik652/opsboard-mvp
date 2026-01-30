import { render, screen } from "@testing-library/react";
import BoardView from "./BoardView";

test("renders board title", () => {
  render(<BoardView title="Opsboard" lists={[]} cards={[]} />);
  expect(screen.getByText("Opsboard")).toBeInTheDocument();
});
