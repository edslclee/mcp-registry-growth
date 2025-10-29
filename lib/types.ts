// === Core Data Types ===

export interface Snapshot {
  date: string;  // Date in YYYY-MM-DD format (from publishedAt)
  total: number;
  local: number;
  remote: number;
}

export interface TimeSeries {
  snapshots: Snapshot[];
  startDate: string;
  endDate: string;
  totalSnapshots: number;
}

// === Filter State ===

export type ServerType = 'all' | 'local' | 'remote';
export type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface FilterState {
  serverType: ServerType;
  granularity: Granularity;
}

// === Chart Data ===

export interface ChartDataPoint {
  date: string;  // Formatted date string for display (YYYY-MM-DD)
  total: number;
  local: number;
  remote: number;
}

// === CSV Parsing ===

export interface CSVRow {
  date: string;
  total: string;
  local: string;
  remote: string;
}
