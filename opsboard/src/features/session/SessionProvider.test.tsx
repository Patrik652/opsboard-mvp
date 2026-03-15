import { render, screen } from "@testing-library/react";
import { SessionProvider } from "./SessionProvider";
import { useSession } from "./useSession";

function Probe() {
  const session = useSession();
  return <div>{session.mode}:{session.status}</div>;
}

test("defaults to signed-out demo-capable session state", () => {
  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>
  );

  expect(screen.getByText("demo:signed-out")).toBeInTheDocument();
});
