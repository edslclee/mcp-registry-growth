# Data Loading Contract

**Purpose**: Define the interface for loading and parsing snapshot data from CSV

## Module: `lib/data-loader.ts`

### Function: `loadSnapshots()`

Loads the CSV file at build time and returns parsed snapshot data.

**Signature**:
```typescript
export function loadSnapshots(): TimeSeries
```

**Input**: None (reads from fixed path `data/snapshots.csv`)

**Output**:
```typescript
{
  snapshots: Snapshot[];       // Array of all valid snapshots
  startDate: string;           // ISO 8601 of first snapshot
  endDate: string;             // ISO 8601 of last snapshot
  totalSnapshots: number;      // Count of snapshots
}
```

**Behavior**:
1. Read file from `data/snapshots.csv` (relative to project root)
2. Parse CSV using native JavaScript (no library)
3. Validate each row (skip invalid rows with console warning)
4. Sort by timestamp ascending
5. Return TimeSeries object

**Error Handling**:
- If file doesn't exist: Return empty TimeSeries with 0 snapshots
- If file is empty/malformed: Return empty TimeSeries
- If individual rows invalid: Skip row, log warning, continue

**Performance**:
- Must complete in <100ms for 1000 snapshots
- Must not exceed 10MB memory for parsing

**Usage Example**:
```typescript
// In Next.js page (build time)
import { loadSnapshots } from '@/lib/data-loader';

export default function DashboardPage() {
  const timeSeries = loadSnapshots();
  // timeSeries is embedded in page at build time
  return <Dashboard data={timeSeries} />;
}
```

---

### Function: `parseCSV()`

Internal helper to parse CSV string into structured data.

**Signature**:
```typescript
function parseCSV(content: string): Snapshot[]
```

**Input**: Raw CSV file content as string

**Output**: Array of validated Snapshot objects

**Behavior**:
1. Split by newlines
2. Extract header row
3. For each data row:
   - Split by comma
   - Map to object using headers
   - Validate (see validation rules)
   - Convert strings to numbers
4. Return array of valid snapshots

**CSV Format Expected**:
```
timestamp,total,local,remote
2025-10-28T14:00:00Z,450,320,150
```

**Validation Rules**:
- Header MUST have exactly 4 columns: `timestamp,total,local,remote`
- Timestamp MUST be valid ISO 8601 format
- Counts MUST be non-negative integers
- Rows with invalid data are skipped (not thrown as errors)

---

## Module: `lib/data-aggregator.ts`

### Function: `aggregateByGranularity()`

Re-buckets snapshots based on selected time granularity.

**Signature**:
```typescript
export function aggregateByGranularity(
  snapshots: Snapshot[],
  granularity: Granularity
): Snapshot[]
```

**Input**:
- `snapshots`: Array of hourly snapshots (pre-sorted by timestamp)
- `granularity`: One of `'hourly' | 'daily' | 'weekly' | 'monthly'`

**Output**: Array of snapshots aggregated to requested granularity

**Behavior**:
- **Hourly**: Return input unchanged
- **Daily**: Group by date (YYYY-MM-DD), return latest snapshot per day
- **Weekly**: Group by ISO week (YYYY-Www), return latest snapshot per week
- **Monthly**: Group by month (YYYY-MM), return latest snapshot per month

**Aggregation Logic**:
```typescript
// For daily aggregation
const groups = snapshots.reduce((acc, snap) => {
  const date = snap.timestamp.split('T')[0];  // Extract YYYY-MM-DD
  if (!acc[date] || snap.timestamp > acc[date].timestamp) {
    acc[date] = snap;  // Keep latest
  }
  return acc;
}, {});

return Object.values(groups);
```

**Performance**:
- Must complete in <50ms for 1000 snapshots
- O(n) complexity (single pass)

**Usage Example**:
```typescript
const hourlyData = loadSnapshots().snapshots;
const dailyData = aggregateByGranularity(hourlyData, 'daily');
// Result: One snapshot per day (latest value of each day)
```

---

### Function: `filterByServerType()`

Filters snapshot data to show only selected server type.

**Signature**:
```typescript
export function filterByServerType(
  snapshots: Snapshot[],
  serverType: ServerType
): Snapshot[]
```

**Input**:
- `snapshots`: Array of snapshots with all server type counts
- `serverType`: One of `'all' | 'local' | 'remote'`

**Output**: New array with counts adjusted for selected type

**Behavior**:
- **'all'**: Return snapshots unchanged (use `.total` field)
- **'local'**: Return snapshots with count set to `.local` field
- **'remote'**: Return snapshots with count set to `.remote` field

**Implementation Note**:
This doesn't filter out snapshots, it transforms which count field is used for charting.

**Usage Example**:
```typescript
const allServers = snapshots;  // { total: 450, local: 320, remote: 150 }
const localOnly = filterByServerType(snapshots, 'local');
// Same timestamps, but count field shows local count (320)
```

---

### Function: `toChartData()`

Converts filtered/aggregated snapshots to Recharts-compatible format.

