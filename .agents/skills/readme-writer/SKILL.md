---
name: readme-writer
description: Generate README.md from markpress slide content. Use when the user asks to create or update README files for a presentation project.
---

# README Writer for Markpress Presentations

Generate a project README file that describes the presentation, its background, and outline extracted from the slide content.

## Output

A single `README.md` file is created or updated.

## Structure

Follow this template:

```markdown
# {Title from slide}

{One-paragraph description of the presentation}

## Background

{2-3 paragraphs of context}

## Presentation Outline

| # | Topic | Description |
|---|-------|-------------|
| 1 | {Slide 2 heading} | {Brief description} |
| 2 | {Slide 3 heading} | {Brief description} |
| ... | ... | ... |

## Render

```sh
npm install
npm run build      # renders slides/presentation.md → output/index.html
npm run preview    # opens output/index.html in the browser
```
```
