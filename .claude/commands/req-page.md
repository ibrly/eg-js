---
description: Create a business requirements page in Confluence (no technical info)
argument-hint: <feature-name-or-description>
---

You are creating a **business requirements** page for the feature: **$ARGUMENTS**.

Read `.claude/workflow-config.md` first for project facts.

## Hard rule
This page contains **business requirements only**. Do not include implementation details, libraries, file paths, data schemas, API contracts, or any technical jargon. Anything technical belongs in `/tech-design`.

## Phase 1 — Clarify before writing

Don't draft until you've answered each of these. Ask the user any you can't infer:

1. **Problem** — what pain point or opportunity does this address? Whose pain?
2. **Goal** — what does success look like, in user-visible terms?
3. **Non-goals** — what is explicitly out of scope?
4. **Users / personas** — who will use this? Internal? External? A specific segment?
5. **User journeys** — the 1-3 main flows this enables. Describe in plain language.
6. **Success metrics** — how will we know it worked? (qualitative is fine if no analytics)
7. **Open questions** — what's undecided that the business owner needs to answer?
8. **Design references** — any Figma / Sketch / screenshot / mockup URLs the user has shared (parse these out of $ARGUMENTS and the conversation). If the feature is visual and no design is on file, ask before drafting.

If the user hasn't given enough info to answer these, ask **one focused question at a time** until you have what you need.

## Phase 2 — Draft the page

Render the page in this structure (use Confluence HTML format for richer rendering — see ADF/HTML notes in the createConfluencePage tool description):

- **Title**: `[Feature] $ARGUMENTS` (or a clearer name if user provides one)
- **Status banner at top**: `Draft — pending business owner review`
- **References block** directly under the banner — bulleted list of every design / external reference URL captured in Phase 1 (Figma, Sketch, mockups, related docs). Label each one (e.g. `Figma — main menu`). Omit the section only if there are genuinely none. This block is what `/tech-design` and `/refinement-preparation` propagate forward into the tech design and Jira tickets, so do not skip it when a link exists.
- **Sections** (h2):
  - Problem
  - Goal
  - Non-goals
  - Users / Personas
  - User Journeys (numbered list, plain language)
  - Success Metrics
  - Open Questions

Show the draft to the user in chat before publishing. Wait for confirmation.

## Phase 3 — Publish

After user approval:

1. Use `mcp__atlassian__createConfluencePage` with:
   - `cloudId` from config
   - `spaceId` from config (`196612`)
   - `title` from the draft
   - `body` rendered as Confluence HTML (or ADF)
   - `representation` matching the body format
2. Print the page URL.

## Phase 4 — Hand-off

Tell the user:
- Page URL
- Suggested next step: `/tech-design <page-url>` once business owner has reviewed/approved the requirements.
