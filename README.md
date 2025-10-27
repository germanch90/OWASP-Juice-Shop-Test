# OWASP Juice Shop PlaywrightJS Automation Test Framework

---

## Overview
This repository hosts the data producer of a larger AI-driven quality-engineering initiative, but deserves a space of its own.  
It implements a modern **PlaywrightJS test framework** targeting the **OWASP Juice Shop** web application—one of the most feature-rich, intentionally insecure apps available for testing and security research.

The framework exercises advanced Playwright capabilities across UI and API layers and generates structured test-run data that can later be consumed by an **AI evaluation service** for automated analysis and summarization.

---

## Why OWASP Juice Shop as Target Under Test (TUT)

| Reason | Description |
|--------|--------------|
| **Feature Depth** | Full e-commerce workflow: authentication, search, cart, checkout, file upload/download, and REST APIs. |
| **Open Source & Free** | MIT-licensed, Docker-deployable—safe for public demos. |
| **Security Focus** | Built to illustrate OWASP Top 10 issues, perfect for exploring negative-path testing and security validations. |
| **Rich Tech Surface** | Uses Angular + REST APIs + Web Sockets → excellent for testing intercepts, storage state, and network resilience. |
| **Community Standard** | Widely recognized benchmark for training and evaluation in QA and AppSec. |

---

## Goal
Create a **maintainable, CI-ready test framework** that can:

1. **Run realistic end-to-end and API tests** against OWASP Juice Shop.  
2. **Showcase advanced Playwright features** – parallel execution, tracing, accessibility, visual comparisons, and network interception.  
3. **Produce machine-readable output** (`playwright-results.json`) suitable for ingestion by an AI evaluation backend.
4. **Demonstrate engineering quality** through modular design, fixtures, and robust reporting.

---

## Architecture

```
┌────────────────────────────┐
│   OWASP Juice Shop (TUT)   │
│   docker run -p 3000:3000  │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│   Playwright Test Runner   │
│   • UI + API specs         │
│   • Fixtures & PO pattern  │
│   • Traces & Screenshots   │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│            AI JSON Reporter                │
│--------------------------------------------│
│ • Normalizes results                       │
│ • Exports `playwright-results.json`        │
│ • Optionally POSTs to next-stage API       │
└────────────────────────────────────────────┘

```

**Key Components**
- `Playwright @latest` + TypeScript
- Custom JSON Reporter (`ai-json-reporter.ts`)
- Fixtures for session state & API seeding
- Accessibility tests (`axe-core/playwright`)
- Visual regression examples (`toHaveScreenshot`)
- CI pipeline (GitHub Actions)

---

## Repository Structure
```
src/
  config/            # env & test-data loaders
  fixtures/          # reusable auth & API contexts
  pages/             # Page Object Model classes
  reporters/         # custom AI JSON reporter
  utils/             # helpers (a11y, api, intercepts)
tests/
  smoke/ e2e/ api/ a11y/ visual/
playwright.config.ts
README.md
```

---

## Quick Start

1. **Build the stack** (from the repo root)
   ```bash
   docker compose build
   ```
2. **Start the target app (TUT)**
   ```bash
   docker compose up -d juice-shop
   ```
3. **Run the Playwright suite**
   ```bash
   docker compose run --rm playwright
   ```
4. **View results (WIP)**
   - `playwright-report/index.html` → interactive HTML report  
   - `test-results/` → traces & screenshots  
   - `playwright-results.json` → AI-ready output

---

## Configuration
Environment variables (`.env`):
```env
BASE_URL=http://localhost:3000
AI_EVAL_POST_URL=       # optional; when set, results are POSTed [WIP]
HEADLESS=true
LOCALE=en
```

---

## Continuous Integration
A GitHub Actions workflow runs on every push:
- Launches Juice Shop service
- Executes all specs across Chromium, Firefox, WebKit
- Publishes HTML report & traces as artifacts

---

## Relation to the AI Quality Pipeline
This repository represents **Stage 0 – Data Producer**.  
Subsequent stages (in separate repos) will consume its JSON output to:
- Evaluate model accuracy on test narratives  
- Auto-summarize failures using LangSmith + LLMs  
- Generate human-readable quality dashboards  

---

## License
MIT License — open to modification and reuse for educational or research purposes.

---

## Author
**German Andrés Chaverri Campos**  
*Senior Software Quality Assurance Engineer | Test Automation Expert | AI Engineering Enthusiast*  
[LinkedIn Profile](https://www.linkedin.com/in/german-chaverri-campos/)
