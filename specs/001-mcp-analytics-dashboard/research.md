# Research: MCP Server Analytics Dashboard

**Created**: 2025-10-28
**Purpose**: Resolve technical uncertainties and make informed technology choices for implementation

## Research Questions

1. Chart library selection for time-series visualization
2. Testing framework for Next.js static export
3. CSV parsing strategy for optimal performance

---

## 1. Chart Library Selection

### Problem Statement

Need a charting library to display time-series data with:
- Interactive filtering (show/hide series)
- Responsive design (320px-4K)
- Time-based X-axis with configurable granularity
- Lightweight bundle size (<100KB ideal, <200KB acceptable)
- Good maintenance and React 18 compatibility

### Alternatives Evaluated

#### Option A: Recharts
- **Bundle Size**: ~95KB gzipped (with dependencies)
- **Pros**:
  - Native React components, declarative API
  - Built on D3.js for scales and shapes (proven foundation)
  - Responsive by default
  - Good TypeScript support
  - Active maintenance (last release <3 months ago)
- **Cons**:
  - Slightly larger bundle than pure canvas solutions
  - Animation performance can degrade with 1000+ points
- **Bundle Impact**: Acceptable for constitution compliance (<200KB total with other deps)

#### Option B: Chart.js with react-chartjs-2
- **Bundle Size**: ~65KB gzipped (smaller than Recharts)
- **Pros**:
  - Lighter weight
  - Canvas-based (better performance for large datasets)
  - Widely used, mature ecosystem
- **Cons**:
  - Imperative API, less "React-native" feel
  - TypeScript support added later (not as seamless)
  - React wrapper adds indirection layer

#### Option C: Victory
- **Bundle Size**: ~180KB gzipped (large)
- **Pros**:
  - Very powerful animation capabilities
  - Excellent documentation
  - Strong TypeScript support
- **Cons**:
  - Heaviest option, violates constitution principle
  - Overkill for our use case

#### Option D: Vanilla Canvas + D3 Scales
- **Bundle Size**: ~30KB gzipped (D3 scales only)
- **Pros**:
  - Minimal dependencies
  - Maximum control
  - Best performance
- **Cons**:
  - Requires custom implementation for responsiveness, axes, legends, tooltips
  - Significant development time (estimated 2-3x longer)
  - Maintenance burden for custom code

### Decision: **Recharts**

**Rationale**:
1. **Balance**: Provides declarative React API without excessive bundle size
2. **Development Velocity**: Chart implementation takes ~1-2 days vs 4-6 days for vanilla canvas
3. **Constitution Compliance**: 95KB is acceptable within 2MB total budget
4. **Maintenance**: Well-maintained library reduces long-term risk
5. **Time-Series Support**: Built-in `<LineChart>` and `<ResponsiveContainer>` components handle our use case natively

**Alternatives Rejected**:
- Chart.js: Imperative API doesn't align with React patterns, TypeScript experience inferior
- Victory: Bundle size too large, violates minimal dependencies principle
- Vanilla Canvas: Development time cost outweighs 65KB savings, creates maintenance burden

**Bundle Size Justification**:
- Next.js runtime: ~85KB
- React 18: Included in Next.js
- Recharts: ~95KB
- ShadCN components (estimated 5 components × 15KB): ~75KB
- Application code: ~50KB
- **Total**: ~305KB (well under 2MB limit)

---

## 2. Testing Framework

### Problem Statement

Need testing capabilities for:
- Component rendering with static data
- Data aggregation logic
- CSV parsing correctness

Constitution doesn't mandate tests, but SC-008 requires WCAG AA compliance verification.

### Alternatives Evaluated

#### Option A: Vitest + Testing Library
- **Rationale**: Vitest is fast, modern, and Next.js compatible
- **Bundle Impact**: Development dependency only (0KB production)
- **Pros**: Fast test execution, good TypeScript support

#### Option B: Jest + Testing Library
- **Rationale**: Traditional choice, widely documented
- **Cons**: Slower than Vitest, requires more configuration for Next.js App Router

#### Option C: No automated testing
- **Rationale**: Tests not required by constitution, static export reduces runtime risk
- **Risk**: Manual testing burden, no regression prevention

### Decision: **Vitest + Testing Library** (minimal test coverage)

