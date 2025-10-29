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
- [ ] T004 [P] Install Recharts and types (npm install recharts @types/recharts)
- [ ] T005 [P] Create directory structure (app/, components/, lib/, scripts/, data/, .github/workflows/)
- [ ] T006 [P] Configure Tailwind with dark theme colors in tailwind.config.ts (purple/blue/pink)
- [ ] T007 [P] Set up global styles with dark theme in app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create TypeScript types in lib/types.ts (Snapshot, TimeSeries, ServerType, Granularity, ChartDataPoint, FilterState)
- [ ] T009 Create PowerShell aggregation script in scripts/aggregate-servers.ps1 (fetch MCP Registry API with pagination, classify local/remote, append to CSV)
- [ ] T010 Create GitHub Actions workflow in .github/workflows/aggregate-data.yml (hourly cron on windows-latest runner)
- [ ] T011 Create initial empty CSV file with header in data/snapshots.csv (timestamp,total,local,remote)
- [ ] T012 Test aggregation script locally to verify CSV generation (pwsh scripts/aggregate-servers.ps1)
- [ ] T013 Install ShadCN UI components needed (button, card, select, skeleton): npx shadcn-ui add button card select skeleton
- [ ] T014 Create root layout in app/layout.tsx (dark theme HTML class, Inter font, container structure)
- [ ] T015 Create navigation component in components/navigation/nav.tsx (Dashboard and About links)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Server Analytics Overview (Priority: P1) 🎯 MVP

**Goal**: Display time-series charts showing MCP server counts with dark theme and default hourly granularity

**Independent Test**: Load dashboard and verify time-series chart displays with dates on X-axis, counts on Y-axis, dark purple/blue/pink theme, hourly granularity by default

### Implementation for User Story 1

- [ ] T016 [P] [US1] Implement CSV parsing function in lib/data-loader.ts (parseCSV with native split/map, validation)
- [ ] T017 [P] [US1] Implement loadSnapshots function in lib/data-loader.ts (read CSV file, parse, return TimeSeries)
- [ ] T018 [US1] Implement aggregateByGranularity function in lib/data-aggregator.ts (group by hour/day/week/month, return latest snapshot per bucket)
- [ ] T019 [US1] Implement toChartData function in lib/data-aggregator.ts (convert Snapshot[] to ChartDataPoint[], format dates, extract counts)
- [ ] T020 [US1] Create TimeSeriesChart component in components/charts/time-series-chart.tsx (Recharts LineChart with ResponsiveContainer, purple line, dark grid, tooltip)
- [ ] T021 [US1] Create Dashboard page in app/page.tsx (call loadSnapshots at build time, pass data to components, display with hourly default)
- [ ] T022 [US1] Style TimeSeriesChart with dark theme (gray-900 background, purple line color, responsive height)
- [ ] T023 [US1] Add empty state handling to TimeSeriesChart (show message when data.length === 0)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Filter by Server Type (Priority: P2)

**Goal**: Add filter controls to toggle between All/Local/Remote servers and update charts accordingly

**Independent Test**: Click Local/Remote/All filter options and verify charts update to show only selected server type metrics

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create ServerTypeFilter component in components/filters/server-type-filter.tsx (ShadCN Select with All/Local/Remote options)
- [ ] T025 [US2] Implement filterByServerType function in lib/data-aggregator.ts (transform snapshots to use correct count field based on serverType)
- [ ] T026 [US2] Add serverType state to Dashboard page in app/page.tsx (useState hook, default 'all')
- [ ] T027 [US2] Integrate ServerTypeFilter into Dashboard page (pass value and onChange handler)
- [ ] T028 [US2] Wire filterByServerType into data transformation pipeline in app/page.tsx (apply before toChartData)
- [ ] T029 [US2] Style ServerTypeFilter with dark theme (match navigation colors, focus states)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Adjust Time Granularity (Priority: P3)

**Goal**: Add granularity selector to switch between hourly/daily/weekly/monthly views and re-aggregate data

