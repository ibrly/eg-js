# Workflow configuration

Shared facts every workflow command in `.claude/commands/` should read. Update this file when project setup changes — commands reference it instead of hard-coding values.

## Project identity
- **Confluence site / Jira cloudId**: `ibrly.atlassian.net`
- **Confluence space key**: `SD` (Software Development)
- **Confluence space ID**: `196612` (use this for `mcp__atlassian__createConfluencePage`)
- **Jira project key**: `SCRUM`
- **Jira board ID**: `1`
- **GitHub repo**: `ibrly/eg-js`
- **Git default branch**: `main`

## Slack
- **Standup channel**: `#standup`
- **PR / work announcements channel**: `#standup` (same)

## Sprint
- **Cadence**: 3 weeks
- **Source of truth for sprint boundaries**: Jira sprint object (active sprint on board 1)

## Authoring
All Confluence / Jira / Slack writes use the configured user's credentials (Ibrahim Aly). Comments and pages will appear under that name.

## Standard ticket statuses (SCRUM project)
- `To Do` — not started
- `In Progress` — work has begun
- `In Review` — PR is open
- `Done` — merged and verified

Use `mcp__atlassian__getTransitionsForJiraIssue` at runtime to discover the actual transition IDs since these can vary by workflow.
