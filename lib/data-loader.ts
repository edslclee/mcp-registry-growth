import fs from 'fs';
import path from 'path';
import { Snapshot, TimeSeries } from './types';

export function loadSnapshots(): TimeSeries {
  const csvPath = path.join(process.cwd(), 'data', 'snapshots.csv');

  // Handle missing file
  if (!fs.existsSync(csvPath)) {
    console.warn('snapshots.csv not found, returning empty data');
    return {
      snapshots: [],
      startDate: '',
      endDate: '',
      totalSnapshots: 0
    };
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const snapshots = parseCSV(content);

  if (snapshots.length === 0) {
    return {
      snapshots: [],
      startDate: '',
      endDate: '',
      totalSnapshots: 0
    };
  }

  return {
    snapshots,
    startDate: snapshots[0].timestamp,
    endDate: snapshots[snapshots.length - 1].timestamp,
    totalSnapshots: snapshots.length
  };
}

function parseCSV(content: string): Snapshot[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];  // Header + at least 1 data row

  const snapshots: Snapshot[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    const timestamp = values[0];
    const total = parseInt(values[1], 10);
    const local = parseInt(values[2], 10);
    const remote = parseInt(values[3], 10);

    // Validate
    if (!timestamp || isNaN(total) || isNaN(local) || isNaN(remote)) {
      console.warn(`Skipping invalid row ${i}: ${lines[i]}`);
      continue;
    }

    snapshots.push({ timestamp, total, local, remote });
  }

  // Sort by timestamp
  snapshots.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return snapshots;
}
