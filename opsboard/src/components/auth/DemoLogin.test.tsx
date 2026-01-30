import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  signInAnonymously: vi.fn(),
}));

import DemoLogin from "./DemoLogin";

test("shows demo login button", () => {
  render(<DemoLogin />);
  expect(screen.getByText(/Try demo account/i)).toBeInTheDocument();
});
