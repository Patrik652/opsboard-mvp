import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const { signInAnonymously, push, firebaseModule } = vi.hoisted(() => ({
  signInAnonymously: vi.fn(() => Promise.resolve()),
  push: vi.fn(),
  firebaseModule: {
    auth: {},
    isAnonymousAuthEnabled: true,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/firebase", () => ({
  get auth() {
    return firebaseModule.auth;
  },
  get isAnonymousAuthEnabled() {
    return firebaseModule.isAnonymousAuthEnabled;
  },
}));

vi.mock("firebase/auth", () => ({
  signInAnonymously: (...args: unknown[]) => signInAnonymously(...args),
}));

import DemoLogin from "./DemoLogin";

beforeEach(() => {
  firebaseModule.isAnonymousAuthEnabled = true;
  signInAnonymously.mockReset();
  signInAnonymously.mockResolvedValue(undefined);
  push.mockReset();
});

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

test("falls back to offline workspace when firebase sign-in fails", async () => {
  signInAnonymously.mockRejectedValueOnce(new Error("operation-not-allowed"));
  render(<DemoLogin />);

  fireEvent.click(screen.getByRole("button", { name: /Try demo account/i }));

  await waitFor(() => expect(push).toHaveBeenCalledWith("/boards"));
  expect(await screen.findByText(/offline demo mode/i)).toBeInTheDocument();
});

test("skips firebase auth request when anonymous auth is disabled", async () => {
  firebaseModule.isAnonymousAuthEnabled = false;
  render(<DemoLogin />);

  fireEvent.click(screen.getByRole("button", { name: /open demo workspace/i }));

  await waitFor(() => expect(push).toHaveBeenCalledWith("/boards"));
  expect(signInAnonymously).not.toHaveBeenCalled();
});
