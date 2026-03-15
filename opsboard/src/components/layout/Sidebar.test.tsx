import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

test("shows navigation items", () => {
  render(<Sidebar />);
  expect(screen.getByText(/Boards/i)).toBeInTheDocument();
  expect(screen.getByText(/Operations/i)).toBeInTheDocument();
});

test("shows loading skeleton for navigation", () => {
  render(<Sidebar isLoading />);
  expect(screen.getByText(/Loading navigation/i)).toBeInTheDocument();
});

test("shows error banner when navigation fails", () => {
  render(<Sidebar errorMessage="Navigation unavailable" />);
  expect(screen.getByText(/Navigation unavailable/i)).toBeInTheDocument();
});
