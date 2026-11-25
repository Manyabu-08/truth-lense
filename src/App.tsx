import { useCallback, useEffect, useState } from 'react';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { CredibilityAnalyzerView } from './components/CredibilityAnalyzerView';
import { GitHubCodeView } from './components/GitHubCodeView';
import { ModeratorView } from './components/ModeratorView';
import { Navbar, type ActiveTab } from './components/Navbar';
import { NewsFeedView } from './components/NewsFeedView';
import { ProjectReportView } from './components/ProjectReportView';
import type { Article, FlagAppeal, SourceReputation, UserReport } from './types/truthlens';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [articles, setArticles] = useState<Article[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [appeals, setAppeals] = useState<FlagAppeal[]>([]);
  const [sources, setSources] = useState<SourceReputation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<{
    article: Article;
    mode: 'inspect' | 'report' | 'appeal';
  } | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      const [artRes, repRes, appRes, srcRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/reports'),
        fetch('/api/appeals'),
        fetch('/api/sources'),
      ]);

      if (artRes.ok) {
        const d = await artRes.json();
        setArticles(d.articles ?? []);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setReports(d.reports ?? []);
      }
      if (appRes.ok) {
        const d = await appRes.json();
        setAppeals(d.appeals ?? []);
      }
      if (srcRes.ok) {
        const d = await srcRes.json();
        setSources(d.sources ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch TruthLens data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  const handleOpenQuickReport = () => {
    const defaultTarget =
      articles.find((a) => a.analysis.status === 'flagged') ?? articles[0];
    if (defaultTarget) {
      setSelectedArticle({ article: defaultTarget, mode: 'report' });
    } else {
      setActiveTab('analyzer');
    }
  };

  const handleReportSubmitted = (newReport: UserReport) => {
    setReports((prev) => [newReport, ...prev]);
    setArticles((prev) =>
      prev.map((a) =>
        a.id === newReport.articleId ? { ...a, reportCount: a.reportCount + 1 } : a
      )
    );
  };

  const handleAppealSubmitted = (newAppeal: FlagAppeal) => {
    setAppeals((prev) => [newAppeal, ...prev]);
    setArticles((prev) =>
      prev.map((a) =>
        a.id === newAppeal.articleId ? { ...a, appealCount: a.appealCount + 1 } : a
      )
    );
  };

  const handleReportUpdated = (updated: UserReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    void loadAllData();
  };

  const handleAppealUpdated = (updated: FlagAppeal) => {
    setAppeals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    void loadAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#E6EDF3]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickReport={handleOpenQuickReport}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {activeTab === 'feed' && (
          <NewsFeedView
            articles={articles}
            loading={loading}
            onSelectArticle={(article) =>
              setSelectedArticle({ article, mode: 'inspect' })
            }
            onNavigateAnalyzer={() => setActiveTab('analyzer')}
            onNavigateReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'analyzer' && <CredibilityAnalyzerView />}

        {activeTab === 'moderation' && (
          <ModeratorView
            reports={reports}
            appeals={appeals}
            sources={sources}
            onReportUpdated={handleReportUpdated}
            onAppealUpdated={handleAppealUpdated}
          />
        )}

        {activeTab === 'report' && <ProjectReportView />}

        {activeTab === 'github' && <GitHubCodeView />}
      </main>

      <footer className="border-t border-white/10 bg-[#090D14]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-mono">
            P58 TruthLens · News Aggregator with Misinformation Flagging · Media Domain
          </p>
          <p className="font-mono text-slate-400">
            Manya B U · USN: ENG24CS0126 · Section 5B · 22 Nov 2026
          </p>
        </div>
      </footer>

      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle.article}
          initialMode={selectedArticle.mode}
          onClose={() => setSelectedArticle(null)}
          onReportSubmitted={handleReportSubmitted}
          onAppealSubmitted={handleAppealSubmitted}
        />
      )}
    </div>
  );
}