**Independent Test**: Click Hourly/Daily/Weekly/Monthly buttons and verify chart X-axis and data aggregation update correctly

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create GranularitySelector component in components/filters/granularity-selector.tsx (4 buttons with toggle group, active state styling)
- [ ] T031 [US3] Add granularity state to Dashboard page in app/page.tsx (useState hook, default 'hourly')
- [ ] T032 [US3] Integrate GranularitySelector into Dashboard page (pass value and onChange handler)
- [ ] T033 [US3] Wire aggregateByGranularity into data transformation pipeline in app/page.tsx (apply before filterByServerType)
- [ ] T034 [US3] Update toChartData date formatting logic in lib/data-aggregator.ts (format dates based on granularity: hourly="Oct 28, 14:00", daily="Oct 28", etc.)
- [ ] T035 [US3] Style GranularitySelector with dark theme (purple active button, responsive mobile stack)
- [ ] T036 [US3] Add smooth transition handling for granularity changes (ensure chart re-renders cleanly)

**Checkpoint**: All core user stories (US1, US2, US3) should now be independently functional

---

## Phase 6: User Story 4 - Learn About the Dashboard (Priority: P4)

**Goal**: Create About page with documentation about data sources, update frequency, and methodology

**Independent Test**: Navigate to About page and verify it contains clear information about MCP Registry API, server classification, and update schedule

### Implementation for User Story 4

- [ ] T037 [US4] Create About page in app/about/page.tsx (prose content with dark theme styling)
- [ ] T038 [US4] Write About page content sections (What is this dashboard, Data Source, Server Classification, Update Frequency, Granularity Options)
- [ ] T039 [US4] Style About page with Tailwind prose-invert for dark theme readability
- [ ] T040 [US4] Add metadata to About page (title, description)
- [ ] T041 [US4] Verify navigation links work bidirectionally (Dashboard ↔ About)

**Checkpoint**: All user stories should now be independently functional with full navigation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T042 [P] Add page metadata to Dashboard page in app/page.tsx (title, description)
- [ ] T043 [P] Implement responsive design testing for mobile (320px), tablet (768px), desktop (1024px+), 4K (2560px+)
- [ ] T044 [P] Add loading skeleton to TimeSeriesChart component (ShadCN Skeleton during data load)
- [ ] T045 [P] Implement error handling for missing CSV file in lib/data-loader.ts (return empty TimeSeries, log warning)
- [ ] T046 [P] Add ARIA labels and keyboard navigation to all interactive components (filters, navigation)
- [ ] T047 [P] Verify WCAG AA color contrast for dark theme (purple/blue/pink on dark backgrounds)
- [ ] T048 Test static build generation (npm run build, verify out/ directory contains static files)
- [ ] T049 [P] Optimize bundle size (analyze with next/bundle-analyzer, verify <305KB gzipped)
- [ ] T050 [P] Add .gitignore entry for /out directory
- [ ] T051 Test GitHub Actions workflow (manual trigger, verify CSV updates and commits)
- [ ] T052 Verify deployment to static hosting (test on Vercel/Netlify/GitHub Pages)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable (uses same chart, adds filter)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1/US2 but independently testable (adds granularity control)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories (separate About page)

### Within Each User Story

- Models/Types before services (T016-T017 before T018-T019)
- Services before components (T018-T019 before T020)
- Components before pages (T020 before T021)
- Core implementation before styling (T021 before T022)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T006, T007)
- Within User Story 1: T016 and T017 can run in parallel (different functions, same file scope ok)
- Within User Story 2: T024 and T025 can run in parallel (different files)
- Within User Story 3: T030 can start as soon as T024 is complete (similar component pattern)
- User Story 4 can run completely in parallel with US2 and US3 (separate page, no shared code)
- All Polish tasks marked [P] can run in parallel (T042-T047, T049-T050)

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes:

# Launch data processing in parallel:
Task: "Implement CSV parsing function in lib/data-loader.ts"
Task: "Implement loadSnapshots function in lib/data-loader.ts"

# Then services (depends on data loading):
Task: "Implement aggregateByGranularity function in lib/data-aggregator.ts"
Task: "Implement toChartData function in lib/data-aggregator.ts"

# Then UI components and pages (depends on services):
Task: "Create TimeSeriesChart component"
Task: "Create Dashboard page"
```

---

## Parallel Example: Multiple User Stories

```bash
# After Foundational phase completes, with multiple developers:

# Developer A: User Story 1 (P1 - MVP)
Task: "T016-T023 (implement core dashboard with charts)"

# Developer B: User Story 4 (P4 - independent About page)
Task: "T037-T041 (create About page, no dependencies on US1)"

# Once US1 complete:
# Developer A: User Story 2 (P2 - add filtering)
Task: "T024-T029 (add server type filter)"

