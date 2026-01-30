import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

test("shows navigation items", () => {
  render(<Sidebar />);
  expect(screen.getByText(/Boards/i)).toBeInTheDocument();
});
