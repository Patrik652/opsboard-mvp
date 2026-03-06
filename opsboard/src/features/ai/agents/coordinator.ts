import { buildActionPlan } from "./actionPlannerAgent";
import { assessIncidentRisk } from "./signalAgent";
import { summarizeIncident } from "./summaryAgent";
import type {
  AgentTrace,
  IncidentContext,
  IncidentWorkflowReport,
} from "./types";

function runAgent<T>(
  agent: AgentTrace["agent"],
  now: () => number,
  execute: () => T
): { result: T; trace: AgentTrace } {
  const startedAt = now();
  const result = execute();
  const finishedAt = now();

  return {
    result,
    trace: {
      agent,
      startedAt,
      finishedAt,
      durationMs: Math.max(0, finishedAt - startedAt),
    },
  };
}

export function runIncidentResponseWorkflow(
  context: IncidentContext,
  now: () => number = () => Date.now()
): IncidentWorkflowReport {
  const signalStep = runAgent("signal-agent", now, () => assessIncidentRisk(context));
  const summaryStep = runAgent("summary-agent", now, () =>
    summarizeIncident(context, signalStep.result)
  );
  const actionPlannerStep = runAgent("action-planner-agent", now, () =>
    buildActionPlan(context, signalStep.result)
  );

  return {
    risk: signalStep.result,
    summary: summaryStep.result,
    actionPlan: actionPlannerStep.result,
    trace: [signalStep.trace, summaryStep.trace, actionPlannerStep.trace],
  };
}
