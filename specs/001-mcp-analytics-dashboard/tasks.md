# Tasks: MCP Server Analytics Dashboard

**Input**: Design documents from `/specs/001-mcp-analytics-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL per spec - not requested, so no test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/`, `components/`, `lib/` at repository root
- Paths shown below match plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js project with TypeScript, Tailwind CSS, and App Router
- [ ] T002 Configure Next.js for static export in next.config.js (output: 'export')
- [ ] T003 [P] Install and initialize ShadCN UI (shadcn-ui init)
- [ ] T004 [P] Install Recharts and types (npm install recharts)
- [ ] T005 [P] Create directory structure (app/, components/, lib/, scripts/, data/, .github/workflows/)
- [ ] T006 [P] Configure Tailwind with dark theme colors in tailwind.config.ts (purple/blue/pink)
- [ ] T007 [P] Set up global styles with dark theme in app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create TypeScript types in lib/types.ts (Snapshot, TimeSeries, ServerType, Granularity, ChartDataPoint, FilterState)
- [ ] T009 Create bash aggregation script in scripts/aggregate-servers.sh (fetch MCP Registry API with pagination, classify local/remote, append to CSV)
- [ ] T010 Create GitHub Actions workflow in .github/workflows/aggregate-data.yml (hourly cron on macos-latest runner)
- [ ] T011 Create initial empty CSV file with header in data/snapshots.csv (timestamp,total,local,remote)
- [ ] T012 Test aggregation script locally to verify CSV generation (bash scripts/aggregate-servers.sh)
- [ ] T013 Install ShadCN UI components needed (button, card, select, skeleton): npx shadcn-ui add button card select skeleton
- [ ] T014 Create root layout in app/layout.tsx (dark theme HTML class, Inter font, container structure)
- [ ] T015 Create navigation component in components/navigation/nav.tsx (Dashboard and About links)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Server Analytics Overview (Priority: P1) 🎯 MVP

**Goal**: Display time-series charts showing MCP server counts with dark theme and default hourly granularity

**Independent Test**: Load dashboard and verify time-series chart displays with dates on X-axis, counts on Y-axis, dark purple/blue/pink theme, hourly granularity by default

### Data Layer

- [ ] T016 [P] [US1] Create data loader in lib/data-loader.ts (read CSV, parse to Snapshot[], validate format, handle errors)
- [ ] T017 [P] [US1] Create data aggregator in lib/data-aggregator.ts (aggregate snapshots by granularity, filter by server type)

### UI Components

- [ ] T018 [P] [US1] Create time-series chart component in components/charts/time-series-chart.tsx (Recharts LineChart, responsive, UTC timestamps, purple/blue/pink colors)
- [ ] T019 [P] [US1] Create dashboard client component in components/dashboard/dashboard-client.tsx (loads data, renders charts, manages state)

### Pages

- [ ] T020 [US1] Create main dashboard page in app/page.tsx (static props with CSV data, renders dashboard-client component)

### Integration & Validation

- [ ] T021 [US1] Verify dark theme applies across dashboard (purple/blue/pink color scheme per Tailwind config)
- [ ] T022 [US1] Verify hourly granularity displays by default (FR-007)
- [ ] T023 [US1] Verify UTC timestamps display correctly (FR-016)
- [ ] T024 [US1] Verify page loads within 3 seconds (SC-001)
- [ ] T025 [US1] Verify responsive layout 320px-4K (SC-002, FR-015)

**Checkpoint**: User Story 1 complete and independently testable

---

## Phase 4: User Story 2 - Filter by Server Type (Priority: P2)

**Goal**: Add filtering UI to show All/Local/Remote servers and update charts accordingly

**Independent Test**: Select each filter option and verify charts update to show only selected server type

**Dependencies**: US1 must be complete (needs charts and data infrastructure)

### UI Components

- [ ] T026 [P] [US2] Create server type filter component in components/filters/server-type-filter.tsx (All/Local/Remote selector using ShadCN Select)
- [ ] T027 [US2] Integrate filter into dashboard-client component (manage serverType state, pass to data aggregator)

