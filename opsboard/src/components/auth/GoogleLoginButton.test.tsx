import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const { push, signInWithPopup, beginAuthenticatedFlow, setAuthenticatedSession, setSessionError } =
  vi.hoisted(() => ({
    push: vi.fn(),
    signInWithPopup: vi.fn(() => Promise.resolve({ user: { uid: "google-user" } })),
    beginAuthenticatedFlow: vi.fn(),
    setAuthenticatedSession: vi.fn(),
    setSessionError: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class GoogleAuthProvider {},
  signInWithPopup: (...args: unknown[]) => signInWithPopup(...args),
}));

vi.mock("@/features/session/useSession", () => ({
  useSession: () => ({
    beginAuthenticatedFlow,
    setAuthenticatedSession,
    setSessionError,
  }),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
  isGoogleAuthEnabled: true,
}));

import GoogleLoginButton from "./GoogleLoginButton";

beforeEach(() => {
  push.mockReset();
  signInWithPopup.mockReset();
  signInWithPopup.mockResolvedValue({ user: { uid: "google-user" } });
  beginAuthenticatedFlow.mockReset();
  setAuthenticatedSession.mockReset();
  setSessionError.mockReset();
});

test("shows Google sign-in CTA and starts popup login", async () => {
  render(<GoogleLoginButton />);

  fireEvent.click(screen.getByRole("button", { name: /Continue with Google/i }));

  expect(beginAuthenticatedFlow).toHaveBeenCalled();
  await waitFor(() => expect(signInWithPopup).toHaveBeenCalled());
  await waitFor(() => expect(push).toHaveBeenCalledWith("/boards"));
});
