export type Priority = "low" | "med" | "high";

export type Severity = "low" | "med" | "high";

export type IncidentState = "open" | "monitoring" | "resolved";

export type ServiceStatus = "operational" | "degraded" | "outage";

export type EntitySource = "demo" | "starter" | "user" | "system";

export type BaseRecord = {
  id: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  archivedAt?: number | null;
  resolvedAt?: number | null;
  source?: EntitySource;
};

export type BoardList = {
  id: string;
  name: string;
  order?: number;
};

export type Board = BaseRecord & {
  name: string;
  lists: BoardList[];
};

export type Card = BaseRecord & {
  boardId: string;
  listId: string;
  title: string;
  description?: string;
  priority: Priority;
  linkedIncidentId?: string | null;
};

export type Incident = BaseRecord & {
  title: string;
  summary?: string;
  severity: Severity;
  state: IncidentState;
  impact?: string;
  relatedCardIds?: string[];
  affectedServiceIds?: string[];
};

export type AuditLog = BaseRecord & {
  message: string;
  createdAt: number;
  actor?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  metadata?: Record<string, unknown>;
};

export type Service = BaseRecord & {
  name: string;
  status: ServiceStatus;
  description?: string;
};

export type RecoverySnapshot = BaseRecord & {
  version: string;
  payload: Record<string, unknown>;
};
