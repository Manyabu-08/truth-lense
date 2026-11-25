import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SEED_APPEALS,
  SEED_ARTICLES,
  SEED_REPORTS,
  SEED_SOURCES,
} from './src/data/seedData.ts';
import type {
  AppealStatus,
  Article,
  CredibilityStatus,
  FlagAppeal,
  ReportStatus,
  SourceReputation,
  UserReport,
} from './src/types/truthlens.ts';
import { evaluateCredibility } from './src/utils/credibilityEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const startedAt = Date.now();

// In-memory application store seeded with curated media articles & registries
const articles: Article[] = structuredClone(SEED_ARTICLES);
const sources: SourceReputation[] = structuredClone(SEED_SOURCES);
const reports: UserReport[] = structuredClone(SEED_REPORTS);
const appeals: FlagAppeal[] = structuredClone(SEED_APPEALS);

const VALID_REPORT_STATUSES: ReportStatus[] = ['pending', 'confirmed', 'dismissed', 'needs_review'];
const VALID_APPEAL_STATUSES: AppealStatus[] = [
  'open',
  'upheld_flag',
  'overturned_flag',
  'needs_more_evidence',
];
const VALID_ARTICLE_STATUSES: CredibilityStatus[] = [
  'reliable',
  'caution',
  'flagged',
  'insufficient_evidence',
];

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'truthlens-p58-api',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/metrics', (_req, res) => {
    const statusBreakdown = articles.reduce(
      (acc, item) => {
        acc[item.analysis.status] = (acc[item.analysis.status] || 0) + 1;
        return acc;
      },
      {} as Record<CredibilityStatus, number>
    );

    res.json({
      totalArticles: articles.length,
      statusBreakdown,
      pendingReports: reports.filter((r) => r.status === 'pending' || r.status === 'needs_review').length,
      totalReports: reports.length,
      openAppeals: appeals.filter((a) => a.status === 'open').length,
      totalAppeals: appeals.length,
      registeredSources: sources.length,
      handbookTargets: {
        flagPrecisionTarget: 0.75,
        testCoverageTarget: 0.8,
        blockerDefectsGate: 0,
      },
    });
  });

  app.get('/api/articles', (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

    const filtered = articles.filter((article) => {
      if (status && status !== 'all' && article.analysis.status !== status) return false;
      if (category && category !== 'all' && article.category !== category) return false;
      if (query) {
        const haystack = `${article.title} ${article.summary} ${article.sourceName} ${article.sourceDomain} ${article.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    res.json({ articles: filtered });
  });

  app.get('/api/articles/:id', (req, res) => {
    const article = articles.find((a) => a.id === req.params.id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json({ article });
  });

  app.post('/api/analyze', (req, res) => {
    const { title, content, sourceDomain } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 5) {
      res.status(400).json({ error: 'Please provide an article headline of at least 5 characters.' });
      return;
    }
    if (typeof content !== 'string' || content.trim().length < 10) {
      res.status(400).json({ error: 'Please provide article body text of at least 10 characters.' });
      return;
    }

    const analysis = evaluateCredibility(
      title,
      content,
      typeof sourceDomain === 'string' ? sourceDomain : '',
      sources
    );
    res.json({ analysis });
  });

  app.get('/api/sources', (_req, res) => {
    res.json({ sources });
  });

  app.get('/api/reports', (_req, res) => {
    const ordered = [...reports].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ reports: ordered });
  });

  app.post('/api/reports', (req, res) => {
    const { articleId, reporterName, reasonCategory, details, supportingUrl } = req.body ?? {};
    const targetArticle = articles.find((a) => a.id === articleId);
    if (!targetArticle) {
      res.status(404).json({ error: 'Target article not found.' });
      return;
    }
    if (typeof details !== 'string' || details.trim().length < 10) {
      res.status(400).json({ error: 'Please enter at least 10 characters explaining the report.' });
      return;
    }

    const validReasons = [
      'fabricated_claim',
      'misleading_headline',
      'out_of_context',
      'unverified_source',
      'manipulated_data',
    ];
    const safeReason = validReasons.includes(reasonCategory) ? reasonCategory : 'misleading_headline';

    const newReport: UserReport = {
      id: `rep-${Date.now().toString().slice(-5)}`,
      articleId: targetArticle.id,
      articleTitle: targetArticle.title,
      reporterName:
        typeof reporterName === 'string' && reporterName.trim()
          ? reporterName.trim().slice(0, 80)
          : 'Anonymous Reader',
      reasonCategory: safeReason,
      details: details.trim().slice(0, 1200),
      supportingUrl:
        typeof supportingUrl === 'string' && supportingUrl.trim()
          ? supportingUrl.trim().slice(0, 300)
          : undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    reports.unshift(newReport);
    targetArticle.reportCount += 1;

    res.status(201).json({
      report: newReport,
      confirmationMessage: `Report ${newReport.id} logged for moderator review.`,
    });
  });

  app.patch('/api/reports/:id', (req, res) => {
    const report = reports.find((r) => r.id === req.params.id);
    if (!report) {
      res.status(404).json({ error: 'Report not found.' });
      return;
    }

    const { status, moderatorNote, updatedArticleStatus } = req.body ?? {};
    if (!VALID_REPORT_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid report status.' });
      return;
    }

    report.status = status;
    report.reviewedAt = new Date().toISOString();
    if (typeof moderatorNote === 'string') {
      report.moderatorNote = moderatorNote.trim().slice(0, 1000);
    }

    const linkedArticle = articles.find((a) => a.id === report.articleId);
    if (linkedArticle && VALID_ARTICLE_STATUSES.includes(updatedArticleStatus)) {
      linkedArticle.analysis.status = updatedArticleStatus;
      linkedArticle.analysis.headlineReason = `Moderator Decision (${status}): ${
        report.moderatorNote || linkedArticle.analysis.headlineReason
      }`;
      linkedArticle.analysis.evaluatedAt = new Date().toISOString();
    }

    res.json({ report, article: linkedArticle });
  });

  app.get('/api/appeals', (_req, res) => {
    const ordered = [...appeals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ appeals: ordered });
  });

  app.post('/api/appeals', (req, res) => {
    const { articleId, appellantName, rationale, evidenceUrl } = req.body ?? {};
    const targetArticle = articles.find((a) => a.id === articleId);
    if (!targetArticle) {
      res.status(404).json({ error: 'Target article not found.' });
      return;
    }
    if (typeof rationale !== 'string' || rationale.trim().length < 10) {
      res.status(400).json({ error: 'Please provide at least 10 characters explaining your appeal.' });
      return;
    }

    const newAppeal: FlagAppeal = {
      id: `app-${Date.now().toString().slice(-5)}`,
      articleId: targetArticle.id,
      articleTitle: targetArticle.title,
      appellantName:
        typeof appellantName === 'string' && appellantName.trim()
          ? appellantName.trim().slice(0, 80)
          : 'Reader / Publisher',
      currentStatus: targetArticle.analysis.status,
      rationale: rationale.trim().slice(0, 1200),
      evidenceUrl:
        typeof evidenceUrl === 'string' && evidenceUrl.trim()
          ? evidenceUrl.trim().slice(0, 300)
          : undefined,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    appeals.unshift(newAppeal);
    targetArticle.appealCount += 1;

    res.status(201).json({
      appeal: newAppeal,
      confirmationMessage: `Appeal ${newAppeal.id} submitted to the moderator queue.`,
    });
  });

  app.patch('/api/appeals/:id', (req, res) => {
    const appeal = appeals.find((a) => a.id === req.params.id);
    if (!appeal) {
      res.status(404).json({ error: 'Appeal not found.' });
      return;
    }

    const { status, moderatorDecisionNote } = req.body ?? {};
    if (!VALID_APPEAL_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid appeal status.' });
      return;
    }

    appeal.status = status;
    appeal.resolvedAt = new Date().toISOString();
    if (typeof moderatorDecisionNote === 'string') {
      appeal.moderatorDecisionNote = moderatorDecisionNote.trim().slice(0, 1000);
    }

    const linkedArticle = articles.find((a) => a.id === appeal.articleId);
    if (linkedArticle) {
      if (status === 'overturned_flag') {
        linkedArticle.analysis.status = 'reliable';
        linkedArticle.analysis.headlineReason =
          'Appeal upheld by human moderator — primary evidence verified';
        linkedArticle.analysis.uncertaintyNotice = undefined;
      } else if (status === 'needs_more_evidence') {
        linkedArticle.analysis.status = 'insufficient_evidence';
        linkedArticle.analysis.headlineReason =
          'Moderator requested additional primary corroboration';
      }
      linkedArticle.analysis.evaluatedAt = new Date().toISOString();
    }

    res.json({ appeal, article: linkedArticle });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TruthLens P58 server listening on http://0.0.0.0:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start TruthLens server:', err);
  process.exit(1);
});
