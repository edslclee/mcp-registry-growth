import { Snapshot, Granularity } from './types';

export function aggregateByGranularity(
  snapshots: Snapshot[],
  granularity: Granularity
): Snapshot[] {
  // Data is already daily, so hourly and daily return as-is
  if (granularity === 'hourly' || granularity === 'daily') {
    return snapshots;
  }

  const groups: Record<string, Snapshot> = {};

  for (const snap of snapshots) {
    const key = getGranularityKey(snap.date, granularity);

    // Keep latest snapshot per bucket
    if (!groups[key] || snap.date > groups[key].date) {
      groups[key] = snap;
    }
  }

  return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
}

function getGranularityKey(dateStr: string, granularity: Granularity): string {
  const date = new Date(dateStr);

  switch (granularity) {
    case 'daily':
      return dateStr;  // Already YYYY-MM-DD format
    case 'weekly':
      const year = date.getUTCFullYear();
      const week = getISOWeek(date);
      return `${year}-W${week.toString().padStart(2, '0')}`;
    case 'monthly':
      return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
    default:
      return dateStr;
  }
}

function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

