export type TimestampFields = {
  createdAt: number;
  updatedAt: number;
};

export function createTimestampFields(now: number = Date.now()): TimestampFields {
  return {
    createdAt: now,
    updatedAt: now,
  };
}

export function touchUpdatedAt<T extends object>(
  record: T,
  now: number = Date.now()
): T & { updatedAt: number } {
  return {
    ...record,
    updatedAt: now,
  };
}
