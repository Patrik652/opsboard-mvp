import { buildStarterWorkspace } from "./starterWorkspace";

type BootstrapStarterWorkspaceOptions = {
  userId: string;
  hasExistingWorkspace: () => Promise<boolean>;
  hasRecord: (path: string) => Promise<boolean>;
  writeRecord: (path: string, data: Record<string, unknown>) => Promise<void>;
};

export async function bootstrapStarterWorkspace({
  userId,
  hasExistingWorkspace,
  hasRecord,
  writeRecord,
}: BootstrapStarterWorkspaceOptions) {
  if (await hasExistingWorkspace()) {
    return { created: false, writtenPaths: [] as string[] };
  }

  const records = buildStarterWorkspace(userId);
  const writtenPaths: string[] = [];

  for (const record of records) {
    if (await hasRecord(record.path)) {
      continue;
    }

    await writeRecord(record.path, record.data);
    writtenPaths.push(record.path);
  }

  return {
    created: writtenPaths.length > 0,
    writtenPaths,
  };
}
