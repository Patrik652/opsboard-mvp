import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const { push, enterDemoMode } = vi.hoisted(() => ({
  push: vi.fn(),
  enterDemoMode: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/session/useSession", () => ({
  useSession: () => ({
    enterDemoMode,
  }),
}));

import DemoLogin from "./DemoLogin";

beforeEach(() => {
  push.mockReset();
  enterDemoMode.mockReset();
});

test("shows demo login button", () => {
  render(<DemoLogin />);
  expect(screen.getByText(/Open demo workspace/i)).toBeInTheDocument();
});

test("shows status when clicking demo login", async () => {
  render(<DemoLogin />);
  fireEvent.click(screen.getByRole("button", { name: /Open demo workspace/i }));
  expect(await screen.findByText(/Opening demo workspace/i)).toBeInTheDocument();
});

test("redirects to boards after opening demo workspace", async () => {
  render(<DemoLogin />);
  fireEvent.click(screen.getByRole("button", { name: /Open demo workspace/i }));
  await waitFor(() => expect(push).toHaveBeenCalledWith("/boards"));
  expect(enterDemoMode).toHaveBeenCalled();
});
