import type { AuditLog } from "../model";

export type WriteAuditLogInput = {
  userId: string;
  message: string;
  actor?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  metadata?: Record<string, unknown>;
};

export type AuditRepository = {
  listAuditLogs: (userId: string) => Promise<AuditLog[]>;
  writeAuditLog: (input: WriteAuditLogInput) => Promise<AuditLog>;
};
