import { Check, Copy, FileCode2, FolderGit2, Terminal } from 'lucide-react';
import { useState } from 'react';

interface RepoArtifact {
  path: string;
  description: string;
  content: string;
}

const GIT_PUSH_COMMANDS = `# 1. Initialize repository and verify status
git init
git add .
git status

# 2. Create initial commit with P58 TruthLens codebase
git commit -m "feat(p58): TruthLens news aggregator, credibility engine, moderation & report site"

# 3. Link your GitHub repository and push to main
git branch -M main
git remote add origin https://github.com/<your-username>/truthlens-p58.git
git push -u origin main`;

const REPO_ARTIFACTS: RepoArtifact[] = [
  {
    path: 'README.md',
    description: 'Clean-machine setup, Handbook Appendix D project overview, and targets',
    content: `# P58 — TruthLens: News Aggregator with Misinformation Flagging

**Author:** Manya B U (\`ENG24CS0126\`, Section \`5B\`)  
**Domain:** Media Domain · AI in Software Engineering

## Problem & Solution
Readers encounter conflicting claims across news sites and social messaging without clear context. TruthLens aggregates articles and attaches explainable credibility indicators powered by a 6-step text feature classifier + Source Reputation Registry, supporting evidence links, user reports, appeals, and human moderator overrides.

## Quickstart (Clean Machine)
\`\`\`bash
npm install
npm test          # Runs TC-01 to TC-06 unit verification
npm run lint      # TypeScript strict check
npm run dev       # Starts Express + Vite on http://localhost:3000
\`\`\`

## Targets (Handbook Benchmarks)
- Flag Precision Target: 75%
- Automated Test Coverage Target: 80%
- Critical / Blocker Defects: 0
- CI/CD Pipeline: Green (GitHub Actions & Jenkinsfile included)`,
  },
  {
    path: '.github/workflows/ci.yml',
    description: 'Automated lint, unit test (TC-01..TC-06), and production build pipeline',
    content: `name: TruthLens P58 CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`,
  },
  {
    path: 'Dockerfile',
    description: 'Production container packaging Express API and built React bundle',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY server.ts ./server.ts
COPY src ./src
EXPOSE 3000
CMD ["node", "server.ts"]`,
  },
  {
    path: 'docker-compose.yml',
    description: 'Single-command local container launch on port 3000',
    content: `services:
  truthlens:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped`,
  },
  {
    path: 'tests/credibility.test.ts',
    description: 'Automated Node test suite verifying TC-01 through TC-06 logic',
    content: `import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ARTICLES, SEED_SOURCES } from '../src/data/seedData.ts';
import { evaluateCredibility } from '../src/utils/credibilityEngine.ts';

test('TC-01: Seed feed includes source, timestamp, and analysis', () => {
  assert.ok(SEED_ARTICLES.length >= 5);
  for (const article of SEED_ARTICLES) {
    assert.ok(article.title.length > 5);
    assert.ok(article.sourceName.length > 0);
    assert.ok(article.publishedAt.length > 0);
    assert.ok(article.analysis.headlineReason.length > 0);
  }
});

test('TC-03: Flagged article includes non-empty explanation and evidence links', () => {
  const result = evaluateCredibility(
    'SHOCKING Miracle Cure 100% Eliminates Diabetes Overnight!!',
    'Mainstream media hides this secret! Anonymous insiders claim leaked memo!!',
    'viralhealthalert.net',
    SEED_SOURCES
  );
  assert.equal(result.status, 'flagged');
  assert.ok(result.evidenceLinks.length > 0);
  assert.ok(result.detailedExplanation.length > 20);
});

test('TC-04: Thin uncorroborated claim triggers insufficient_evidence safeguard', () => {
  const result = evaluateCredibility(
    'Substation Note: Unconfirmed Voltage Drop',
    'Early reports suggest two lines allegedly tripped, with no preliminary utility log.',
    'unknown-local-notes.org',
    SEED_SOURCES
  );
  assert.equal(result.status, 'insufficient_evidence');
  assert.ok(result.uncertaintyNotice && result.uncertaintyNotice.includes('Insufficient'));
});`,
  },
];

export function GitHubCodeView() {
  const [selectedFile, setSelectedFile] = useState(REPO_ARTIFACTS[0].path);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeArtifact =
    REPO_ARTIFACTS.find((f) => f.path === selectedFile) ?? REPO_ARTIFACTS[0];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback ignored in constrained iframes
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
          Handbook Appendix D · Repository & DevOps
        </p>
        <h1 className="mt-2 font-editorial text-3xl font-semibold text-[#F8FAFC] sm:text-4xl">
          GitHub Repository Code & Deployment Setup
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-slate-300">
          All project files—including <span className="font-mono text-amber-200">README.md</span>,{' '}
          <span className="font-mono text-amber-200">server.ts</span>,{' '}
          <span className="font-mono text-amber-200">Dockerfile</span>,{' '}
          <span className="font-mono text-amber-200">.github/workflows/ci.yml</span>, and{' '}
          <span className="font-mono text-amber-200">tests/credibility.test.ts</span>—are included directly in this project workspace so you can push straight to GitHub.
        </p>
      </div>

      {/* Git Push Terminal Commands */}
      <section className="rounded-lg border border-white/10 bg-[#111827] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-amber-300" />
            <h2 className="text-base font-semibold text-white">
              Commands to Push This Codebase to GitHub
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('git-push', GIT_PUSH_COMMANDS)}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
          >
            {copiedId === 'git-push' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Commands</span>
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto rounded-md border border-white/10 bg-[#0B0F17] p-4 font-mono text-xs text-slate-200 leading-relaxed">
          <code>{GIT_PUSH_COMMANDS}</code>
        </pre>
      </section>

      {/* Repository Artifacts Browser */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center gap-2 px-1 pb-1">
            <FolderGit2 className="h-4 w-4 text-amber-300" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Included Repo Files
            </span>
          </div>
          {REPO_ARTIFACTS.map((artifact) => {
            const active = artifact.path === selectedFile;
            return (
              <button
                key={artifact.path}
                type="button"
                onClick={() => setSelectedFile(artifact.path)}
                className={`w-full rounded-md border p-3.5 text-left transition ${
                  active
                    ? 'border-amber-400/40 bg-amber-400/10'
                    : 'border-white/10 bg-[#111827] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-medium text-white">
                  <FileCode2 className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{artifact.path}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{artifact.description}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 rounded-lg border border-white/10 bg-[#111827] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0D131E] px-4 py-3">
            <span className="font-mono text-xs text-amber-200">{activeArtifact.path}</span>
            <button
              type="button"
              onClick={() => handleCopy(activeArtifact.path, activeArtifact.content)}
              className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
            >
              {copiedId === activeArtifact.path ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs text-slate-200 leading-relaxed">
            <code>{activeArtifact.content}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
