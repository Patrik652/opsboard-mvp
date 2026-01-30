import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const signInAnonymously = vi.fn(() => Promise.resolve());
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  signInAnonymously: (...args: unknown[]) => signInAnonymously(...args),
}));

import DemoLogin from "./DemoLogin";

test("shows demo login button", () => {
  render(<DemoLogin />);
  expect(screen.getByText(/Try demo account/i)).toBeInTheDocument();
});

test("shows status when clicking demo login", async () => {
  render(<DemoLogin />);
  fireEvent.click(screen.getByRole("button", { name: /Try demo account/i }));
  expect(await screen.findByText(/Signing in/i)).toBeInTheDocument();
});

test("redirects to boards after sign in", async () => {
  render(<DemoLogin />);
  fireEvent.click(screen.getByRole("button", { name: /Try demo account/i }));
  await waitFor(() => expect(push).toHaveBeenCalledWith("/boards"));
});
