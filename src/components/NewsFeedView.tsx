import { ArrowUpRight, BookOpen, ExternalLink, Filter, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Article, CredibilityStatus } from '../types/truthlens';
import { getStatusMeta, StatusIndicator } from './StatusIndicator';

interface NewsFeedViewProps {
  articles: Article[];
  loading: boolean;
  onSelectArticle: (article: Article) => void;
  onNavigateAnalyzer: () => void;
  onNavigateReport: () => void;
}

const STATUS_FILTERS: { id: 'all' | CredibilityStatus; label: string }[] = [
  { id: 'all', label: 'All Coverage' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'caution', label: 'Caution' },
  { id: 'insufficient_evidence', label: 'Insufficient Evidence' },
  { id: 'reliable', label: 'Reliable' },
];

const CATEGORIES = ['all', 'Science & Health', 'Economy', 'Policy', 'Technology', 'Climate'] as const;

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function NewsFeedView({
  articles,
  loading,
  onSelectArticle,
  onNavigateAnalyzer,
  onNavigateReport,
}: NewsFeedViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | CredibilityStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      if (statusFilter !== 'all' && article.analysis.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && article.category !== categoryFilter) return false;
      if (q) {
        const haystack = `${article.title} ${article.summary} ${article.sourceName} ${article.sourceDomain} ${article.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [articles, statusFilter, categoryFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      total: articles.length,
      flagged: articles.filter((a) => a.analysis.status === 'flagged').length,
      uncertain: articles.filter((a) => a.analysis.status === 'insufficient_evidence').length,
      reliable: articles.filter((a) => a.analysis.status === 'reliable').length,
    };
  }, [articles]);

  const leadArticle = filteredArticles[0];
  const secondaryArticles = filteredArticles.slice(1);

  return (
    <div className="space-y-10">
      {/* Editorial Hero Section */}
      <section className="border-b border-white/10 pb-8 pt-2">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
              P58 Integrated Project · Media Domain
            </p>
            <h1 className="font-editorial text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-5xl leading-[1.12]">
              News aggregation paired with explainable misinformation flagging.
            </h1>
            <p className="max-w-2xl text-base text-slate-300 leading-relaxed">
              TruthLens combines linguistic feature analysis and source reputation auditing to surface why a headline is verified, uncertain, or flagged — with primary evidence links and human appeal workflows rather than bare binary verdicts.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onNavigateAnalyzer}
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                <span>Analyze Headline or Text</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateReport}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>Read P58 Project Report</span>
              </button>
            </div>
          </div>

          {/* Grounded Live Feed Summary Grid */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Live Index Summary
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {counts.total} Stories
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-slate-400">Reliable</dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
                    {counts.reliable}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Flagged</dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold text-rose-400 tabular-nums">
                    {counts.flagged}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Uncertain</dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold text-sky-300 tabular-nums">
                    {counts.uncertain}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-400 leading-relaxed">
                Flags act as advisory cues for readers and moderators — never automated censorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section aria-label="Filter aggregated news" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Credibility filter">
            {STATUS_FILTERS.map((filter) => {
              const active = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-amber-400/15 text-amber-200 border border-amber-400/35'
                      : 'border border-white/10 bg-[#111827] text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                aria-label="Filter by news category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-44 rounded-md border border-white/10 bg-[#111827] py-2 pl-8 pr-3 text-xs text-slate-200 focus:border-amber-400/50 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, sources, domains..."
                className="w-full rounded-md border border-white/10 bg-[#111827] py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feed Content */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="h-56 animate-pulse rounded-lg border border-white/10 bg-[#111827]"
            />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#111827] px-6 py-14 text-center">
          <p className="font-editorial text-xl text-slate-100">
            No indexed articles match the active filters
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Clear your search terms or reset the credibility status filter to browse all coverage.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="mt-5 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tier 1: Lead Featured Story */}
          {leadArticle && (
            <article className="rounded-lg border border-white/10 bg-[#111827] p-6 sm:p-8 transition hover:border-white/20">
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <p className="font-mono text-xs text-slate-400">
                      {leadArticle.sourceName} · {leadArticle.category} ·{' '}
                      <span className="tabular-nums">{formatTimestamp(leadArticle.publishedAt)}</span> ·{' '}
                      <span className="tabular-nums">{leadArticle.readTimeMinutes} min read</span>
                    </p>
                    <StatusIndicator status={leadArticle.analysis.status} />
                  </div>

                  <h2
                    onClick={() => onSelectArticle(leadArticle)}
                    className="cursor-pointer font-editorial text-2xl font-semibold text-[#F8FAFC] sm:text-3xl leading-snug hover:text-amber-200 transition-colors"
                  >
                    {leadArticle.title}
                  </h2>

                  <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
                    {leadArticle.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectArticle(leadArticle)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200"
                    >
                      <span>Inspect Evidence & Credibility Report</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {leadArticle.reportCount} user reports · {leadArticle.appealCount} appeals
                    </span>
                  </div>
                </div>

                {/* Right Rationale Rail */}
                <div className="lg:col-span-4 flex flex-col justify-between rounded-md border border-white/10 bg-[#0D131E] p-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                        Credibility Assessment
                      </span>
                      <span className="font-mono text-sm font-semibold text-slate-100 tabular-nums">
                        {leadArticle.analysis.combinedScore}/100
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-100">
                      {leadArticle.analysis.headlineReason}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {leadArticle.analysis.detailedExplanation}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-xs text-slate-400 tabular-nums">
                    <span>NLP {leadArticle.analysis.textClassifierScore}/100</span>
                    <span>Source {leadArticle.analysis.sourceReputationScore}/100</span>
                    <span>{leadArticle.analysis.evidenceLinks.length} Evidence</span>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Tier 2: Secondary Story Grid */}
          {secondaryArticles.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {secondaryArticles.map((article) => {
                const statusMeta = getStatusMeta(article.analysis.status);
                return (
                  <article
                    key={article.id}
                    className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#111827] p-6 transition hover:border-white/20"
                  >
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <span className="font-mono text-xs text-slate-400">
                          {article.sourceDomain} · {article.category} ·{' '}
                          <span className="tabular-nums">{formatTimestamp(article.publishedAt)}</span>
                        </span>
                        <StatusIndicator status={article.analysis.status} compact />
                      </div>

                      <h3
                        onClick={() => onSelectArticle(article)}
                        className="cursor-pointer font-editorial text-xl font-semibold text-[#F8FAFC] leading-snug hover:text-amber-200 transition-colors"
                      >
                        {article.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>

                      {/* Explainable Rationale Inline Box (TC-03 & TC-04) */}
                      <div
                        className={`rounded-md border px-3.5 py-2.5 ${statusMeta.borderColor} ${statusMeta.surfaceColor}`}
                      >
                        <p className="text-xs font-medium text-slate-100">
                          {article.analysis.headlineReason}
                        </p>
                        {article.analysis.uncertaintyNotice && (
                          <p className="mt-1 text-xs text-sky-200/90">
                            {article.analysis.uncertaintyNotice}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-3 font-mono text-xs text-slate-400 tabular-nums">
                        <span>Score {article.analysis.combinedScore}/100</span>
                        <span>·</span>
                        <span>{article.analysis.evidenceLinks.length} Evidence Link(s)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectArticle(article)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
                      >
                        <span>Inspect & Report</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Responsible AI Guardrail Notice */}
      <section className="rounded-lg border border-white/10 bg-[#0F1520] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="font-semibold text-slate-100">Responsible AI Principle:</strong>{' '}
            Every TruthLens flag includes extracted text signals, source reputation context, and external evidence links. Unverified claims with low evidence trigger an <span className="font-mono text-sky-300">Insufficient Evidence</span> notice instead of a forced guess.
          </p>
        </div>
      </section>
    </div>
  );
}
