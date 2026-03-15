import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import type { AuditLog, Board, Card, Incident, Service } from "../model";
import { boardCardsPath, userCollectionPath } from "../paths";
import { createTimestampFields, touchUpdatedAt } from "../timestamps";
import type { WriteAuditLogInput } from "./auditRepository";
import type { CreateCardInput, UpdateCardInput } from "./boardsRepository";
import type { CreateIncidentInput, UpdateIncidentInput } from "./incidentsRepository";
import type { CreateServiceInput, UpdateServiceInput } from "./servicesRepository";
import type { WorkspaceRepository, WorkspaceSnapshot } from "./workspaceRepository";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function withDocId<T extends { id: string }>(id: string, data: Omit<T, "id"> | T): T {
  return {
    ...data,
    id,
  } as T;
}

export function createFirestoreWorkspaceRepository(db: Firestore): WorkspaceRepository {
  const listBoards = async (userId: string): Promise<Board[]> => {
    const snapshot = await getDocs(collection(db, userCollectionPath(userId, "boards")));
    return snapshot.docs.map((item) => withDocId(item.id, item.data() as Omit<Board, "id">));
  };

  const listCards = async (userId: string, boardId?: string): Promise<Card[]> => {
    const boards = boardId ? [{ id: boardId }] : await listBoards(userId);
    const nestedSnapshots = await Promise.all(
      boards.map((board) => getDocs(collection(db, boardCardsPath(userId, board.id))))
    );
    return nestedSnapshots.flatMap((snapshot) =>
      snapshot.docs.map((item) => withDocId(item.id, item.data() as Omit<Card, "id">))
    );
  };

  const createCard = async (input: CreateCardInput): Promise<Card> => {
    const nextCard: Card = {
      id: createId("card"),
      boardId: input.boardId,
      listId: input.listId,
      title: input.title,
      description: input.description,
      priority: input.priority ?? "med",
      createdBy: input.userId,
      source: "user",
      ...createTimestampFields(),
    };

    await setDoc(doc(db, boardCardsPath(input.userId, input.boardId), nextCard.id), nextCard);
    return nextCard;
  };

  const updateCard = async (
    userId: string,
    boardId: string,
    cardId: string,
    input: UpdateCardInput
  ): Promise<Card> => {
    const cardRef = doc(db, boardCardsPath(userId, boardId), cardId);
    const existingSnapshot = await getDoc(cardRef);
    const existing = existingSnapshot.data() as Card | undefined;
    if (!existing) {
      throw new Error(`Card not found: ${cardId}`);
    }

    const nextCard = touchUpdatedAt(input);
    await updateDoc(cardRef, nextCard);
    return {
      ...existing,
      ...nextCard,
      id: cardId,
      boardId,
    };
  };

  const listIncidents = async (userId: string): Promise<Incident[]> => {
    const snapshot = await getDocs(collection(db, userCollectionPath(userId, "incidents")));
    return snapshot.docs.map((item) => withDocId(item.id, item.data() as Omit<Incident, "id">));
  };

  const createIncident = async (input: CreateIncidentInput): Promise<Incident> => {
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
      source: "user",
      ...createTimestampFields(),
    };

    await setDoc(doc(db, userCollectionPath(input.userId, "incidents"), nextIncident.id), nextIncident);
    return nextIncident;
  };

  const updateIncident = async (
    userId: string,
    incidentId: string,
    input: UpdateIncidentInput
  ): Promise<Incident> => {
    const incidentRef = doc(db, userCollectionPath(userId, "incidents"), incidentId);
    const existingSnapshot = await getDoc(incidentRef);
    const existing = existingSnapshot.data() as Incident | undefined;
    if (!existing) {
      throw new Error(`Incident not found: ${incidentId}`);
    }

    const nextIncident = touchUpdatedAt(input);
    await updateDoc(incidentRef, nextIncident);
    return {
      ...existing,
      ...nextIncident,
      id: incidentId,
    };
  };

  const listServices = async (userId: string): Promise<Service[]> => {
    const snapshot = await getDocs(collection(db, userCollectionPath(userId, "services")));
    return snapshot.docs.map((item) => withDocId(item.id, item.data() as Omit<Service, "id">));
  };

  const createService = async (input: CreateServiceInput): Promise<Service> => {
    const nextService: Service = {
      id: createId("service"),
      name: input.name,
      status: input.status ?? "operational",
      description: input.description,
      createdBy: input.userId,
      source: "user",
      ...createTimestampFields(),
    };

    await setDoc(doc(db, userCollectionPath(input.userId, "services"), nextService.id), nextService);
    return nextService;
  };

  const updateService = async (
    userId: string,
    serviceId: string,
    input: UpdateServiceInput
  ): Promise<Service> => {
    const serviceRef = doc(db, userCollectionPath(userId, "services"), serviceId);
    const existingSnapshot = await getDoc(serviceRef);
    const existing = existingSnapshot.data() as Service | undefined;
    if (!existing) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    const nextService = touchUpdatedAt(input);
    await updateDoc(serviceRef, nextService);
    return {
      ...existing,
      ...nextService,
      id: serviceId,
    };
  };

  const listAuditLogs = async (userId: string): Promise<AuditLog[]> => {
    const snapshot = await getDocs(
      query(collection(db, userCollectionPath(userId, "auditLogs")), orderBy("createdAt", "asc"))
    );
    return snapshot.docs.map((item) => withDocId(item.id, item.data() as Omit<AuditLog, "id">));
  };

  const writeAuditLog = async (input: WriteAuditLogInput): Promise<AuditLog> => {
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
      source: "system",
    };

    await setDoc(doc(db, userCollectionPath(input.userId, "auditLogs"), nextLog.id), nextLog);
    return nextLog;
  };

  const getWorkspace = async (userId: string): Promise<WorkspaceSnapshot> => {
    const [boards, cards, incidents, auditLogs, services] = await Promise.all([
      listBoards(userId),
      listCards(userId),
      listIncidents(userId),
      listAuditLogs(userId),
      listServices(userId),
    ]);

    return {
      userId,
      boards,
      cards,
      incidents,
      auditLogs,
      services,
      snapshots: [],
    };
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
