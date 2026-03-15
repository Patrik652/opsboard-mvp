import { createDemoWorkspaceRepository } from "./demoWorkspaceRepository";

test("demo repository returns starter workspace data from local persistence", async () => {
  const repository = createDemoWorkspaceRepository(null);
  const workspace = await repository.getWorkspace("demo-user");

  expect(workspace.userId).toBe("demo-user");
  expect(workspace.boards.length).toBeGreaterThan(0);
  expect(workspace.incidents.length).toBeGreaterThan(0);
  expect(workspace.services.length).toBeGreaterThan(0);
});

test("demo repository persists created cards between reads", async () => {
  const map = new Map<string, string>();
  const storage = {
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
    removeItem(key: string) {
      map.delete(key);
    },
  };

  const repository = createDemoWorkspaceRepository(storage);
  const initial = await repository.getWorkspace("demo-user");

  await repository.createCard({
    userId: "demo-user",
    boardId: initial.boards[0]!.id,
    listId: initial.boards[0]!.lists[0]!.id,
    title: "Persisted card",
  });

  const next = await repository.getWorkspace("demo-user");
  expect(next.cards.some((card) => card.title === "Persisted card")).toBe(true);
});
