import { CheckCircle2, ExternalLink, Flag, Scale, X } from 'lucide-react';
import { useState } from 'react';
import type { Article, FlagAppeal, UserReport } from '../types/truthlens';
import { getStatusMeta, StatusIndicator } from './StatusIndicator';

interface ArticleDetailModalProps {
  article: Article;
  initialMode?: 'inspect' | 'report' | 'appeal';
  onClose: () => void;
  onReportSubmitted: (report: UserReport, confirmation: string) => void;
  onAppealSubmitted: (appeal: FlagAppeal, confirmation: string) => void;
}

export function ArticleDetailModal({
  article,
  initialMode = 'inspect',
  onClose,
  onReportSubmitted,
  onAppealSubmitted,
}: ArticleDetailModalProps) {
  const [activeAction, setActiveAction] = useState<'inspect' | 'report' | 'appeal'>(initialMode);

  // Report state (TC-02)
  const [reporterName, setReporterName] = useState('');
  const [reasonCategory, setReasonCategory] = useState<UserReport['reasonCategory']>('misleading_headline');
  const [reportDetails, setReportDetails] = useState('');
  const [supportingUrl, setSupportingUrl] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Appeal state (TC-06)
  const [appellantName, setAppellantName] = useState('');
  const [appealRationale, setAppealRationale] = useState('');
  const [appealEvidenceUrl, setAppealEvidenceUrl] = useState('');
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [appealFeedback, setAppealFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const statusMeta = getStatusMeta(article.analysis.status);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportFeedback(null);
    setSubmittingReport(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          reporterName,
          reasonCategory,
          details: reportDetails,
          supportingUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReportFeedback({ type: 'err', msg: data.error || 'Unable to submit report.' });
      } else {
        setReportFeedback({ type: 'ok', msg: data.confirmationMessage });
        setReportDetails('');
        setSupportingUrl('');
        onReportSubmitted(data.report, data.confirmationMessage);
      }
    } catch {
      setReportFeedback({ type: 'err', msg: 'Network error while submitting report.' });
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppealFeedback(null);
    setSubmittingAppeal(true);
    try {
      const res = await fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          appellantName,
          rationale: appealRationale,
          evidenceUrl: appealEvidenceUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAppealFeedback({ type: 'err', msg: data.error || 'Unable to submit appeal.' });
      } else {
        setAppealFeedback({ type: 'ok', msg: data.confirmationMessage });
        setAppealRationale('');
        setAppealEvidenceUrl('');
        onAppealSubmitted(data.appeal, data.confirmationMessage);
      }
    } catch {
      setAppealFeedback({ type: 'err', msg: 'Network error while submitting appeal.' });
    } finally {
      setSubmittingAppeal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0E1420] shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div className="space-y-1">
            <p className="font-mono text-xs text-slate-400">
              {article.sourceName} ({article.sourceDomain}) · {article.author} · {article.category}
            </p>
            <StatusIndicator status={article.analysis.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Close article inspector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Switch Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0B0F17] px-6 py-2.5">
          <button
            type="button"
            onClick={() => setActiveAction('inspect')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeAction === 'inspect'
                ? 'bg-amber-400/15 text-amber-200 border border-amber-400/35'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Credibility & Evidence
          </button>
          <button
            type="button"
            onClick={() => setActiveAction('report')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeAction === 'report'
                ? 'bg-rose-500/15 text-rose-200 border border-rose-500/35'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flag className="h-3.5 w-3.5" />
            <span>Submit Report (TC-02)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveAction('appeal')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeAction === 'appeal'
                ? 'bg-sky-400/15 text-sky-200 border border-sky-400/35'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Appeal Flag (TC-06)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          <div className="space-y-3">
            <h2 id="article-modal-title" className="font-editorial text-2xl font-semibold text-white leading-snug">
              {article.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{article.content}</p>
          </div>

          {activeAction === 'inspect' && (
            <div className="space-y-6">
              {/* Explainable Credibility Summary */}
              <div className={`rounded-lg border p-5 ${statusMeta.borderColor} ${statusMeta.surfaceColor}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {article.analysis.headlineReason}
                  </h3>
                  <span className="font-mono text-xs text-slate-200 tabular-nums">
                    Combined Index: {article.analysis.combinedScore}/100 · Confidence:{' '}
                    {article.analysis.confidenceScore}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200/90 leading-relaxed">
                  {article.analysis.detailedExplanation}
                </p>
                {article.analysis.uncertaintyNotice && (
                  <p className="mt-3 border-t border-sky-400/25 pt-3 text-xs font-medium text-sky-200">
                    {article.analysis.uncertaintyNotice}
                  </p>
                )}
              </div>

              {/* Quantitative Subscores & Extracted Signals */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#111827] p-4 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    Extracted Text Features
                  </h4>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Text Classifier Score</dt>
                      <dd className="font-mono text-slate-100 tabular-nums">
                        {article.analysis.textClassifierScore}/100
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Source Reputation Score</dt>
                      <dd className="font-mono text-slate-100 tabular-nums">
                        {article.analysis.sourceReputationScore}/100
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Sensationalism Signal</dt>
                      <dd className="font-mono text-slate-100 tabular-nums">
                        {article.analysis.features.sensationalismScore}/100
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Citation Density</dt>
                      <dd className="font-mono text-slate-100 tabular-nums">
                        {article.analysis.features.citationDensity}/100
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Hedging / Uncertainty</dt>
                      <dd className="font-mono text-slate-100 tabular-nums">
                        {article.analysis.features.hedgingAndUncertainty}/100
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#111827] p-4 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    Detected Cues & Markers
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {article.analysis.features.clickbaitSignals.map((sig, i) => (
                      <li key={`cb-${i}`} className="text-rose-300">
                        Risk cue: {sig}
                      </li>
                    ))}
                    {article.analysis.features.unverifiedClaimCues.map((sig, i) => (
                      <li key={`uv-${i}`} className="text-amber-300">
                        Sourcing gap: {sig}
                      </li>
                    ))}
                    {article.analysis.features.reputableMarkers.map((sig, i) => (
                      <li key={`rep-${i}`} className="text-emerald-300">
                        Attribution marker: {sig}
                      </li>
                    ))}
                    {article.analysis.features.clickbaitSignals.length === 0 &&
                      article.analysis.features.unverifiedClaimCues.length === 0 &&
                      article.analysis.features.reputableMarkers.length === 0 && (
                        <li className="text-slate-400">
                          No strong sensationalist or peer-reviewed markers detected in short excerpt.
                        </li>
                      )}
                  </ul>
                </div>
              </div>

              {/* Supporting / Refuting Evidence Links (TC-03) */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Supporting Evidence & Reference Links (TC-03)
                </h4>
                <div className="space-y-3">
                  {article.analysis.evidenceLinks.map((ev, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-[#111827] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-amber-300 uppercase">
                          {ev.publisher} · {ev.stance}
                        </p>
                        <p className="text-sm font-medium text-white">{ev.title}</p>
                        <p className="text-xs text-slate-400">{ev.summary}</p>
                      </div>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 shrink-0 hover:bg-white/10"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeAction === 'report' && (
            <form onSubmit={handleReportSubmit} className="space-y-4 rounded-lg border border-white/10 bg-[#111827] p-5">
              <div>
                <h3 className="text-base font-semibold text-white">Report Suspicious or Misleading Claim</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Reports enter the Moderator Review Queue (TC-02 & TC-05) with your rationale and optional corroborating reference URL.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g., Arjun Rao"
                    className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Concern
                  </label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value as UserReport['reasonCategory'])}
                    className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white focus:border-amber-400/50 focus:outline-none"
                  >
                    <option value="misleading_headline">Misleading Headline</option>
                    <option value="fabricated_claim">Fabricated / Unproven Claim</option>
                    <option value="out_of_context">Out of Context</option>
                    <option value="unverified_source">Unverified Source / Leak</option>
                    <option value="manipulated_data">Manipulated Data or Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Explanation & Specific Claim Details *
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe which statement is inaccurate or unsupported and why..."
                  className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Counter-Evidence URL (optional)
                </label>
                <input
                  type="url"
                  value={supportingUrl}
                  onChange={(e) => setSupportingUrl(e.target.value)}
                  placeholder="https://who.int/... or official bulletin URL"
                  className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                />
              </div>

              {reportFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-xs ${
                    reportFeedback.type === 'ok'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {reportFeedback.type === 'ok' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  <span>{reportFeedback.msg}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="rounded-md bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report for Review'}
                </button>
              </div>
            </form>
          )}

          {activeAction === 'appeal' && (
            <form onSubmit={handleAppealSubmit} className="space-y-4 rounded-lg border border-white/10 bg-[#111827] p-5">
              <div>
                <h3 className="text-base font-semibold text-white">Appeal Credibility Flag or Decision</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Readers or publishers can contest a flag by submitting primary evidence (TC-06). Appeals are reviewed by human moderators.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Appellant / Publisher Name
                  </label>
                  <input
                    type="text"
                    value={appellantName}
                    onChange={(e) => setAppellantName(e.target.value)}
                    placeholder="e.g., Editorial Desk or Reader Name"
                    className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Evidence URL (optional)
                  </label>
                  <input
                    type="url"
                    value={appealEvidenceUrl}
                    onChange={(e) => setAppealEvidenceUrl(e.target.value)}
                    placeholder="https://doi.org/... or official record"
                    className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Appeal Rationale & Supporting Context *
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={appealRationale}
                  onChange={(e) => setAppealRationale(e.target.value)}
                  placeholder="Explain why the automated flag or previous decision should be reconsidered..."
                  className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                />
              </div>

              {appealFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-xs ${
                    appealFeedback.type === 'ok'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {appealFeedback.type === 'ok' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  <span>{appealFeedback.msg}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingAppeal}
                  className="rounded-md bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
                >
                  {submittingAppeal ? 'Submitting Appeal...' : 'Submit Flag Appeal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
