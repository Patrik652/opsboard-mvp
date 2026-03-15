import {
  boardCardsPath,
  boardListsPath,
  userCollectionPath,
  userDocPath,
} from "./paths";

test("builds per-user Firestore paths", () => {
  expect(userDocPath("user-1")).toBe("users/user-1");
  expect(userCollectionPath("user-1", "incidents")).toBe("users/user-1/incidents");
  expect(boardListsPath("user-1", "board-1")).toBe("users/user-1/boards/board-1/lists");
  expect(boardCardsPath("user-1", "board-1")).toBe("users/user-1/boards/board-1/cards");
});