# Developer B: User Story 3 (P3 - add granularity)
Task: "T030-T036 (add granularity selector)"
# Note: US2 and US3 can proceed in parallel if separate developers
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T015) - **CRITICAL BLOCKING PHASE**
3. Complete Phase 3: User Story 1 (T016-T023)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Load dashboard
   - Verify chart displays with hourly data
   - Check dark theme with purple/blue/pink colors
   - Verify responsive design
5. Deploy/demo if ready (minimal viable product)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T016-T023) → Test independently → Deploy/Demo (MVP! 🎯)
3. Add User Story 2 (T024-T029) → Test independently → Deploy/Demo (filtering added)
4. Add User Story 3 (T030-T036) → Test independently → Deploy/Demo (granularity added)
5. Add User Story 4 (T037-T041) → Test independently → Deploy/Demo (documentation added)
6. Add Polish (T042-T052) → Final QA → Production deploy
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T015)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T016-T023) - Core charts
   - Developer B: User Story 4 (T037-T041) - About page (no dependencies on US1)
3. **After US1 complete**:
   - Developer A: User Story 2 (T024-T029) - Filtering
   - Developer B: User Story 3 (T030-T036) - Granularity
   - (US2 and US3 touch same Dashboard page but different sections, can proceed in parallel with coordination)
4. **All stories complete**: Both developers tackle Polish tasks in parallel (T042-T052)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Foundational phase (T008-T015) is **CRITICAL** - blocks all user story work
- GitHub Actions workflow (T010) uses Windows runner with PowerShell script
- PowerShell script (T009) uses Invoke-RestMethod for JSON parsing (no external tools needed)
- Tests not included per spec (not requested in requirements)
- Total: 52 tasks across 7 phases
- MVP scope: 23 tasks (Setup + Foundational + US1)
- Parallel opportunities: ~15 tasks can run concurrently with proper staffing

---

## Task Count by Phase

| Phase | Task Range | Count | Type |
|-------|------------|-------|------|
| Setup | T001-T007 | 7 | Infrastructure |
| Foundational | T008-T015 | 8 | **BLOCKING** |
| User Story 1 (P1) | T016-T023 | 8 | MVP Core |
| User Story 2 (P2) | T024-T029 | 6 | Feature Add |
| User Story 3 (P3) | T030-T036 | 7 | Feature Add |
| User Story 4 (P4) | T037-T041 | 5 | Documentation |
| Polish | T042-T052 | 11 | Cross-cutting |
| **TOTAL** | T001-T052 | **52** | |

---

## Success Criteria Mapping

| Success Criterion | Related Tasks | Validation Method |
|-------------------|---------------|-------------------|
| SC-001: Page load <3s | T021, T048, T049 | Lighthouse audit |
| SC-002: Responsive 320px-4K | T006, T043, T047 | Manual testing across breakpoints |
| SC-003: Filter changes <1s | T028, T033 | Browser DevTools performance |
| SC-004: Granularity <2s | T033, T034 | Browser DevTools performance |
| SC-005: Understand in 10s | T020, T021, T022 | User testing |
| SC-006: 1000+ snapshots | T016, T017, T019 | Load testing with sample data |
| SC-007: Bundle <2MB | T049 | next/bundle-analyzer |
| SC-008: WCAG AA contrast | T047 | axe DevTools audit |

---

## PowerShell Script Details (T009)

The PowerShell aggregation script uses:
- `Invoke-RestMethod` for API calls (built-in JSON parsing)
- `Where-Object` for filtering servers by packages/remotes
- `Out-File` with UTF-8 encoding for CSV generation
- No external dependencies (no jq needed)
- Runs on GitHub Actions windows-latest runner

**Key differences from bash**:
- No `chmod +x` needed (Windows doesn't require executable bit)
- Uses `pwsh` instead of `bash` in GitHub Actions
- PowerShell Core available by default on Windows runners

---

## Suggested First Steps

1. **Run T001**: Initialize Next.js project with TypeScript
2. **Run T002-T007 in parallel**: Configure build settings, install dependencies, set up theme
3. **Run T008-T015**: Complete foundational phase (CRITICAL - blocks everything else)
4. **Test foundation**: Run `npm run dev`, verify empty app runs with dark theme
5. **Run T016-T023 (User Story 1)**: Implement MVP dashboard with charts
6. **Validate MVP**: Load dashboard, verify chart displays, check theme
7. **Deploy MVP** or continue to User Story 2

Good luck! 🚀