**Signature**:
```typescript
export function toChartData(
  snapshots: Snapshot[],
  serverType: ServerType,
  granularity: Granularity
): ChartDataPoint[]
```

**Input**:
- `snapshots`: Pre-processed snapshot array
- `serverType`: Used to determine which count field to display
- `granularity`: Used to format date labels

**Output**: Array of chart data points with formatted labels

**Behavior**:
1. Extract count based on `serverType`:
   - `'all'` → use `snapshot.total`
   - `'local'` → use `snapshot.local`
   - `'remote'` → use `snapshot.remote`

2. Format date label based on `granularity`:
   - `'hourly'` → "Oct 28, 14:00"
   - `'daily'` → "Oct 28"
   - `'weekly'` → "Week 43, 2025"
   - `'monthly'` → "Oct 2025"

3. Add tooltip label (e.g., "450 servers on Oct 28")

**Performance**: Must complete in <20ms for 1000 points

**Usage Example**:
```typescript
const chartData = toChartData(
  snapshots,
  'local',
  'daily'
);
// Result:
// [
//   { date: "Oct 28", timestamp: 1730150400000, count: 320, label: "320 local servers on Oct 28" },
//   ...
// ]
```

---

## Contract Testing

### Test Cases for `loadSnapshots()`

```typescript
describe('loadSnapshots', () => {
  it('should parse valid CSV correctly', () => {
    // Given a valid CSV file
    // When loadSnapshots() is called
    // Then return TimeSeries with parsed snapshots
  });

  it('should skip invalid rows and continue', () => {
    // Given CSV with one invalid row
    // When loadSnapshots() is called
    // Then return TimeSeries without the invalid row
  });

  it('should return empty TimeSeries if file missing', () => {
    // Given no CSV file exists
    // When loadSnapshots() is called
    // Then return empty TimeSeries (0 snapshots)
  });

  it('should sort snapshots by timestamp ascending', () => {
    // Given unsorted CSV
    // When loadSnapshots() is called
    // Then snapshots are sorted oldest to newest
  });
});
```

### Test Cases for `aggregateByGranularity()`

```typescript
describe('aggregateByGranularity', () => {
  it('should return unchanged for hourly', () => {
    // Given hourly snapshots
    // When granularity = 'hourly'
    // Then return same array
  });

  it('should aggregate to daily (latest per day)', () => {
    // Given 24 hourly snapshots (1 day)
    // When granularity = 'daily'
    // Then return 1 snapshot (latest of the day)
  });

  it('should handle month boundaries correctly', () => {
    // Given snapshots across month boundary
    // When granularity = 'monthly'
    // Then each month has separate aggregation
  });
});
```

### Test Cases for `filterByServerType()`

```typescript
describe('filterByServerType', () => {
  it('should use total count for "all"', () => {
    // Given snapshot with total=450, local=320, remote=150
    // When serverType='all'
    // Then count = 450
  });

  it('should use local count for "local"', () => {
    // Given snapshot with total=450, local=320, remote=150
    // When serverType='local'
    // Then count = 320
  });

  it('should use remote count for "remote"', () => {
    // Given snapshot with total=450, local=320, remote=150
    // When serverType='remote'
    // Then count = 150
  });
});
```

---

## Integration Points

### With Next.js Pages

**Dashboard Page** (`app/page.tsx`):
```typescript
import { loadSnapshots } from '@/lib/data-loader';

export default function DashboardPage() {
  // Called at build time (server-side)
  const timeSeries = loadSnapshots();

  // Data embedded in static page
  return <Dashboard initialData={timeSeries} />;
}
```

### With React Components

**Dashboard Component** (`components/dashboard.tsx`):
```typescript
'use client';

import { useState } from 'react';
import { aggregateByGranularity, toChartData } from '@/lib/data-aggregator';

export function Dashboard({ initialData }: { initialData: TimeSeries }) {
  const [serverType, setServerType] = useState<ServerType>('all');
  const [granularity, setGranularity] = useState<Granularity>('hourly');

  // Client-side transformation
  const aggregated = aggregateByGranularity(initialData.snapshots, granularity);
  const chartData = toChartData(aggregated, serverType, granularity);

  return (
    <div>
      {/* Filters */}
      <ServerTypeFilter value={serverType} onChange={setServerType} />
      <GranularitySelector value={granularity} onChange={setGranularity} />

      {/* Chart */}
      <TimeSeriesChart data={chartData} />
    </div>
  );
}
```

---

## Performance Requirements

| Operation | Target | Measured With |
|-----------|--------|---------------|
| Load & parse CSV (1000 rows) | <100ms | Build-time console.time |
| Aggregate to daily (1000 → 42) | <50ms | Browser DevTools |
| Filter by server type | <10ms | Browser DevTools |
| Transform to chart data | <20ms | Browser DevTools |
| **Total (filter + aggregate + transform)** | **<80ms** | Must meet SC-003 (1 sec) |

All operations combined must complete well under 1 second to meet success criteria.
