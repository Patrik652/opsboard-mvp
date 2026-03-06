import { createAuditLogger } from "./audit/auditLogger";
import { createTelemetryClient } from "./monitoring/telemetry";
import { createRecoveryKit } from "./recovery/recoveryKit";

export const telemetryClient = createTelemetryClient();
export const auditLogger = createAuditLogger();
export const recoveryKit = createRecoveryKit();