**Rationale**:
1. Tests are not required by spec, but helpful for data aggregation logic
2. Development dependency doesn't affect bundle size
3. Will write tests for:
   - CSV parsing correctness
   - Data aggregation by granularity
   - Server type classification (local/remote logic)
4. Will NOT write extensive UI tests (manual QA sufficient for static site)

**Scope**: Core data processing logic only, skip comprehensive component testing

---

## 3. CSV Parsing Strategy

### Problem Statement

GitHub Actions generates CSV file with hourly snapshots. Next.js needs to:
1. Read CSV at build time
2. Parse into usable data structure
3. Minimize bundle impact

### Alternatives Evaluated

#### Option A: papaparse library
- **Bundle Size**: ~50KB gzipped
- **Pros**: Robust CSV parsing, handles edge cases
- **Cons**: Adds dependency for simple use case

#### Option B: Native JavaScript split/map
- **Bundle Size**: 0KB (no dependency)
- **Pros**: Zero dependencies, simple CSV structure
- **Cons**: Manual error handling required

### Decision: **Native JavaScript**

**Rationale**:
1. CSV structure is simple (known columns, no complex escaping)
2. Constitution principle: prefer native solutions
3. Implementation:
   ```typescript
   const parseCSV = (content: string) => {
     const lines = content.trim().split('\n');
     const headers = lines[0].split(',');
     return lines.slice(1).map(line => {
       const values = line.split(',');
       return headers.reduce((obj, header, idx) => ({
         ...obj,
         [header]: values[idx]
       }), {});
     });
   };
   ```
4. Estimated effort: 30 minutes vs instant with library (acceptable trade-off for 50KB savings)

**Risk Mitigation**: Add unit tests to verify parsing handles expected CSV format

---

## 4. GitHub Actions Data Aggregation

### Technical Approach

**Bash Script** (`scripts/aggregate-servers.sh`):

```bash
#!/bin/bash
# Fetch all servers from MCP Registry API with pagination
# Classify as local (has packages) or remote (has remotes)
# Append timestamp + counts to data/snapshots.csv

set -e

ENDPOINT="https://registry.modelcontextprotocol.io/v0/servers"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:00:00Z")  # Round to hour
LOCAL_COUNT=0
REMOTE_COUNT=0
TOTAL_COUNT=0
CURSOR=""

while true; do
    if [ -z "$CURSOR" ]; then
        RESPONSE=$(curl -s "$ENDPOINT")
    else
        RESPONSE=$(curl -s "${ENDPOINT}?cursor=${CURSOR}")
    fi

    # Parse servers and classify using jq
    PAGE_LOCAL=$(echo "$RESPONSE" | jq '[.servers[] | select(.server.packages != null)] | length')
    PAGE_REMOTE=$(echo "$RESPONSE" | jq '[.servers[] | select(.server.remotes != null)] | length')

    LOCAL_COUNT=$((LOCAL_COUNT + PAGE_LOCAL))
    REMOTE_COUNT=$((REMOTE_COUNT + PAGE_REMOTE))

    # Check for next page
    NEXT_CURSOR=$(echo "$RESPONSE" | jq -r '.metadata.nextCursor // empty')

    if [ -z "$NEXT_CURSOR" ]; then
        break
    fi

    CURSOR="$NEXT_CURSOR"
done

TOTAL_COUNT=$((LOCAL_COUNT + REMOTE_COUNT))

# Append to CSV (create header if file doesn't exist)
mkdir -p data
if [ ! -f "data/snapshots.csv" ]; then
    echo "timestamp,total,local,remote" > data/snapshots.csv
fi

echo "$TIMESTAMP,$TOTAL_COUNT,$LOCAL_COUNT,$REMOTE_COUNT" >> data/snapshots.csv
```

**GitHub Actions Workflow** (`.github/workflows/aggregate-data.yml`):

```yaml
name: Aggregate MCP Server Data

on:
  schedule:
    - cron: '0 * * * *'  # Every hour on the hour
  workflow_dispatch:      # Allow manual trigger

jobs:
  aggregate:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run aggregation script
        run: bash scripts/aggregate-servers.sh

      - name: Commit updated data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/snapshots.csv
          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "Update server snapshots [$(date -u +'%Y-%m-%d %H:%M')]"
            git push
          fi
```