### Integration & Validation

- [ ] T028 [US2] Verify "Local servers" filter shows only local metrics (Acceptance Scenario 1)
- [ ] T029 [US2] Verify "Remote servers" filter shows only remote metrics (Acceptance Scenario 2)
- [ ] T030 [US2] Verify "All servers" filter shows combined metrics (Acceptance Scenario 3)
- [ ] T031 [US2] Verify filter changes update smoothly without page reload (Acceptance Scenario 4, SC-003 <1 second)

**Checkpoint**: User Story 2 complete and independently testable

---

## Phase 5: User Story 3 - Adjust Time Granularity (Priority: P3)

**Goal**: Add granularity selector (Hourly/Daily/Weekly/Monthly) and aggregate data accordingly

**Independent Test**: Switch between granularity options and verify chart X-axis and data aggregation update

**Dependencies**: US1 must be complete (needs data aggregator)

### UI Components

- [ ] T032 [P] [US3] Create granularity selector component in components/filters/granularity-selector.tsx (Hourly/Daily/Weekly/Monthly using ShadCN Select)
- [ ] T033 [US3] Enhance data aggregator to support all granularities (daily, weekly, monthly aggregation logic using latest snapshot per period)

### Integration

- [ ] T034 [US3] Integrate granularity selector into dashboard-client component (manage granularity state, pass to data aggregator)

### Validation

- [ ] T035 [US3] Verify daily granularity aggregates to one point per day (Acceptance Scenario 1)
- [ ] T036 [US3] Verify weekly granularity aggregates to one point per week (Acceptance Scenario 2)
- [ ] T037 [US3] Verify monthly granularity aggregates to one point per month (Acceptance Scenario 3)
- [ ] T038 [US3] Verify granularity respects active filter (Acceptance Scenario 4)
- [ ] T039 [US3] Verify smooth transitions between granularities (Acceptance Scenario 5, SC-004 <2 seconds)

**Checkpoint**: User Story 3 complete and independently testable

---

## Phase 6: User Story 4 - Learn About the Dashboard (Priority: P4)

**Goal**: Create About page with dashboard information and navigation

**Independent Test**: Navigate to About page and verify it contains information about data source, update frequency, and metrics

**Dependencies**: US1 must be complete (needs navigation component from Foundation)

### Pages

- [ ] T040 [P] [US4] Create About page in app/about/page.tsx (MCP Registry API description, hourly updates, metric definitions, navigation back to dashboard)

### Content

- [ ] T041 [US4] Add content to About page (data source explanation, update frequency, local vs remote server definitions, timestamp timezone note)

### Validation

- [ ] T042 [US4] Verify clicking "About" navigates to About page (Acceptance Scenario 1)
- [ ] T043 [US4] Verify About page explains data source and update frequency (Acceptance Scenario 2)
- [ ] T044 [US4] Verify navigation back to dashboard works (Acceptance Scenario 3)
- [ ] T045 [US4] Verify navigation is consistent on both pages (Acceptance Scenario 4)

**Checkpoint**: User Story 4 complete and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and edge cases not tied to specific user stories

### Error Handling (from Clarifications)

- [ ] T046 [P] Add error boundary for graceful error display in app/layout.tsx
- [ ] T047 [P] Implement cached data with warning banner when CSV load fails (FR-013)
- [ ] T048 [P] Implement empty state message "No data available for this time range" when chart has no data (FR-017)

### Performance & Accessibility

- [ ] T049 [P] Add loading skeleton states for charts using ShadCN Skeleton component (FR-014)
- [ ] T050 [P] Verify bundle size <2MB after build (SC-007)
- [ ] T051 [P] Run accessibility audit with axe DevTools for WCAG AA dark theme contrast (SC-008)

### GitHub Actions Integration

- [ ] T052 Trigger manual GitHub Actions workflow run to test hourly data collection
- [ ] T053 Verify CSV updates commit and push correctly to repository
- [ ] T054 Verify new data reflects in dashboard after rebuild

---

## Dependencies & Execution Strategy

### Story Completion Order

