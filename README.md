# P58 — TruthLens: News Aggregator with Misinformation Flagging

**Author:** Manya B U (`ENG24CS0126`, Section `5B`)  
**Domain:** Media Domain · AI in Software Engineering Integrated Project  
**Date:** 22 November 2026

## Problem & Solution
News spreads rapidly across websites and social platforms, making it hard for readers to separate verified journalism from unsubstantiated claims. **TruthLens** pairs clean news aggregation with an explainable 6-step misinformation flagging engine, a curated Source Reputation Registry, supporting evidence links, reader report & appeal workflows, and a human-in-the-loop Moderator Review Console.

## Key Capabilities
- **Aggregated News Feed (TC-01):** Searchable, filterable coverage across Science & Health, Economy, Policy, Technology, and Climate with source attribution and timestamps.
- **Explainable 6-Step Credibility Engine (TC-03 / TC-04):** Extracts sensationalism, unverified claim cues, citation density, and hedging markers combined with source reputation tiers. Explicitly surfaces `Insufficient Evidence` rather than forcing a false binary guess.
- **Reader Reports & Flag Appeals (TC-02 / TC-06):** Readers can report suspicious articles or appeal flags with supporting evidence URLs.
- **Moderator Review Console (TC-05):** Human moderators inspect reports and appeals, record rationale notes, and override automated statuses.
- **Interactive P58 Project Report & GitHub Hub:** Built-in documentation covering Chapters 1–9, architecture diagram, test matrix, and Responsible AI checklist.

## Clean-Machine Setup
```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript verification and automated tests (TC-01 to TC-06)
npm run lint
npm test

# 3. Start full-stack Express + Vite app on http://localhost:3000
npm run dev
```

## Production Build & Docker
```bash
npm run build
npm start

# Or via Docker Compose
docker compose up --build
```

## Project Targets (Handbook Benchmarks)
| Metric | Target | Notes |
| --- | --- | --- |
| Flag Precision Target | `75%` | Handbook benchmark for misinformation detection |
| Automated Test Coverage | `80%` | Unit + integration verification |
| Blocker Defects Gate | `0` | Release sign-off gate |
| CI/CD Pipeline | `Green` | GitHub Actions & Jenkinsfile configured |

## Responsible AI Statement
Credibility flags in TruthLens are advisory signals paired with human-readable reasons and reference links—never automated censorship or final truth. Readers and publishers retain the right to appeal any flag for human moderator review.
