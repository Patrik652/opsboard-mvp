export function shouldSeed(counts: { boards: number; incidents: number }) {
  return counts.boards === 0 && counts.incidents === 0;
}
