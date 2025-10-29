<!--
Sync Impact Report
==================
Version Change: N/A → 1.0.0
Rationale: Initial constitution ratification with core architectural principles

Modified Principles:
- N/A (Initial version)

Added Sections:
- Core Principles (3 principles defined)
- Governance

Removed Sections:
- N/A

Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md - Constitution Check section compatible
- ✅ .specify/templates/spec-template.md - No updates required (specification-focused)
- ✅ .specify/templates/tasks-template.md - No updates required (task organization-focused)

Follow-up TODOs:
- None
-->

# MCP Registry Growth Constitution

## Core Principles

### I. Static Site

The MCP Registry Growth project MUST be delivered as a static website with no server-side runtime dependencies.

**Rationale**: Static sites provide maximum reliability, security, and performance with minimal operational overhead. They can be hosted on any static hosting platform, cached effectively via CDN, and require no server maintenance or scaling concerns.

**Requirements**:
- All content MUST be generated at build time
- No server-side processing or APIs required at runtime
- Site MUST be deployable to any static hosting service (GitHub Pages, Netlify, Vercel, S3, etc.)
- Dynamic behavior, if needed, MUST use client-side JavaScript only

### II. Responsive Design

The website MUST provide an optimal viewing and interaction experience across all device sizes and screen resolutions.

**Rationale**: Users access web content from diverse devices (mobile phones, tablets, desktops, large displays). A responsive design ensures accessibility and usability for all users regardless of their device.

**Requirements**:
- Layout MUST adapt fluidly to viewport sizes from 320px to 4K displays
- Touch targets MUST be appropriately sized for mobile devices (minimum 44×44px)
- Typography MUST scale appropriately across breakpoints
- Navigation MUST be usable on both touch and pointer devices
- Content MUST remain readable without horizontal scrolling on any device

### III. Minimal Dependencies

External dependencies MUST be avoided unless they provide clear, justified value that outweighs the cost of added complexity, maintenance burden, and security surface.

**Rationale**: Every dependency introduces risk (security vulnerabilities, breaking changes, maintenance overhead, bundle size). By default, prefer vanilla solutions and standard web platform features.

**Requirements**:
- Dependency addition MUST be explicitly justified with:
  - Problem statement (what vanilla solution cannot achieve)
  - Value assessment (time saved, capability enabled, complexity reduced)
  - Risk evaluation (maintenance status, security track record, bundle impact)
- Standard web APIs MUST be preferred over libraries when feasible
- Build tools MUST be minimal and widely-adopted
- Transitive dependencies MUST be reviewed and counted in the total dependency budget

**Complexity Justification Process**: When a dependency is proposed:
1. Document the problem clearly
2. Attempt a vanilla/standard solution first
3. If impossible or unreasonably complex, document why
4. Evaluate 2-3 dependency alternatives
5. Choose the most lightweight, well-maintained option
6. Document the decision in the project

## Governance

**Authority**: This constitution supersedes all other development practices and guidelines. All feature specifications, implementation plans, and code reviews MUST verify compliance with these principles.

**Amendments**: Changes to this constitution require:
1. Clear documentation of why the current principle is insufficient
2. Proposal of the amended or new principle
3. Impact analysis on existing features and templates
4. Approval before adoption
5. Version increment per semantic versioning rules

**Compliance Review**: Every design artifact (spec.md, plan.md, tasks.md) MUST include a "Constitution Check" section that explicitly verifies alignment with these principles. Violations MUST be justified with clear reasoning and documented alternatives that were rejected.

**Version**: 1.0.0 | **Ratified**: 2025-10-28 | **Last Amended**: 2025-10-28

