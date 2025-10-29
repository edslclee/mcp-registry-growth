# Component Contract

**Purpose**: Define the interface and behavior for React components

## Component: `<TimeSeriesChart>`

**File**: `components/charts/time-series-chart.tsx`

### Props

```typescript
interface TimeSeriesChartProps {
  data: ChartDataPoint[];           // Pre-processed chart data
  title?: string;                   // Chart title (optional)
  loading?: boolean;                // Loading state (default: false)
  emptyMessage?: string;            // Message when data is empty
}
```

### Behavior

**Rendering**:
- Use Recharts `<ResponsiveContainer>` + `<LineChart>`
- X-axis: `date` field (formatted string)
- Y-axis: `count` field (numeric, auto-scaled)
- Line color: Purple (#a855f7) from theme
- Grid: Subtle dark theme grid
- Tooltip: Show `label` field from data point

**Responsive**:
- Container adapts to parent width (100%)
- Height: 400px on desktop, 300px on mobile (<640px)
- Font sizes scale with breakpoints

**Loading State**:
- When `loading={true}`: Show skeleton loader (ShadCN Skeleton component)
- Animation: Pulsing gray rectangle

**Empty State**:
- When `data.length === 0`: Show empty state message
- Default: "No data available"
- Custom via `emptyMessage` prop

### Usage Example

```tsx
<TimeSeriesChart
  data={chartData}
  title="MCP Server Growth"
  loading={false}
/>
```

### Accessibility

- Chart wrapped in `<figure>` with `<figcaption>` for title
- ARIA label: "Time series chart showing server counts"
- Tooltip accessible via keyboard navigation
- Color contrast: WCAG AA compliant (per SC-008)

---

## Component: `<ServerTypeFilter>`

**File**: `components/filters/server-type-filter.tsx`

### Props

```typescript
interface ServerTypeFilterProps {
  value: ServerType;                              // Current selection
  onChange: (newValue: ServerType) => void;       // Change handler
  disabled?: boolean;                             // Disable interaction
}
```

### Behavior

**UI**: ShadCN `<Select>` component with 3 options:
- "All Servers" → value: `'all'`
- "Local Servers" → value: `'local'`
- "Remote Servers" → value: `'remote'`

**Styling**:
- Dark theme (background: gray-900)
- Border: purple accent on focus
- Dropdown: Full-width on mobile, auto on desktop

**Interaction**:
- Click to open dropdown
- Select option to update
- Calls `onChange(newValue)` immediately
- Keyboard navigation: Arrow keys + Enter

### Usage Example

```tsx
const [serverType, setServerType] = useState<ServerType>('all');

<ServerTypeFilter value={serverType} onChange={setServerType} />
```

### Accessibility

- ARIA label: "Filter by server type"
- Keyboard navigable
- Focus indicator visible
- Announces selection to screen readers

---

## Component: `<GranularitySelector>`

**File**: `components/filters/granularity-selector.tsx`

### Props

```typescript
interface GranularitySelectorProps {
  value: Granularity;                             // Current selection
  onChange: (newValue: Granularity) => void;      // Change handler
  disabled?: boolean;                             // Disable interaction
}
```

### Behavior

**UI**: Button group with 4 options (ShadCN `<ToggleGroup>`):
- "Hourly" → value: `'hourly'`
- "Daily" → value: `'daily'`
- "Weekly" → value: `'weekly'`
- "Monthly" → value: `'monthly'`

**Styling**:
- Active button: Purple background (#a855f7)
- Inactive: Gray with hover state
- Mobile: Stack vertically (<640px)
- Desktop: Horizontal row

**Interaction**:
- Click to toggle selection
- Calls `onChange(newValue)` immediately
- Only one option selected at a time

### Usage Example

```tsx
const [granularity, setGranularity] = useState<Granularity>('hourly');

<GranularitySelector value={granularity} onChange={setGranularity} />
```

### Accessibility

- ARIA role: "radiogroup"
- Each button: role="radio"
- Keyboard navigation: Arrow keys
- Announces current selection

---

## Component: `<Nav>`

**File**: `components/navigation/nav.tsx`

### Props

```typescript
interface NavProps {
  currentPath: string;  // Current route (e.g., "/" or "/about")
}
```

### Behavior

**UI**: Horizontal navigation bar with 2 links:
- "Dashboard" → href: `/`
- "About" → href: `/about`

**Styling**:
- Fixed at top (sticky header)
- Dark background (gray-900)
- Active link: Purple underline
- Hover: Text color lightens

**Responsive**:
- Desktop: Links spaced evenly
- Mobile: Hamburger menu (optional, or keep horizontal if space allows)

**Active State**:
- Compare `currentPath` with link href
- Add active class/styling when matched

### Usage Example

```tsx
<Nav currentPath="/" />
```

### Accessibility

- Semantic `<nav>` element
- ARIA label: "Main navigation"
- Links keyboard navigable
- Active link announced to screen readers

---

## Layout: `app/layout.tsx`

### Purpose

Root layout providing:
- Dark theme via Tailwind CSS classes
- Global styles (purple/blue/pink color scheme)
- Font configuration
- Navigation component
- Metadata

### Structure

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100">
        <Nav currentPath="..." />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### Theme Configuration

**Tailwind Config** (`tailwind.config.ts`):
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#a855f7',  // Purple
        light: '#c084fc',
        dark: '#7e22ce'
      },
      accent: {
        blue: '#3b82f6',     // Blue
        pink: '#ec4899'      // Pink
      }
    }
  }
}
```

**Global CSS** (`app/globals.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-950 text-gray-100;
  }
}
```

---

## Page: `app/page.tsx` (Dashboard)

### Purpose

Main dashboard page displaying charts with filters.

### Structure

```tsx
import { loadSnapshots } from '@/lib/data-loader';
import { Dashboard } from '@/components/dashboard';

