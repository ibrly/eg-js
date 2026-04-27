---
description: Audit the most recent finished sprint and draft a recommended scope for the next sprint
argument-hint: (no args — auto-detects sprints)
---

You are preparing for sprint planning. Sprints are 3 weeks. Use the most-recently-closed sprint as the historical anchor and the next upcoming sprint as the planning target.

Read `.claude/workflow-config.md` first for project facts.

> **Demo context:** the output of this command is going to be presented live. Lean toward concise, scannable summaries over exhaustive lists. Favor recency.

## Phase 1 — Identify sprints

Use `mcp__atlassian__searchJiraIssuesUsingJql` with JQL helpers:

- Closed sprints: `project = SCRUM AND sprint in closedSprints() ORDER BY updated DESC` — pick the *most recently closed* one (look at the sprint's end date).
- Active sprint: `project = SCRUM AND sprint in openSprints()` — should be the current one.
- Future sprint: `project = SCRUM AND sprint in futureSprints()` — the planning target if it exists.

If only one sprint exists in the system, treat current as the historical anchor and propose the *next* batch of work as the target.

Print the identified sprints (name + dates) so the user can confirm before continuing.

## Phase 2 — Last sprint review

Pull all issues in the historical sprint. For each, capture: key, type, summary, original assignee, story points, final status.

Compute:
- **Committed**: count and sum of story points
- **Completed** (status = Done): count and sum
- **Carry-over** (anything not Done — In Progress, In Review, To Do, Blocked): count and sum
- **Velocity**: completed story points
- **Completion rate**: completed / committed

Categorize the carry-over by reason (look at last comment, status, blockers if available):
- Still being worked
- Blocked
- Descoped / abandoned

## Phase 3 — Backlog & priority

Pull the top of the backlog (no sprint, status = To Do):

```
project = SCRUM AND sprint is EMPTY AND status = "To Do" ORDER BY priority DESC, created ASC
```

Limit to the top 20.

## Phase 4 — Recommend next sprint

Based on:
- Last sprint's velocity → use as a capacity ceiling for next sprint
- Carry-over items still being worked → must be in next sprint
- Highest-priority backlog items → fill remaining capacity

Output a **recommended scope** with:
- Carry-over (must include): list of tickets, sum of points
- New for next sprint (proposed): list of tickets, sum of points
- Total proposed: must be ≤ velocity (or note the overage)
- Watchlist: blocked carry-over that won't roll forward without action

## Phase 5 — Highlights for the demo

Pick out 2–4 things from the last sprint worth narrating in the planning meeting:
- Biggest shipped item (largest size completed)
- Anything blocked >1 week
- Velocity trend if you can compute one (last sprint vs the one before)

## Phase 6 — Output

Print to chat as a compact briefing. Sections:
1. Sprint identification (last / current / next)
2. Last sprint scorecard (committed / completed / velocity / carry-over)
3. Carry-over breakdown
4. Recommended scope for next sprint (carry-over + proposed new)
5. Highlights for the demo

Do **not** auto-modify Jira (do not assign sprints, do not move tickets). This command is read-only — the planning meeting decides the actual scope.
