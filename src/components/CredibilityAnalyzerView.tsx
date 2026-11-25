import { ArrowRight, ExternalLink, FlaskConical, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { CredibilityAnalysis } from '../types/truthlens';
import { getStatusMeta, StatusIndicator } from './StatusIndicator';

const ANALYZER_PRESETS = [
  {
    id: 'flagged-tc03',
    label: 'TC-03 Flagged Health Claim',
    title: 'SHOCKING Miracle Herb 100% Cures Hypertension Overnight — Mainstream Media Hides It!',
    sourceDomain: 'viralhealthalert.net',
    content:
      'Doctors are baffled as this miracle herb 100% cures blood pressure overnight! The secret they hide is being banned tomorrow while mainstream media refuses to cover leaked insider notes!!',
  },
  {
    id: 'uncertain-tc04',
    label: 'TC-04 Insufficient Evidence',
    title: 'Unconfirmed Note: Regional Rail Signal Delay Allegedly Tied to Sensor Glitch',
    sourceDomain: 'earlypulse.blog',
    content:
      'Early reports suggest a morning commuter line delay allegedly resulted from a trackside sensor update, though rail officials have not issued preliminary logs yet.',
  },
  {
    id: 'reliable',
    label: 'Peer-Reviewed Reporting',
    title: 'Peer-Reviewed Coastal Erosion Audit Publishes 10-Year Satellite Telemetry',
    sourceDomain: 'nature.com',
    content:
      'Published in Nature Geoscience, the 10-year coastal survey analyzed 4,200 shoreline transects with transparent methodology and sample size disclosures. According to the report and coastal agency data released Tuesday, restoration marshes reduced erosion by 18.4%. A ministry spokesperson confirmed quarterly open-data updates.',
  },
];

export function CredibilityAnalyzerView() {
  const [title, setTitle] = useState(ANALYZER_PRESETS[0].title);
  const [sourceDomain, setSourceDomain] = useState(ANALYZER_PRESETS[0].sourceDomain);
  const [content, setContent] = useState(ANALYZER_PRESETS[0].content);
  const [analysis, setAnalysis] = useState<CredibilityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (payload?: { title: string; sourceDomain: string; content: string }) => {
    const activePayload = payload ?? { title, sourceDomain, content };
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePayload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Analysis failed.');
      } else {
        setAnalysis(data.analysis);
      }
    } catch {
      setError('Unable to reach /api/analyze endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: (typeof ANALYZER_PRESETS)[number]) => {
    setTitle(preset.title);
    setSourceDomain(preset.sourceDomain);
    setContent(preset.content);
    void runAnalysis(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runAnalysis();
  };

  const statusMeta = analysis ? getStatusMeta(analysis.status) : null;

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
          Section 4.1 · Explainable Pipeline
        </p>
        <h1 className="mt-2 font-editorial text-3xl font-semibold text-[#F8FAFC] sm:text-4xl">
          Live Article Credibility Analyzer
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Test any headline, body excerpt, and source domain against TruthLens’s 6-step text feature classifier and curated Source Reputation Registry via <span className="font-mono text-xs text-amber-200">POST /api/analyze</span>.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-slate-400 mr-1">Test Presets:</span>
        {ANALYZER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className="rounded-md border border-white/10 bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-amber-400/40 hover:text-amber-200"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 space-y-4 rounded-lg border border-white/10 bg-[#111827] p-6"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Article Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news headline..."
              className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Source Domain (e.g., nature.com, reuters.com, viralhealthalert.net)
            </label>
            <input
              type="text"
              value={sourceDomain}
              onChange={(e) => setSourceDomain(e.target.value)}
              placeholder="e.g., reuters.com or unknown-blog.org"
              className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 font-mono text-xs text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Article Excerpt or Claim Body *
            </label>
            <textarea
              required
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the article paragraph or viral claim text..."
              className="w-full rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
            >
              <FlaskConical className="h-4 w-4" />
              <span>{loading ? 'Running 6-Step Classifier...' : 'Evaluate Credibility'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setSourceDomain('');
                setContent('');
                setAnalysis(null);
                setError(null);
              }}
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2.5 text-slate-300 hover:text-white"
              aria-label="Clear analyzer form"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          {!analysis ? (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#0F1520] p-8 text-center">
              <FlaskConical className="h-8 w-8 text-amber-300/70" />
              <h2 className="mt-4 font-editorial text-xl text-white">
                Ready to inspect text & source signals
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Click <strong className="text-slate-200">Evaluate Credibility</strong> or select a test preset above to observe how TruthLens scores sensationalism, source reputation, evidence links, and uncertainty safeguards.
              </p>
            </div>
          ) : (
            <div className="space-y-5 rounded-lg border border-white/10 bg-[#111827] p-6">
              {/* Verdict Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <StatusIndicator status={analysis.status} />
                <span className="font-mono text-xs text-slate-300 tabular-nums">
                  Combined Score: <strong className="text-white">{analysis.combinedScore}/100</strong> · Confidence{' '}
                  {analysis.confidenceScore}%
                </span>
              </div>

              {statusMeta && (
                <div className={`rounded-md border p-4 ${statusMeta.borderColor} ${statusMeta.surfaceColor}`}>
                  <p className="text-sm font-semibold text-white">{analysis.headlineReason}</p>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                    {analysis.detailedExplanation}
                  </p>
                  {analysis.uncertaintyNotice && (
                    <p className="mt-3 border-t border-sky-400/25 pt-2.5 text-xs font-medium text-sky-200">
                      {analysis.uncertaintyNotice}
                    </p>
                  )}
                </div>
              )}

              {/* 6-Step Pipeline Trace */}
              <div className="space-y-2.5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  6-Step Classification Trace
                </h3>
                <div className="divide-y divide-white/10 rounded-md border border-white/10 bg-[#0B0F17]">
                  {analysis.pipelineSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 font-medium text-slate-200">
                        <span className="font-mono text-amber-300 tabular-nums">0{step.step}</span>
                        <ArrowRight className="h-3 w-3 text-slate-500" />
                        <span>{step.label}</span>
                      </div>
                      <span className="font-mono text-slate-400 sm:text-right">{step.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Links */}
              <div className="space-y-2.5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Evidence References Attached
                </h3>
                <div className="space-y-2">
                  {analysis.evidenceLinks.map((ev, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-white/10 bg-[#0B0F17] p-3.5"
                    >
                      <div>
                        <p className="font-mono text-xs text-amber-300 uppercase">
                          {ev.publisher} · {ev.stance}
                        </p>
                        <p className="text-xs font-medium text-white mt-0.5">{ev.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{ev.summary}</p>
                      </div>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-white/15 px-2.5 py-1.5 text-xs text-slate-200 shrink-0 hover:bg-white/5"
                      >
                        <span>Verify</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
