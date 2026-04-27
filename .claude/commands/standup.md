---
description: Build a standup update from the last 24h of Jira + GitHub activity, post to Slack
argument-hint: (no args — uses last 24h)
---

You are preparing the daily standup post for the configured user.

Read `.claude/workflow-config.md` first for project facts.

## Phase 1 — Identify the user

1. Use `mcp__atlassian__atlassianUserInfo` to get the current Atlassian account ID.
2. Use `gh api user --jq .login` (Bash) to get the current GitHub username.
3. Print both so the user can sanity-check before continuing.

## Phase 2 — Pull Jira activity (last 24h)

Use `mcp__atlassian__searchJiraIssuesUsingJql` with the cloudId from config and JQL:

```
project = SCRUM AND (assignee = currentUser() OR reporter = currentUser()) AND updated >= -24h ORDER BY updated DESC
```

For each returned issue, capture:
- Key, summary, current status
- What changed in the last 24h: status transitions, comments authored by you, sub-tasks added

If a transition happened (e.g. To Do → In Progress), note both states.

## Phase 3 — Pull GitHub activity (last 24h)

In the configured repo (`ibrly/eg-js`), via Bash + `gh`:

```sh
since=$(date -u -v-24H +%Y-%m-%dT%H:%M:%SZ)
gh api -X GET search/issues -f q="repo:ibrly/eg-js author:@me updated:>=$since" --jq '.items[]|{number,title,state,html_url,pull_request: (.pull_request != null)}'
gh pr list --repo ibrly/eg-js --author "@me" --state all --json number,title,state,url,updatedAt --jq "map(select(.updatedAt > \"$since\"))"
```

Collect:
- PRs opened, merged, closed in the window
- PRs you reviewed (use `gh api search/issues -f q="repo:ibrly/eg-js reviewed-by:@me updated:>=$since"`)
- Commits to branches you authored (`gh api repos/ibrly/eg-js/commits -f author=<login> -f since=$since`)

## Phase 4 — Compose the update

Format as 3 sections — keep each line short, one bullet per item:

```
*Yesterday:*
• <SCRUM-X> <title> — moved to In Review (<PR url>)
• Reviewed PR #N — <title>
• ...

*Today:*
• <SCRUM-Y> <title> — In Progress
• ...

*Blockers:*
• None
```

Rules:
- "Yesterday" = anything completed, merged, or transitioned to a terminal/review state in the window.
- "Today" = anything currently `In Progress` assigned to you, or carry-over.
- Always include a "Blockers" section, even if "None". If a Jira ticket has a comment from you in the last 24h containing words like "blocked", "waiting on", "stuck", surface it here.
- Reference each item with its Jira key + Slack-style link to the URL.

Show the draft to the user. Wait for confirmation.

## Phase 5 — Post to Slack

After confirmation:

1. Look up the standup channel ID via `mcp__slack__slack_list_channels` (channel name from config: `standup-updates`).
2. `mcp__slack__slack_post_message` with the channel ID and the formatted text.
3. Print the resulting message permalink.

## Failure modes

- If the JQL or GitHub query returns nothing for a given category, just write `• Nothing` under that section — don't omit the section.
- If Slack posting fails, print the formatted message so the user can paste it manually.
