import { Snapshot, Granularity } from './types';

export function aggregateByGranularity(
  snapshots: Snapshot[],
  granularity: Granularity
): Snapshot[] {
  if (granularity === 'hourly') {
    return snapshots;
  }

  const groups: Record<string, Snapshot> = {};

  for (const snap of snapshots) {
    const key = getGranularityKey(snap.timestamp, granularity);

    // Keep latest snapshot per bucket
    if (!groups[key] || snap.timestamp > groups[key].timestamp) {
      groups[key] = snap;
    }
  }

  return Object.values(groups);
}

function getGranularityKey(timestamp: string, granularity: Granularity): string {
  const date = new Date(timestamp);

  switch (granularity) {
    case 'daily':
      return date.toISOString().split('T')[0];  // YYYY-MM-DD
    case 'weekly':
      const year = date.getUTCFullYear();
      const week = getISOWeek(date);
      return `${year}-W${week.toString().padStart(2, '0')}`;
    case 'monthly':
      return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
    default:
      return timestamp;
  }
}

function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

