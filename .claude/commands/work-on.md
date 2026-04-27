---
description: Implement a Jira ticket end-to-end (fetch → branch → code → review → PR → Slack → Jira transition)
argument-hint: <ticket-id>
---

You are implementing Jira ticket **$1** end-to-end. Read `.claude/workflow-config.md` first to load project facts (cloudId, space, repo, channels, statuses).

## Phase 1 — Fetch & understand the ticket

1. Use `mcp__atlassian__getJiraIssue` with `cloudId` from config and `issueIdOrKey="$1"`.
2. Extract from the issue:
   - Summary, description, acceptance criteria, status, assignee, priority
   - **Linked Figma URLs** (look in description and any custom fields)
   - **Linked Confluence tech-design pages** (look for `*.atlassian.net/wiki/...` URLs)
   - Any sub-tasks or linked issues that affect scope
3. If the ticket is already in `Done` or `In Review`, **stop and ask the user** whether to continue anyway.
4. Print a short brief: ticket key, one-line summary, acceptance criteria as bullets, links found.

## Phase 2 — Pull supporting context

For each link found:
- **Figma URL** → use the Figma MCP to fetch design context (`get_design_context`, `get_screenshot`, `get_variable_defs` as appropriate). If the Figma MCP is not available, ask the user to open Figma desktop and enable Dev Mode MCP.
- **Confluence tech-design page** → use `mcp__atlassian__getConfluencePage` to read it.
- **Codebase** → grep / read files referenced in the ticket or tech design before writing any code.

## Phase 3 — Branch & transition to In Progress

1. Verify the working tree is clean (`git status`). If there are uncommitted changes, stop and ask.
2. Create a feature branch: `feat/$1-<kebab-summary>` (truncate kebab summary to ~40 chars). Example: `feat/SCRUM-3-add-login-form`.
3. Transition the ticket to **In Progress**:
   - `mcp__atlassian__getTransitionsForJiraIssue` to find the transition ID for "In Progress".
   - `mcp__atlassian__transitionJiraIssue` with that ID.
   - If transition fails or no matching status exists, log it and continue — don't block on it.

## Phase 4 — Implement

1. Implement the change against the tech design / acceptance criteria. Stay within the ticket's scope; do not bundle unrelated cleanup.
2. Match existing code conventions (look at neighboring files first).
3. Run the project's checks before declaring done:
   - `pnpm lint`
   - `pnpm build` (or `pnpm typecheck` if it exists in `package.json` scripts)
   - `pnpm test` if a test script exists
4. Fix any failures. Do not skip checks.

## Phase 5 — Self-review and pause for dev review

1. Show the user a concise summary:
   - Files changed (with line counts)
   - What each change does (one sentence per file)
   - How the implementation maps to each acceptance criterion
   - Any decisions or trade-offs you made
2. **Stop here. Wait for the dev to review and confirm before continuing.** Do not commit or push.

## Phase 6 — Commit, push, open PR

After dev confirmation:

1. Stage the changed files explicitly (no `git add -A` / `git add .`).
2. Commit with a message of the form:
   ```
   $1: <one-line summary>

   <2-3 lines: what changed and why, referencing acceptance criteria>
   ```
3. Push the branch with `-u`.
4. Create the PR via `gh pr create`:
   - Title: `$1: <summary>`
   - Body must include:
     - **Ticket**: link to `https://ibrly.atlassian.net/browse/$1`
     - **Summary**: 2–3 bullets
     - **Test plan**: bulleted checklist
     - **Acceptance criteria**: each one with ✅ if met, ⚠️ if partial, ❌ if not addressed
   - If a Figma link was in the ticket, include it in the body.

## Phase 7 — Slack announcement

Post to `#standup-updates` (channel from config):

> 🚀 Opened PR for **$1** — *<ticket summary>*
> <PR URL>
> <Jira ticket URL>

Use `mcp__slack__slack_post_message`. Look up the channel ID via `mcp__slack__slack_list_channels` if the bot doesn't accept the name directly.

## Phase 8 — Jira transition (gated on dev confirmation)

1. **Stop. Ask the dev to confirm** they're happy with the PR and Slack post.
2. After confirmation: transition the ticket to **In Review**.
3. Add a Jira comment on the ticket linking to the PR.

## Failure handling

- If any MCP server is unavailable, surface a clear message and continue with manual fallback steps where possible (e.g., if Slack is down, print the message you would have posted so the dev can paste it).
- Never invent ticket IDs, PR numbers, or URLs. Always use real values returned from MCP calls.
- If the ticket has no acceptance criteria, ask the dev for them before implementing.
