// === Core Data Types ===

export interface Snapshot {
  timestamp: string;  // ISO 8601
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
  timestamp: string;  // Formatted date string for display
  total: number;
  local: number;
  remote: number;
}

// === CSV Parsing ===

export interface CSVRow {
  timestamp: string;
  total: string;
  local: string;
  remote: string;
}