export default function DashboardPage() {
  const timeSeries = loadSnapshots();  // Build-time

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">MCP Server Analytics</h1>
      <Dashboard initialData={timeSeries} />
    </div>
  );
}
```

### Metadata

```typescript
export const metadata = {
  title: 'MCP Server Analytics Dashboard',
  description: 'Track MCP server ecosystem growth and adoption trends'
};
```

---

## Page: `app/about/page.tsx` (About)

### Purpose

Information page about the dashboard, data sources, and methodology.

### Content Structure

```tsx
export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-3xl mx-auto">
      <h1>About</h1>

      <section>
        <h2>What is this dashboard?</h2>
        <p>
          The MCP Server Analytics Dashboard tracks the growth and adoption of
          servers in the Model Context Protocol ecosystem.
        </p>
      </section>

      <section>
        <h2>Data Source</h2>
        <p>
          Data is fetched hourly from the official MCP Registry API at
          <code>https://registry.modelcontextprotocol.io/v0/servers</code>.
        </p>
      </section>

      <section>
        <h2>Server Classification</h2>
        <ul>
          <li><strong>Local servers</strong>: Have a <code>packages</code> property</li>
          <li><strong>Remote servers</strong>: Have a <code>remotes</code> property</li>
          <li>Servers can be both local and remote if they have both properties</li>
        </ul>
      </section>

      <section>
        <h2>Update Frequency</h2>
        <p>
          Snapshots are captured every hour via GitHub Actions. The site is
          rebuilt and redeployed after each data update.
        </p>
      </section>

      <section>
        <h2>Granularity Options</h2>
        <p>
          You can view data at different time scales:
        </p>
        <ul>
          <li><strong>Hourly</strong>: Raw snapshot data (default)</li>
          <li><strong>Daily</strong>: Latest snapshot of each day</li>
          <li><strong>Weekly</strong>: Latest snapshot of each week</li>
          <li><strong>Monthly</strong>: Latest snapshot of each month</li>
        </ul>
      </section>
    </div>
  );
}
```

### Metadata

```typescript
export const metadata = {
  title: 'About | MCP Server Analytics Dashboard',
  description: 'Learn about the MCP Server Analytics Dashboard data sources and methodology'
};
```

---

## Component Testing Checklist

### `<TimeSeriesChart>`
- [ ] Renders correctly with valid data
- [ ] Shows empty state when data is empty
- [ ] Shows loading skeleton when loading={true}
- [ ] Responsive on mobile (300px height)
- [ ] Responsive on desktop (400px height)
- [ ] Tooltip displays correct label
- [ ] Color contrast passes WCAG AA

### `<ServerTypeFilter>`
- [ ] Shows all 3 options (all, local, remote)
- [ ] Calls onChange when selection changes
- [ ] Displays current value correctly
- [ ] Keyboard navigable
- [ ] ARIA labels present

### `<GranularitySelector>`
- [ ] Shows all 4 options (hourly, daily, weekly, monthly)
- [ ] Calls onChange when selection changes
- [ ] Visual active state for selected option
- [ ] Stacks vertically on mobile
- [ ] Keyboard navigable

### `<Nav>`
- [ ] Shows Dashboard and About links
- [ ] Highlights active link
- [ ] Links navigate correctly
- [ ] Sticky at top of page
- [ ] Responsive on mobile

---

## Performance Requirements

| Component | First Paint | Interaction Response |
|-----------|-------------|---------------------|
| `<TimeSeriesChart>` | <500ms | <100ms (tooltip) |
| `<ServerTypeFilter>` | <100ms | <50ms (selection) |
| `<GranularitySelector>` | <100ms | <50ms (selection) |
| `<Nav>` | <50ms | <30ms (navigation) |

All components must meet these targets to satisfy SC-001 (3 second page load) and SC-003/SC-004 (filter/granularity response times).
