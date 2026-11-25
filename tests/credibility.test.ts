import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SEED_APPEALS,
  SEED_ARTICLES,
  SEED_REPORTS,
  SEED_SOURCES,
} from '../src/data/seedData.ts';
import { evaluateCredibility } from '../src/utils/credibilityEngine.ts';

test('TC-01: Aggregated news feed contains recent articles with source, timestamp, and analysis', () => {
  assert.ok(SEED_ARTICLES.length >= 5, 'Expected at least 5 seeded news articles');
  for (const article of SEED_ARTICLES) {
    assert.ok(article.title.trim().length > 10);
    assert.ok(article.sourceName.trim().length > 0);
    assert.ok(!Number.isNaN(Date.parse(article.publishedAt)));
    assert.ok(article.analysis.headlineReason.trim().length > 0);
  }
});

test('TC-02 & TC-05: Seeded reader reports have valid structure and moderation states', () => {
  assert.ok(SEED_REPORTS.length >= 1);
  for (const report of SEED_REPORTS) {
    assert.ok(report.articleId.length > 0);
    assert.ok(report.details.length >= 10);
    assert.ok(['pending', 'confirmed', 'dismissed', 'needs_review'].includes(report.status));
  }
});

test('TC-03: Flagged misinformation provides explanation, features, and supporting evidence links', () => {
  const analysis = evaluateCredibility(
    'SHOCKING Miracle Cure 100% Eliminates Chronic Illness Overnight!!',
    'Doctors are baffled! Mainstream media refuses to publish leaked memo from anonymous insiders claim!',
    'viralhealthalert.net',
    SEED_SOURCES
  );

  assert.equal(analysis.status, 'flagged');
  assert.ok(analysis.headlineReason.length > 10);
  assert.ok(analysis.detailedExplanation.length > 20);
  assert.ok(analysis.evidenceLinks.length >= 1, 'Flagged article must attach evidence links');
  assert.ok(analysis.features.clickbaitSignals.length >= 1);
});

test('TC-04: Thin uncorroborated claim triggers insufficient_evidence safeguard', () => {
  const analysis = evaluateCredibility(
    'Substation Note: Unconfirmed Voltage Dip',
    'Early reports suggest two lines allegedly tripped, with no preliminary utility log released yet.',
    'unknown-local-notes.org',
    SEED_SOURCES
  );

  assert.equal(analysis.status, 'insufficient_evidence');
  assert.ok(
    analysis.uncertaintyNotice && analysis.uncertaintyNotice.includes('Insufficient'),
    'Expected explicit uncertainty notice for insufficient evidence'
  );
});

test('TC-06: Flag appeals link to valid articles and preserve rationale', () => {
  assert.ok(SEED_APPEALS.length >= 1);
  for (const appeal of SEED_APPEALS) {
    const linked = SEED_ARTICLES.find((a) => a.id === appeal.articleId);
    assert.ok(linked, `Expected appeal ${appeal.id} to reference an existing article`);
    assert.ok(appeal.rationale.length >= 10);
  }
});

test('Reliable peer-reviewed reporting from established domain scores reliable', () => {
  const analysis = evaluateCredibility(
    'Peer-Reviewed Coastal Erosion Audit Publishes 10-Year Satellite Telemetry',
    'Published in Nature Geoscience, the study analyzed 4,200 transects with clear methodology and sample size. According to the report and data released Tuesday, a spokesperson confirmed quarterly open updates.',
    'nature.com',
    SEED_SOURCES
  );

  assert.equal(analysis.status, 'reliable');
  assert.ok(analysis.combinedScore >= 72);
  assert.ok(analysis.features.reputableMarkers.length >= 2);
});
