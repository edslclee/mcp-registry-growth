// Generate test data for development
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const csvPath = path.join(dataDir, 'snapshots.csv');

// Generate 30 days of hourly data
const snapshots = [];
const startDate = new Date('2025-10-01T00:00:00Z');
const endDate = new Date('2025-10-29T00:00:00Z');

let currentTotal = 50;
let currentLocal = 30;
let currentRemote = 25;

for (let d = new Date(startDate); d <= endDate; d.setHours(d.getHours() + 1)) {
  // Add some randomness to simulate growth
  if (Math.random() > 0.7) {
    currentTotal += Math.floor(Math.random() * 3);
    currentLocal += Math.floor(Math.random() * 2);
    currentRemote += Math.floor(Math.random() * 2);
  }

  snapshots.push({
    timestamp: d.toISOString(),
    total: currentTotal,
    local: currentLocal,
    remote: currentRemote
  });
}

// Write CSV file
const csv = 'timestamp,total,local,remote\n' +
  snapshots.map(s => `${s.timestamp},${s.total},${s.local},${s.remote}`).join('\n');

fs.writeFileSync(csvPath, csv);
console.log(`Generated ${snapshots.length} test snapshots`);
console.log(`Latest data: Total=${currentTotal}, Local=${currentLocal}, Remote=${currentRemote}`);