```
Phase 1 (Setup) ────────────────────────────┐
                                            │
Phase 2 (Foundation) ───────────────────────┤
                                            ▼
Phase 3 (US1: View Analytics) ──────────────┤
                                            │
         ┌──────────────────────────────────┘
         │
         ├─► Phase 4 (US2: Filter) ──────► Requires US1
         │
         ├─► Phase 5 (US3: Granularity) ──► Requires US1
         │
         └─► Phase 6 (US4: About) ─────────► Requires US1 (navigation)

Phase 7 (Polish) ───────────────────────────► Can run after any story
```

### Parallel Opportunities by Phase

**Phase 1 (Setup)**: T003, T004, T005, T006, T007 can run in parallel (5 tasks)

**Phase 2 (Foundation)**: T013, T014, T015 can run in parallel after T008-T012 complete (3 tasks)

**Phase 3 (US1)**: T016, T017, T018, T019 can run in parallel (4 tasks)

**Phase 4 (US2)**: T026 can run in parallel with T027 prep work (1 task)

**Phase 5 (US3)**: T032, T033 can run in parallel (2 tasks)

**Phase 6 (US4)**: T040, T041 can run in parallel (2 tasks)

**Phase 7 (Polish)**: T046, T047, T048, T049, T050, T051 can all run in parallel (6 tasks)

**Total Parallel Opportunities**: ~23 tasks can be parallelized

### MVP Scope Recommendation

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3 (US1 only)

This delivers:
- Functional dashboard with time-series charts
- Dark theme with purple/blue/pink colors
- Hourly granularity by default
- UTC timestamps
- Automated data collection via GitHub Actions
- Static site deployment ready

**Tasks**: T001-T025 (25 tasks)
**Value**: Core visualization capability - users can see MCP server growth trends

**Incremental Delivery After MVP**:
1. **+US2 (Filter)**: T026-T031 (6 tasks) - Adds local vs remote comparison
2. **+US3 (Granularity)**: T032-T039 (8 tasks) - Adds time-scale analysis
3. **+US4 (About)**: T040-T045 (6 tasks) - Adds context/documentation
4. **+Polish**: T046-T054 (9 tasks) - Hardening and edge cases

---

## Implementation Notes

### Task Execution Tips

- **Commit Strategy**: Commit after each task or logical group
- **Testing at Checkpoints**: Stop at each checkpoint to validate story independently
- **Foundational Phase**: Critical - blocks all user story work until complete

### Technology-Specific Notes

- **Next.js App Router**: Use `app/` directory structure, all pages are React Server Components by default
- **Static Export**: CSV data embedded at build time via `fs.readFileSync` in page components
- **ShadCN UI**: Components are copy-pasted, not npm installed - customize as needed
- **Recharts**: Fully client-side, mark components with `"use client"` directive
- **GitHub Actions**: Uses macos-latest runner with bash script (curl + jq)
- **Bash Script**: Requires chmod +x on scripts/aggregate-servers.sh

### Success Criteria Mapping

| Success Criterion | Validation Task |
|-------------------|-----------------|
| SC-001: Page load <3s | T024 |
| SC-002: Responsive 320px-4K | T025 |
| SC-003: Filter change <1s | T031 |
| SC-004: Granularity change <2s | T039 |
| SC-007: Bundle size <2MB | T050 |
| SC-008: WCAG AA contrast | T051 |

---

## Summary

- **Total Tasks**: 54
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 8 tasks
- **User Story 1 (P1)**: 10 tasks 🎯 MVP
- **User Story 2 (P2)**: 6 tasks
- **User Story 3 (P3)**: 8 tasks
- **User Story 4 (P4)**: 6 tasks
- **Polish Phase**: 9 tasks

- **Parallel Opportunities**: ~23 tasks (42%)
- **MVP Scope**: 25 tasks (Setup + Foundation + US1)
- **Independent Stories**: Each user story can be tested independently after US1

**Suggested First Steps**: Execute Phase 1 and Phase 2 sequentially, then begin Phase 3 (US1) for MVP delivery.
