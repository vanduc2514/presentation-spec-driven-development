# Your AI Doesn't Know What You Want (And Neither Do You)

A 20-minute conference talk on **Spec-Driven Development (SDD)**.

## Background

Spec-Driven Development was coined by [Sam Hatoum](https://www.linkedin.com/in/samhatoum) in 2016 — long before AI coding tools went mainstream. The core idea: treat specifications as the source of truth, not documentation written after the fact.

In the age of AI-assisted development, this matters more than ever. Without a spec, you're not directing your AI — you're just hoping it guesses right. SDD turns specifications into executable contracts that constrain what gets built, catching architectural drift and API violations before they reach production.

This talk doesn't pitch a tool. It argues that **structure is the missing ingredient** in most AI-assisted workflows — and gives developers a practical framework to add it.

## Render

The presentation is rendered from `slides/presentation.md`

```sh
npm install
npm run build      # → output/index.html
npm run preview    # open in browser
```

## Project Structure

```
slides/
  presentation.md   # Slide source
  images/           # Images referenced in slides
  diagrams/         # Excalidraw source files
build.cjs           # Build script
public/
  presentation/     # CSS and JS for the slideshow
  remote/           # Mobile remote control
package.json
mise.toml           # Node.js version pin
.github/
  workflows/
    deploy-pages.yml  # Auto-deploy to GitHub Pages on push to main
.agents/
  skills/           # AI agent skills for writing and styling slides
research/           # Brainstorming notes and planning materials
artifact/           # QA screenshots and raw notes
```
