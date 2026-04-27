---
description: Produce a tech design from a business req page, detailed enough that tickets can be implemented from it without further prompting
argument-hint: <req-page-url-or-id>
---

You are producing a **technical design** from the business requirements page at: **$ARGUMENTS**.

Read `.claude/workflow-config.md` first for project facts.

## Hard rule
This design must be **AI-actionable**: a future `/work-on TICKET` invocation should be able to implement any derived ticket *purely from the ticket text and this design*, with no extra context. That means: name actual files, name actual functions, define exact data shapes, list exact API contracts, list exact validation rules. Vague phrases like "handle the edge case" or "wire it up" are forbidden.

## Phase 1 — Read the source

1. Resolve the input ($ARGUMENTS) to a Confluence page ID. If it's a URL, extract the ID from `/pages/<id>/...`.
2. `mcp__atlassian__getConfluencePage` with that ID to read the business requirements.
3. Confirm the source page is a business requirements page (has Problem/Goal/User Journeys etc.). If it looks like something else, stop and ask.
4. **Capture every external reference URL** from the req page (Figma / Sketch / mockup / related-doc links — usually in a "References" block under the status banner, but also scan the body). These must be carried forward into the tech design's "Source" block in Phase 6 and into every refinement / Jira ticket downstream.

## Phase 2 — Survey the codebase

Before designing, build a current-state mental model:

1. Read [package.json](/Users/ibrahimaly/apps/eg-js/package.json) to know dependencies and scripts.
2. Survey [src/](/Users/ibrahimaly/apps/eg-js/src/) — list current routes, components, server code.
3. Identify the existing patterns: routing convention, state management, styling, data layer, auth.
4. Note any existing primitives that should be reused (don't reinvent).

## Phase 3 — Design

Draft a design page with these sections (h2):

- **Overview** — one paragraph: what's being built and why (cite the req page).
- **Architecture decisions** — for each significant choice, name the decision and the *one* reason for it. No multi-option ADRs unless asked.
- **Data model** — every new/modified type, table, schema. Include field names and types.
- **API contracts** — every new endpoint. Method, path, request shape, response shape, error cases.
- **File-level changes** — table with columns: `Path | Action (create/modify/delete) | Purpose`. Use real paths under [src/](/Users/ibrahimaly/apps/eg-js/src/).
- **Validation & edge cases** — explicit list. For each: input condition → expected behavior.
- **Security / privacy** — auth requirements, data sensitivity, PII handling. If none apply, write "None".
- **Telemetry** — what to log/measure. If none, write "None".
- **Rollout / migration** — feature flag, data migration, backfill, none.
- **Open questions** — anything unresolved. Each must have a *named owner* or be marked `[needs codebase investigation]`.
- **Out of scope** — what this design intentionally does not address (forward-reference future tech designs).

## Phase 4 — Resolve ambiguity from the codebase

For every "Open question" tagged `[needs codebase investigation]`, do the investigation now (grep, read files, run small experiments via Bash) and convert it to a resolved decision. The remaining open questions should only be ones a human must answer.

## Phase 5 — Self-review

Before publishing, check the design against this rubric:
- Could a coding AI implement each acceptance criterion using *only* the ticket text + this design?
- Is every file mentioned a real path?
- Are all field/function names concrete (not "the user object" — use `User` as defined in `src/...`)?
- Are edge cases enumerable (not "handle errors gracefully")?

If any answer is no, revise.

## Phase 6 — Publish

After user approval:

1. `mcp__atlassian__createConfluencePage` with:
   - `cloudId` from config
   - `spaceId` from config
   - `parentId` = the source req page ID (creates as a child page)
   - `title`: `[Tech Design] <feature name>`
   - `body` in HTML or ADF. The body MUST start with a "Source" block containing both (a) a clickable link back to the req page and (b) every design / external reference URL captured in Phase 1 (e.g. `Figma — main menu: <url>`). Do not omit the design links — `/refinement-preparation` will pull them out of this block to attach to every Jira ticket.
2. Print the page URL.

## Phase 7 — Hand-off

Tell the user:
- Page URL
- Suggested next step: `/refinement-preparation <tech-design-url>`.
