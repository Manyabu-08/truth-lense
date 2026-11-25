import { CheckCircle2, ExternalLink, Globe2, Scale, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import type {
  AppealStatus,
  CredibilityStatus,
  FlagAppeal,
  ReportStatus,
  SourceReputation,
  UserReport,
} from '../types/truthlens';
import { StatusIndicator } from './StatusIndicator';

interface ModeratorViewProps {
  reports: UserReport[];
  appeals: FlagAppeal[];
  sources: SourceReputation[];
  onReportUpdated: (report: UserReport) => void;
  onAppealUpdated: (appeal: FlagAppeal) => void;
}

export function ModeratorView({
  reports,
  appeals,
  sources,
  onReportUpdated,
  onAppealUpdated,
}: ModeratorViewProps) {
  const [activeSection, setActiveSection] = useState<'reports' | 'appeals' | 'sources'>('reports');
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pendingCount = reports.filter(
    (r) => r.status === 'pending' || r.status === 'needs_review'
  ).length;
  const openAppealsCount = appeals.filter((a) => a.status === 'open').length;

  const updateReportStatus = async (
    report: UserReport,
    status: ReportStatus,
    updatedArticleStatus?: CredibilityStatus
  ) => {
    setSavingId(report.id);
    setToast(null);
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          moderatorNote: notesById[report.id] ?? report.moderatorNote ?? '',
          updatedArticleStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.report) {
        onReportUpdated(data.report);
        setToast(`Report ${report.id} updated to "${status}".`);
      }
    } finally {
      setSavingId(null);
    }
  };

  const updateAppealStatus = async (appeal: FlagAppeal, status: AppealStatus) => {
    setSavingId(appeal.id);
    setToast(null);
    try {
      const res = await fetch(`/api/appeals/${appeal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          moderatorDecisionNote: notesById[appeal.id] ?? appeal.moderatorDecisionNote ?? '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.appeal) {
        onAppealUpdated(data.appeal);
        setToast(`Appeal ${appeal.id} marked "${status.replace(/_/g, ' ')}".`);
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
            TC-05 & TC-06 · Human-in-the-Loop Governance
          </p>
          <h1 className="mt-2 font-editorial text-3xl font-semibold text-[#F8FAFC] sm:text-4xl">
            Moderator Review & Source Registry
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Inspect community misinformation reports, resolve publisher or reader appeals, and audit domain reputation scores. Human moderators hold override authority over automated flags.
          </p>
        </div>

        <dl className="flex gap-6 rounded-lg border border-white/10 bg-[#111827] px-5 py-3">
          <div>
            <dt className="text-xs text-slate-400">Pending Reports</dt>
            <dd className="font-mono text-xl font-semibold text-amber-300 tabular-nums">
              {pendingCount}
            </dd>
          </div>
          <div className="border-l border-white/10 pl-6">
            <dt className="text-xs text-slate-400">Open Appeals</dt>
            <dd className="font-mono text-xl font-semibold text-sky-300 tabular-nums">
              {openAppealsCount}
            </dd>
          </div>
        </dl>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSection('reports')}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition ${
            activeSection === 'reports'
              ? 'bg-amber-400/15 text-amber-200 border border-amber-400/35'
              : 'border border-white/10 bg-[#111827] text-slate-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Reader Reports ({reports.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('appeals')}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition ${
            activeSection === 'appeals'
              ? 'bg-sky-400/15 text-sky-200 border border-sky-400/35'
              : 'border border-white/10 bg-[#111827] text-slate-300 hover:text-white'
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          <span>Flag Appeals ({appeals.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('sources')}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition ${
            activeSection === 'sources'
              ? 'bg-emerald-400/15 text-emerald-200 border border-emerald-400/35'
              : 'border border-white/10 bg-[#111827] text-slate-300 hover:text-white'
          }`}
        >
          <Globe2 className="h-3.5 w-3.5" />
          <span>Source Reputation Registry ({sources.length})</span>
        </button>
      </div>

      {/* Reports Queue */}
      {activeSection === 'reports' && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-white/10 bg-[#111827] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <p className="font-mono text-xs text-slate-400 tabular-nums">
                  {report.id} · Reporter: {report.reporterName} · Reason:{' '}
                  {report.reasonCategory.replace(/_/g, ' ')} ·{' '}
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-300">
                  Status: {report.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h2 className="font-editorial text-lg font-medium text-white">
                  {report.articleTitle}
                </h2>
                <p className="mt-1.5 text-sm text-slate-300">{report.details}</p>
                {report.supportingUrl && (
                  <a
                    href={report.supportingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-sky-300 hover:underline"
                  >
                    <span>Inspect Submitted Reference</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={notesById[report.id] ?? report.moderatorNote ?? ''}
                  onChange={(e) =>
                    setNotesById((prev) => ({ ...prev, [report.id]: e.target.value }))
                  }
                  placeholder="Add moderator decision note..."
                  className="flex-1 rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={savingId === report.id}
                    onClick={() => updateReportStatus(report, 'confirmed', 'flagged')}
                    className="rounded-md bg-rose-500/20 border border-rose-500/35 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-500/30 disabled:opacity-50"
                  >
                    Confirm & Flag Article
                  </button>
                  <button
                    type="button"
                    disabled={savingId === report.id}
                    onClick={() => updateReportStatus(report, 'needs_review')}
                    className="rounded-md bg-amber-400/15 border border-amber-400/35 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-400/25 disabled:opacity-50"
                  >
                    Needs Evidence
                  </button>
                  <button
                    type="button"
                    disabled={savingId === report.id}
                    onClick={() => updateReportStatus(report, 'dismissed')}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appeals Queue */}
      {activeSection === 'appeals' && (
        <div className="space-y-4">
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="rounded-lg border border-white/10 bg-[#111827] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <p className="font-mono text-xs text-slate-400 tabular-nums">
                  {appeal.id} · Appellant: {appeal.appellantName} ·{' '}
                  {new Date(appeal.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center gap-3">
                  <StatusIndicator status={appeal.currentStatus} compact />
                  <span className="font-mono text-xs uppercase text-sky-300">
                    Appeal: {appeal.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="font-editorial text-lg font-medium text-white">
                  {appeal.articleTitle}
                </h2>
                <p className="mt-1.5 text-sm text-slate-300">{appeal.rationale}</p>
                {appeal.evidenceUrl && (
                  <a
                    href={appeal.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-sky-300 hover:underline"
                  >
                    <span>View Appellant Evidence</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={notesById[appeal.id] ?? appeal.moderatorDecisionNote ?? ''}
                  onChange={(e) =>
                    setNotesById((prev) => ({ ...prev, [appeal.id]: e.target.value }))
                  }
                  placeholder="Record moderator resolution rationale..."
                  className="flex-1 rounded-md border border-white/10 bg-[#0B0F17] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={savingId === appeal.id}
                    onClick={() => updateAppealStatus(appeal, 'overturned_flag')}
                    className="rounded-md bg-emerald-500/20 border border-emerald-500/35 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
                  >
                    Overturn Flag (Mark Reliable)
                  </button>
                  <button
                    type="button"
                    disabled={savingId === appeal.id}
                    onClick={() => updateAppealStatus(appeal, 'needs_more_evidence')}
                    className="rounded-md bg-sky-500/20 border border-sky-500/35 px-3 py-1.5 text-xs font-medium text-sky-200 hover:bg-sky-500/30 disabled:opacity-50"
                  >
                    Request More Evidence
                  </button>
                  <button
                    type="button"
                    disabled={savingId === appeal.id}
                    onClick={() => updateAppealStatus(appeal, 'upheld_flag')}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
                  >
                    Uphold Original Flag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source Reputation Registry */}
      {activeSection === 'sources' && (
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#111827]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#0D131E] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Domain & Publisher</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3">Fact-Check & Ownership Context</th>
                <th className="px-4 py-3 text-right">Audited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sources.map((src) => (
                <tr key={src.domain} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-white">{src.name}</div>
                    <div className="font-mono text-slate-400">{src.domain}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300 capitalize">
                    {src.tier.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-semibold tabular-nums text-white">
                    {src.reputationScore}/100
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 max-w-md">
                    <p>{src.factCheckHistory}</p>
                    <p className="mt-1 text-slate-400">Ownership: {src.ownershipTransparency}</p>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-400 tabular-nums">
                    {src.lastAudited}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
