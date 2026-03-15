import { getBrowserStorage, readJson, type StorageLike, writeJson } from "@/features/platform/storage/jsonStorage";
import { buildSeedData } from "@/lib/seed";
import type { AuditLog, Card, Incident, Service } from "../model";
import { createTimestampFields, touchUpdatedAt } from "../timestamps";
import type { WriteAuditLogInput } from "./auditRepository";
import type { CreateCardInput, UpdateCardInput } from "./boardsRepository";
import type { CreateIncidentInput, UpdateIncidentInput } from "./incidentsRepository";
import type { CreateServiceInput, UpdateServiceInput } from "./servicesRepository";
import type { WorkspaceRepository, WorkspaceSnapshot } from "./workspaceRepository";

const DEMO_WORKSPACE_PREFIX = "opsboard.demo.workspace";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyServices(): Service[] {
  return [];
}

function createWorkspaceSnapshot(userId: string): WorkspaceSnapshot {
  const seed = buildSeedData(userId);
  return {
    userId,
    boards: seed.boards,
    cards: seed.cards,
    incidents: seed.incidents,
    auditLogs: seed.auditLogs,
    services: createEmptyServices(),
    snapshots: [],
  };
}

function getWorkspaceStorageKey(userId: string): string {
  return `${DEMO_WORKSPACE_PREFIX}.${userId}`;
}

export function createDemoWorkspaceRepository(
  storage: StorageLike | null = getBrowserStorage()
): WorkspaceRepository {
  const volatileSnapshots = new Map<string, WorkspaceSnapshot>();

  const readWorkspace = (userId: string): WorkspaceSnapshot => {
    if (!storage) {
      const existing = volatileSnapshots.get(userId);
      if (existing) {
        return existing;
      }

      const created = createWorkspaceSnapshot(userId);
      volatileSnapshots.set(userId, created);
      return created;
    }

    const snapshot = readJson<WorkspaceSnapshot | null>(
      storage,
      getWorkspaceStorageKey(userId),
      null
    );
    if (snapshot) {
      return snapshot;
    }

    const created = createWorkspaceSnapshot(userId);
    writeJson(storage, getWorkspaceStorageKey(userId), created);
    return created;
  };

  const writeWorkspace = (snapshot: WorkspaceSnapshot) => {
    if (!storage) {
      volatileSnapshots.set(snapshot.userId, snapshot);
      return;
    }

    writeJson(storage, getWorkspaceStorageKey(snapshot.userId), snapshot);
  };

  const getWorkspace = async (userId: string): Promise<WorkspaceSnapshot> => readWorkspace(userId);

  const listBoards = async (userId: string) => readWorkspace(userId).boards;

  const listCards = async (userId: string, boardId?: string) => {
    const cards = readWorkspace(userId).cards;
    return boardId ? cards.filter((card) => card.boardId === boardId) : cards;
  };

  const createCard = async (input: CreateCardInput): Promise<Card> => {
    const snapshot = readWorkspace(input.userId);
    const nextCard: Card = {
      id: createId("card"),
      boardId: input.boardId,
      listId: input.listId,
      title: input.title,
      description: input.description,
      priority: input.priority ?? "med",
      createdBy: input.userId,
      source: "demo",
      ...createTimestampFields(),
    };

    writeWorkspace({
      ...snapshot,
      cards: [nextCard, ...snapshot.cards],
    });

    return nextCard;
  };

  const updateCard = async (
    userId: string,
    boardId: string,
    cardId: string,
    input: UpdateCardInput
  ): Promise<Card> => {
    const snapshot = readWorkspace(userId);
    const existing = snapshot.cards.find((card) => card.id === cardId && card.boardId === boardId);
    if (!existing) {
      throw new Error(`Card not found: ${cardId}`);
    }

    const nextCard = touchUpdatedAt({
      ...existing,
      ...input,
    });
    const cards = snapshot.cards.map((card) => (card.id === cardId ? nextCard : card));

    writeWorkspace({
      ...snapshot,
      cards,
    });

    return nextCard;
  };

  const listIncidents = async (userId: string) => readWorkspace(userId).incidents;

  const createIncident = async (input: CreateIncidentInput): Promise<Incident> => {
    const snapshot = readWorkspace(input.userId);
    const nextIncident: Incident = {
      id: createId("incident"),
      title: input.title,
      summary: input.summary,
      severity: input.severity,
      state: input.state ?? "open",
      impact: input.impact,
      relatedCardIds: input.relatedCardIds ?? [],
      affectedServiceIds: input.affectedServiceIds ?? [],
      createdBy: input.userId,
      source: "demo",
      ...createTimestampFields(),
    };

    writeWorkspace({
      ...snapshot,
      incidents: [nextIncident, ...snapshot.incidents],
    });

    return nextIncident;
  };

  const updateIncident = async (
    userId: string,
    incidentId: string,
    input: UpdateIncidentInput
  ): Promise<Incident> => {
    const snapshot = readWorkspace(userId);
    const existing = snapshot.incidents.find((incident) => incident.id === incidentId);
    if (!existing) {
      throw new Error(`Incident not found: ${incidentId}`);
    }

    const nextIncident = touchUpdatedAt({
      ...existing,
      ...input,
    });
    const incidents = snapshot.incidents.map((incident) =>
      incident.id === incidentId ? nextIncident : incident
    );

    writeWorkspace({
      ...snapshot,
      incidents,
    });

    return nextIncident;
  };

  const listServices = async (userId: string) => readWorkspace(userId).services;

  const createService = async (input: CreateServiceInput): Promise<Service> => {
    const snapshot = readWorkspace(input.userId);
    const nextService: Service = {
      id: createId("service"),
      name: input.name,
      status: input.status ?? "operational",
      description: input.description,
      createdBy: input.userId,
      source: "demo",
      ...createTimestampFields(),
    };

    writeWorkspace({
      ...snapshot,
      services: [nextService, ...snapshot.services],
    });

    return nextService;
  };

  const updateService = async (
    userId: string,
    serviceId: string,
    input: UpdateServiceInput
  ): Promise<Service> => {
    const snapshot = readWorkspace(userId);
    const existing = snapshot.services.find((service) => service.id === serviceId);
    if (!existing) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    const nextService = touchUpdatedAt({
      ...existing,
      ...input,
    });
    const services = snapshot.services.map((service) =>
      service.id === serviceId ? nextService : service
    );

    writeWorkspace({
      ...snapshot,
      services,
    });

    return nextService;
  };

  const listAuditLogs = async (userId: string): Promise<AuditLog[]> => readWorkspace(userId).auditLogs;

  const writeAuditLog = async (input: WriteAuditLogInput): Promise<AuditLog> => {
    const snapshot = readWorkspace(input.userId);
    const createdAt = Date.now();
    const nextLog: AuditLog = {
      id: createId("audit"),
      message: input.message,
      actor: input.actor,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: input.details,
      metadata: input.metadata,
      createdAt,
      createdBy: input.userId,
      updatedAt: createdAt,
      source: "demo",
    };

    writeWorkspace({
      ...snapshot,
      auditLogs: [...snapshot.auditLogs, nextLog],
    });

    return nextLog;
  };

  return {
    getWorkspace,
    listBoards,
    listCards,
    createCard,
    updateCard,
    listIncidents,
    createIncident,
    updateIncident,
    listServices,
    createService,
    updateService,
    listAuditLogs,
    writeAuditLog,
  };
}
