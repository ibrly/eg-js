---
description: Split a tech design into a refined ticket table, resolve ambiguity from the codebase, then create Jira tickets after dev review
argument-hint: <tech-design-url-or-id>
---

You are refining the tech design at: **$ARGUMENTS** into ready-to-work Jira tickets.

Read `.claude/workflow-config.md` first for project facts.

## Phase 1 — Read the design

1. Resolve $ARGUMENTS to a Confluence page ID and fetch with `mcp__atlassian__getConfluencePage`.
2. Confirm it's a tech design (has Architecture decisions, Data model, etc.). If not, stop.
3. Capture the tech design's `parentId` from the response — Phase 6 uses it so the refinement page sits as a sibling of the tech design (e.g. inside the same "Feature X" folder), not as its child.
4. **Capture every external reference URL** from the tech design's "Source" block (Figma / Sketch / mockup / related-doc links). These must appear (a) in the refinement page header in Phase 4, and (b) in every Jira ticket description in Phase 7. If the tech design is missing design links and the feature is visual, ask the user for them before proceeding — do not silently drop them.

## Phase 2 — Decompose into tickets

Split the design into discrete, parallelizable tickets. Each ticket must be:
- **Independent** — implementable without waiting on another in-progress ticket (or with the dependency clearly stated)
- **Right-sized** — 0.5–2 days of work. Anything bigger should be split.
- **Vertical** — delivers something testable end-to-end where possible. Don't split "DB → API → UI" into separate tickets unless they truly can ship independently.

For each ticket, define:
- **Title** — short, action-oriented. Format: `<verb> <object>` (e.g. "Add bookmark toggle to article header").
- **Description** — one paragraph: what and why, linking to the tech design section.
- **Acceptance criteria** — Gherkin-style or checklist. Specific and testable.
- **Files in scope** — paths from the tech design.
- **Dependencies** — other ticket titles it blocks/is blocked by, or "None".
- **Estimated size** — XS / S / M (no L — split it).
- **Open questions** — what's still ambiguous?

## Phase 3 — Resolve ambiguity

For every open question on every ticket:

1. Try to answer it from the codebase (grep, read files, check existing patterns).
2. If you can answer: replace the question with the answer, cite the file/line you used.
3. If you can't: leave it as a question with a clear note about why (e.g. "depends on business decision: which view is the source of truth?").

By the end of this phase, the only remaining open questions should require human input.

## Phase 4 — Render the refinement table

Create a Confluence page with:
- **Title**: `[Refinement] <feature name>` (derive from tech design title)
- **Body**:
  - **Source block at top** — link back to the tech design AND every design / external reference URL captured in Phase 1 (Figma etc.).
  - **Tickets table** with columns: `# | Title | Description | Acceptance Criteria | Story Points`. Files in scope, Dependencies, and Size go inside the Description cell as labelled bullets (`**Files:** ...`, `**Dependencies:** ...`, `**Size:** XS/S/M`). Story Points stays empty for refinement to fill in.
  - **Resolved questions** section: list of `Q → A → source`
  - **Outstanding questions** section: bulleted list of what still needs human input

Show the rendered table to the user in chat. Wait for review.

## Phase 5 — Dev review pause

Stop. The dev should:
- Confirm the decomposition (right number of tickets, right boundaries)
- Resolve outstanding questions
- Approve the page before publication

Do not publish or create Jira tickets without explicit approval.

## Phase 6 — Publish refinement page

After approval:

1. `mcp__atlassian__createConfluencePage` with:
   - `cloudId`, `spaceId` from config
   - `parentId` = the tech design's `parentId` captured in Phase 1 (sibling, same folder). If the tech design has no meaningful parent (e.g. it lives at the space root), fall back to the tech design page ID.
   - `title`, `body` from draft

## Phase 7 — Create Jira tickets

For each row in the approved table:

1. `mcp__atlassian__createJiraIssue` with:
   - `cloudId`, `projectKey` from config
   - `issueTypeName` — default to `Task`. Use `Story` if the title implies user-facing functionality, `Subtask` only if `parentKey` is set.
   - `summary` from Title
   - `description` (ADF) including, in this order:
     - Description text
     - Acceptance criteria (formatted as a checklist)
     - Files in scope
     - Dependencies (Jira keys) and Size
     - **References block**: link to refinement page, tech design, AND every design / external reference URL captured in Phase 1 (Figma etc.) — the implementing dev / agent must not have to navigate three pages to find the design.
   - `labels` = `[refinement-<feature-slug>]` so the batch is queryable later
2. Collect the resulting ticket keys.
3. If a ticket has dependencies, link them after creation using `mcp__atlassian__createIssueLink` with type `Blocks` / `Is blocked by`.

## Phase 8 — Update refinement page with ticket links

Edit the published refinement page (`mcp__atlassian__updateConfluencePage`) to replace each "#" cell with the actual Jira key (e.g. `SCRUM-12`).

## Phase 9 — Hand-off

Print to the user:
- Refinement page URL
- List of created ticket keys with their Jira URLs
- Suggested next step: each ticket can now be picked up with `/work-on <key>`.
