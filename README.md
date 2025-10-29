# MCP Registry Analytics

A static dashboard for tracking the growth and distribution of Model Context Protocol (MCP) servers.

## Overview

This project provides real-time visualization of the MCP Registry ecosystem, tracking server counts over time and classifying them by type (local vs. remote). Data is collected hourly via automated GitHub Actions workflows and displayed through an interactive Next.js dashboard.

## Features

- **Real-time Analytics**: View total, local, and remote server counts
- **Time-series Visualization**: Interactive charts powered by Recharts
- **Flexible Filtering**: Filter by server type (All/Local/Remote)
- **Time Granularity**: View data at hourly, daily, weekly, or monthly intervals
- **Responsive Design**: Optimized for 320px to 4K displays
- **Dark Theme**: Modern dark UI optimized for readability
- **Static Site**: Fast load times (<3s) with static generation

## Technology Stack

### Frontend
- Next.js 14 (App Router with static export)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Radix UI (accessible components)

### Infrastructure
- Bash (data collection script)
- GitHub Actions (macOS runner for hourly data aggregation)
- CSV file storage (time-series snapshots)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Bash and jq (for running aggregation script)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-registry-growth
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

Generate the static site:
```bash
npm run build
```

The static files will be output to the `out/` directory.

## Data Collection

### Manual Data Collection

Run the bash aggregation script manually:
```bash
bash scripts/aggregate-servers.sh
```

This fetches the latest server counts from the MCP Registry API and appends a timestamped snapshot to `data/snapshots.csv`.

### Automated Collection

The GitHub Actions workflow (`.github/workflows/aggregate-data.yml`) runs hourly on a macOS runner to collect data automatically. The workflow:

1. Checks out the repository
2. Executes the bash script
3. Commits and pushes new snapshots to the repo
4. Triggers a rebuild of the static site

## Project Structure

```
mcp-registry-growth/
├── app/                      # Next.js app directory
│   ├── about/               # About page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── charts/              # Chart components
│   ├── navigation/          # Navigation components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── data-loader.ts       # CSV parsing logic
│   ├── data-aggregator.ts   # Data aggregation logic
│   └── utils.ts             # Utility functions
├── scripts/
│   └── aggregate-servers.sh  # Bash data collection script
├── data/
│   └── snapshots.csv        # Time-series data storage
└── .github/workflows/
    └── aggregate-data.yml   # Automated data collection workflow
```

## Data Schema

### CSV Format (`data/snapshots.csv`)

```csv
timestamp,total,local,remote
2025-10-28T00:00:00Z,150,95,65
```

- `timestamp`: ISO 8601 timestamp
- `total`: Total number of unique servers
- `local`: Count of servers with `packages` property
- `remote`: Count of servers with `remotes` property

## Classification Logic

Servers are classified based on their properties in the MCP Registry API response:

### Classification Rules

- **Local Servers**: Have a `server.packages` property (installable via npm/docker)
- **Remote Servers**: Have a `server.remotes` property (accessible via HTTP/SSE endpoints)

### Important Notes

1. **Servers can belong to both categories**: Some servers provide both local installation packages and remote endpoints
2. **CSV format**: `timestamp,total,local,remote`
   - `total`: Total unique servers in registry
   - `local`: Count of servers with `packages` property
   - `remote`: Count of servers with `remotes` property
   - Note: `local + remote` may exceed `total` due to servers with both properties

### Verified Distribution (as of 2025-10-29)

Based on 1,427 servers in the registry:
- **Local only**: 817 servers (57.2%)
- **Remote only**: 513 servers (35.9%)
- **Both**: 48 servers (3.4%)
- **Neither**: 49 servers (3.4%) - metadata-only entries

**Example servers with both properties**:
- `ai.shawndurrani/mcp-merchant`
- `co.pipeboard/meta-ads-mcp`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Serve production build (Note: static export doesn't need this)
- `npm run lint` - Run ESLint

### Adding New Features

1. Follow the existing component structure in `components/`
2. Use TypeScript types from `lib/types.ts`
3. Maintain dark theme consistency with Tailwind classes
4. Ensure responsive design (test at 320px, 768px, 1024px, 1920px)

## Constitution Principles

This project adheres to the following principles:

1. **Static Site**: No runtime server required, deploy anywhere
2. **Responsive Design**: Support all device sizes (320px to 4K)
3. **Minimal Dependencies**: Only essential packages (<2MB total)

## License

[License information to be added]

## Contributing

[Contribution guidelines to be added]