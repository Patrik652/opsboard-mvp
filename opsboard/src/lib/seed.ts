import { AuditLog, Board, Card, Incident } from "./types";

const DEMO_AUDIT_CREATED_AT = Date.UTC(2026, 2, 1, 9, 0, 0);

export function buildSeedData(userId: string) {
  const boards: Board[] = [
    {
      id: "b1",
      name: "Opsboard",
      lists: [
        { id: "l1", name: "Backlog" },
        { id: "l2", name: "In Progress" },
        { id: "l3", name: "Done" },
      ],
    },
  ];

  const cards: Card[] = [
    {
      id: "c1",
      boardId: "b1",
      listId: "l1",
      title: "Prepare incident drill",
      priority: "high",
    },
    {
      id: "c2",
      boardId: "b1",
      listId: "l2",
      title: "Review audit pipeline",
      priority: "med",
    },
  ];

  const incidents: Incident[] = [
    { id: "i1", title: "Latency spike EU", severity: "high", state: "monitoring" },
    { id: "i2", title: "Webhook failures", severity: "med", state: "open" },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "a1",
      message: "Created incident: Latency spike EU",
      createdAt: DEMO_AUDIT_CREATED_AT,
    },
  ];

  return { boards, cards, incidents, auditLogs, userId };
}