**Rationale for macOS Runner**: This is acceptable because:
- Actions run only hourly (720 times/month)
- macOS runners have bash and jq available by default
- curl and jq provide reliable JSON parsing and HTTP request handling

---

## 5. MCP Registry API Verification

**Date**: 2025-10-29 | **Status**: Verified Against Live API

### API Endpoint Discovery

**Endpoint**: `https://registry.modelcontextprotocol.io/v0/servers`

### Actual Response Structure

```json
{
  "servers": [
    {
      "server": {
        "$schema": "...",
        "name": "ai.example/server-name",
        "description": "...",
        "version": "1.0.0",
        "packages": [...],  // Optional - local servers
        "remotes": [...]    // Optional - remote servers
      },
      "_meta": {...}
    }
  ],
  "metadata": {
    "nextCursor": "eyJpZCI6..."  // Present if more pages exist
  }
}
```

### Key Findings

1. **Pagination Mechanism**: Uses `.metadata.nextCursor` (not `.cursor` as initially assumed)
2. **Page Size**: 30 servers per page (API-controlled, not configurable)
3. **Total Scale**: 1,427 servers across 48 pages (as of 2025-10-29)
4. **Cursor Format**: Base64-encoded string passed as query parameter `?cursor={value}`

### Classification Logic Verified

Tested against actual API responses:

```bash
# Classification counts from full pagination
Total servers: 1,427
├─ Local only (packages != null, remotes == null): 817 (57.2%)
├─ Remote only (packages == null, remotes != null): 513 (35.9%)
├─ Both (packages != null, remotes != null): 48 (3.4%)
└─ Neither (packages == null, remotes == null): 49 (3.4%)

# Aggregated counts (used in CSV)
Local total: 865 (817 + 48)
Remote total: 561 (513 + 48)
```

### Important Discovery: Overlapping Categories

**Initial Assumption**: Each server belongs to exactly one category (local OR remote)

**Reality**: Servers can have both `packages` and `remotes` properties

**Implication**: The CSV formula `local + remote >= total` is correct, not `local + remote = total`

**Example servers with both**:
- `ai.shawndurrani/mcp-merchant` - npm package + HTTP endpoint
- `co.pipeboard/meta-ads-mcp` - Docker image + SSE endpoint

### Script Corrections Applied

Original script incorrectly calculated:
```bash
TOTAL_COUNT=$((LOCAL_COUNT + REMOTE_COUNT))  # ❌ Wrong
```

Corrected to:
```bash
TOTAL_COUNT=$((TOTAL_COUNT + PAGE_TOTAL))  # ✅ Count unique servers
```

### Verification Scripts Created

1. **`scripts/verify-data.sh`** - Validates entire pipeline:
   - Fetches API data
   - Runs aggregation script
   - Compares CSV output with API counts

2. **`scripts/analyze-classification.sh`** - Deep analysis:
   - Fetches all servers via pagination
   - Classifies into 4 categories (local-only, remote-only, both, neither)
   - Validates classification math

Both scripts available for ongoing verification.

### Production Readiness Confirmation

✅ API structure documented
✅ Pagination logic verified
✅ Classification algorithm validated against 1,427 real servers
✅ CSV data matches API responses
✅ Edge cases discovered and handled (servers with both/neither properties)

---

## Technology Stack Summary

| Component | Choice | Bundle Impact | Justification |
|-----------|--------|---------------|---------------|
| Framework | Next.js 14 (App Router) | ~85KB | Static export, React ecosystem |
| UI Library | ShadCN UI | ~75KB (5 components) | User requirement, minimal footprint |
| Charts | Recharts | ~95KB | Best balance of DX and bundle size |
| CSV Parsing | Native JavaScript | 0KB | Constitution: prefer native |
| Testing | Vitest (dev only) | 0KB production | Data logic verification |
| Data Aggregation | Bash + GitHub Actions | N/A | Build-time processing |

**Total Bundle Size Estimate**: ~305KB gzipped (85% under 2MB budget)

---

## Remaining Decisions

1. **Color Theme**: Will use Tailwind CSS with custom purple/blue/pink palette (ShadCN includes Tailwind)
2. **Data Retention**: Keep all historical snapshots (CSV grows ~100 bytes/hour = ~900KB/year)
3. **Error Handling**: Graceful degradation if CSV missing or malformed (show empty state)

All NEEDS CLARIFICATION items from Technical Context are now resolved.
