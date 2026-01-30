export type Board = {
  id: string;
  name: string;
  lists: { id: string; name: string }[];
};

export type Card = {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  priority: "low" | "med" | "high";
};

export type Incident = {
  id: string;
  title: string;
  severity: "low" | "med" | "high";
  state: "open" | "monitoring" | "resolved";
};

export type AuditLog = {
  id: string;
  message: string;
  createdAt: number;
};
