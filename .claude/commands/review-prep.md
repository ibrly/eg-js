---
description: Compile finished work from a sprint into a per-dev demo agenda plus retro analytics
argument-hint: [sprint-id-or-name] (optional — defaults to most recent closed sprint)
---

You are preparing materials for the sprint review/demo and retro.

Read `.claude/workflow-config.md` first for project facts.

> **Demo context:** the output of this command is going to be presented live. Format for readability on screen — short bullets, group by dev, highlight visuals where available.

## Phase 1 — Identify the sprint

If $ARGUMENTS is provided, use it as the sprint name/ID. Otherwise pick the most recently closed sprint.

Search Jira:
```
project = SCRUM AND sprint = "<sprint name>" AND status = Done
```

If no done items, fall back to: `status in (Done, "In Review")` and flag in-review items as "shipping during demo".

Print the sprint name and dates for confirmation.

## Phase 2 — Group by dev

Build a map: `assignee → [tickets]`. For each ticket capture:
- Key, summary, type, story points
- Linked PRs (via `gh pr list --search "SCRUM-N in:title,body"` or by parsing the Jira issue's remote links via `mcp__atlassian__getJiraIssueRemoteIssueLinks`)
- Any Figma URLs in the description (for demo screenshots)
- Cycle time: status was first set to In Progress → became Done (use Jira changelog if available; otherwise use created → resolved as a fallback)

## Phase 3 — Per-dev demo agenda

For each dev, render a section:

```
## <Dev name>
### <SCRUM-X> — <title>
- What it does (one sentence)
- PR: <url>
- Demo notes: <bullet list of what to click/show>
- Figma (if any): <url>
```

Keep each ticket to <5 lines. The dev presenting should be able to read this and know exactly what to demo.

## Phase 4 — Retro analytics

Compute and present:
- **Throughput**: total tickets done, total story points
- **Cycle time**: median and p90 across done tickets
- **Type mix**: bugs vs stories vs tasks vs features (counts and percentages)
- **Carry-over from previous sprint**: how many tickets done this sprint were carried over
- **Top contributors by points**: ranked list (numbers, not judgments)
- **Slowest ticket**: longest cycle time, with its key + summary
- **Stalled tickets**: anything in In Progress > 5 business days without status change (these are retro fodder)

Frame this as data, not commentary — let the team interpret in the call.

## Phase 5 — Output

Print everything to chat in this order:
1. Sprint name / dates
2. Demo agenda (grouped by dev)
3. Retro analytics

Optional follow-up the user might ask for:
- Post the demo agenda to Slack — only do this if user asks.
- Save as a Confluence page under the SD space — only do this if user asks. If they do, title it `[Review] <sprint name>`.

Do not auto-modify Jira or post to Slack from this command — read-only by default.
