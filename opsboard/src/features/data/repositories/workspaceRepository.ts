import type { AuditLog, Board, Card, Incident, RecoverySnapshot, Service } from "../model";
import type { AuditRepository } from "./auditRepository";
import type { BoardsRepository } from "./boardsRepository";
import type { IncidentsRepository } from "./incidentsRepository";
import type { ServicesRepository } from "./servicesRepository";

export type WorkspaceSnapshot = {
  userId: string;
  boards: Board[];
  cards: Card[];
  incidents: Incident[];
  auditLogs: AuditLog[];
  services: Service[];
  snapshots: RecoverySnapshot[];
};

export type WorkspaceRepository = BoardsRepository &
  IncidentsRepository &
  ServicesRepository &
  AuditRepository & {
    getWorkspace: (userId: string) => Promise<WorkspaceSnapshot>;
  };
