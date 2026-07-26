---
name: release-notes
description: Draft GitHub release notes for this project. Use when the user asks to create, draft, or update a release, release notes, or changelog. Generates a structured release post with highlights and a scoped commit changelog.
---

# Release Notes Skill

Draft GitHub release notes for this project following a standardized template. The output is written to `release/<version>-draft.md` for user review.

## Workflow

1. **Gather context** — collect the tag/version, all commits since the last tag (or all commits for the initial release), and commit stats (count by scope).
2. **Draft** — write the release notes following the template below. Write to `release/<version>-draft.md`.
3. **Present** — summarize to the user and ask for approval.

## Template

```markdown
## v<major>.<minor>.<patch> (<YYYY-MM-DD>)

<One or two sentences describing what this release is.>

### Highlights

- **<Feature title>** — <one-line description>
- **<Feature title>** — <one-line description>
- ...

### Changelog

#### Build System

- [`<sha>`](<commit-url>) build: <message>
- ...

#### Visual & UI

- [`<sha>`](<commit-url>) visual: <message>
- ...

#### Slide Content

- [`<sha>`](<commit-url>) slide: <message>
- ...

#### Agent Capabilities

- [`<sha>`](<commit-url>) agent: <message>
- [`<sha>`](<commit-url>) project: <message> <!-- AGENTS.md docs for agent features -->
- ...
