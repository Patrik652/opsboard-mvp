import type { WriteAuditLogInput } from "@/features/data/repositories/auditRepository";
import type { AuditEntry } from "@/features/platform/audit/auditLogger";

type WriteAuditEventDependencies = {
  writeAuditLog: (input: WriteAuditLogInput) => Promise<unknown>;
  mirrorAuditEntry?: (entry: Omit<AuditEntry, "id" | "createdAt">) => void;
};

export async function writeAuditEvent(
  input: WriteAuditLogInput,
  dependencies: WriteAuditEventDependencies
) {
  await dependencies.writeAuditLog(input);

  dependencies.mirrorAuditEntry?.({
    actor: input.actor ?? "ops-user",
    action: input.action ?? "workspace.event",
    details: input.details ?? input.message,
    message: input.message,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
  });
}
