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
- PowerShell Core (data collection script)
- GitHub Actions (Windows runner for hourly data aggregation)
- CSV file storage (time-series snapshots)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PowerShell Core 7+ (for running aggregation script)
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

Run the PowerShell aggregation script manually:
```powershell
pwsh scripts/aggregate-servers.ps1
```

This fetches the latest server counts from the MCP Registry API and appends a timestamped snapshot to `data/snapshots.csv`.

### Automated Collection

The GitHub Actions workflow (`.github/workflows/aggregate-data.yml`) runs hourly on a Windows runner to collect data automatically. The workflow:

1. Checks out the repository
2. Executes the PowerShell script
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
│   └── aggregate-servers.ps1 # PowerShell data collection script
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

Servers are classified based on their properties in the MCP Registry:

- **Local Servers**: Have a `packages` property (npm packages)
- **Remote Servers**: Have a `remotes` property (HTTP/SSE endpoints)
- Servers can be counted in both categories if they have both properties

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