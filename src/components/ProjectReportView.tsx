import { FileText } from 'lucide-react';
import { useState } from 'react';
import { P58_REPORT_CHAPTERS, PROJECT_TARGETS, TEST_CASES } from '../data/seedData';

export function ProjectReportView() {
  const [selectedChapter, setSelectedChapter] = useState(P58_REPORT_CHAPTERS[0].number);

  const activeChapter =
    P58_REPORT_CHAPTERS.find((c) => c.number === selectedChapter) ?? P58_REPORT_CHAPTERS[0];

  return (
    <div className="space-y-10">
      {/* Institutional Header */}
      <section className="border-b border-white/10 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Integrated Project Report · AI in Software Engineering
            </p>
            <h1 className="font-editorial text-3xl font-semibold text-[#F8FAFC] sm:text-4xl">
              P58 — TruthLens: News Aggregator with Misinformation Flagging
            </h1>
            <p className="font-mono text-xs text-slate-400">
              Author: <span className="text-slate-200">Manya B U</span> · USN:{' '}
              <span className="text-slate-200">ENG24CS0126</span> · Section:{' '}
              <span className="text-slate-200">5B</span> · Date:{' '}
              <span className="text-slate-200 tabular-nums">22 November 2026</span>
            </p>
          </div>

          <a
            href="/assets/aistudio/TruthLens_Integrated_Project_Report__1__023c883f.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#111827] px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-amber-400/40 hover:text-white shrink-0"
          >
            <FileText className="h-4 w-4 text-amber-300" />
            <span>Open Original Report PDF</span>
          </a>
        </div>
      </section>

      {/* Handbook Targets Strip */}
      <section aria-label="Handbook Project Targets" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECT_TARGETS.map((item) => (
          <div
            key={item.metric}
            className="rounded-lg border border-white/10 bg-[#111827] p-5 space-y-2"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
              {item.status}
            </p>
            <p className="font-mono text-2xl font-semibold text-amber-300 tabular-nums">
              {item.target}
            </p>
            <p className="text-sm font-medium text-white">{item.metric}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{item.scope}</p>
          </div>
        ))}
      </section>

      {/* Bespoke Inline SVG System Architecture Diagram */}
      <section className="rounded-lg border border-white/10 bg-[#111827] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-editorial text-xl font-semibold text-white">
              System Architecture & Request Flow
            </h2>
            <p className="text-xs text-slate-400">
              Chapter 2 Layered Design: React UI → Express REST API → NLP Classifier & Source Registry → Moderator Queue
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">Fig. 2.1</span>
        </div>

        <div className="overflow-x-auto rounded-md border border-white/10 bg-[#0B0F17] p-4">
          <svg
            viewBox="0 0 920 210"
            className="w-full min-w-[680px] h-auto"
            role="img"
            aria-label="TruthLens layered architecture diagram"
          >
            {/* Box 1: Reader & Moderator UI */}
            <rect x="16" y="40" width="190" height="125" rx="8" fill="#131B26" stroke="#334155" strokeWidth="1.5" />
            <text x="32" y="68" fill="#FBBF24" fontSize="11" fontFamily="JetBrains Mono, monospace">01 · PRESENTATION</text>
            <text x="32" y="92" fill="#F8FAFC" fontSize="14" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">React + Tailwind UI</text>
            <text x="32" y="116" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Aggregated News Feed</text>
            <text x="32" y="134" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Explainable Flag Drawer</text>
            <text x="32" y="152" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Report & Appeal Forms</text>

            {/* Arrow 1 -> 2 */}
            <path d="M206 102 L248 102" stroke="#64748B" strokeWidth="1.75" />
            <polygon points="248,97 258,102 248,107" fill="#FBBF24" />

            {/* Box 2: REST API */}
            <rect x="258" y="40" width="195" height="125" rx="8" fill="#131B26" stroke="#334155" strokeWidth="1.5" />
            <text x="274" y="68" fill="#FBBF24" fontSize="11" fontFamily="JetBrains Mono, monospace">02 · API GATEWAY</text>
            <text x="274" y="92" fill="#F8FAFC" fontSize="14" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">Express REST Server</text>
            <text x="274" y="116" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace">GET  /api/articles</text>
            <text x="274" y="134" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace">POST /api/analyze</text>
            <text x="274" y="152" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace">POST /api/reports & appeals</text>

            {/* Arrow 2 -> 3 */}
            <path d="M453 102 L495 102" stroke="#64748B" strokeWidth="1.75" />
            <polygon points="495,97 505,102 495,107" fill="#FBBF24" />

            {/* Box 3: Credibility Engine */}
            <rect x="505" y="40" width="205" height="125" rx="8" fill="#131B26" stroke="#F59E0B" strokeOpacity="0.45" strokeWidth="1.5" />
            <text x="521" y="68" fill="#FBBF24" fontSize="11" fontFamily="JetBrains Mono, monospace">03 · CREDIBILITY ENGINE</text>
            <text x="521" y="92" fill="#F8FAFC" fontSize="14" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">6-Step Scorer</text>
            <text x="521" y="116" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Text Feature Extraction</text>
            <text x="521" y="134" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Source Reputation Match</text>
            <text x="521" y="152" fill="#38BDF8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• TC-04 Uncertainty Guard</text>

            {/* Arrow 3 -> 4 */}
            <path d="M710 102 L746 102" stroke="#64748B" strokeWidth="1.75" />
            <polygon points="746,97 756,102 746,107" fill="#FBBF24" />

            {/* Box 4: Registry & Governance */}
            <rect x="756" y="40" width="148" height="125" rx="8" fill="#131B26" stroke="#334155" strokeWidth="1.5" />
            <text x="770" y="68" fill="#FBBF24" fontSize="11" fontFamily="JetBrains Mono, monospace">04 · STORE</text>
            <text x="770" y="92" fill="#F8FAFC" fontSize="14" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">Registry & Audit</text>
            <text x="770" y="116" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Source Tiers</text>
            <text x="770" y="134" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Evidence Links</text>
            <text x="770" y="152" fill="#94A3B8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">• Mod Overrides</text>
          </svg>
        </div>
      </section>

      {/* Two-Column Interactive Chapter Reader */}
      <section className="grid gap-8 lg:grid-cols-12">
        {/* Chapter Index Rail */}
        <aside className="lg:col-span-4 space-y-1.5" aria-label="Report chapters">
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400 px-2 pb-2">
            Chapters 01 – 09
          </p>
          {P58_REPORT_CHAPTERS.map((chapter) => {
            const active = chapter.number === selectedChapter;
            return (
              <button
                key={chapter.number}
                type="button"
                onClick={() => setSelectedChapter(chapter.number)}
                className={`w-full rounded-md border px-3.5 py-2.5 text-left transition ${
                  active
                    ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                    : 'border-white/5 bg-[#111827] text-slate-300 hover:border-white/15 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs text-amber-300 mr-2 tabular-nums">
                  {chapter.number}
                </span>
                <span className="text-xs sm:text-sm font-medium">{chapter.title}</span>
              </button>
            );
          })}
        </aside>

        {/* Chapter Prose Body */}
        <article className="lg:col-span-8 rounded-lg border border-white/10 bg-[#111827] p-6 sm:p-8 space-y-6">
          <header className="border-b border-white/10 pb-4 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Chapter {activeChapter.number}
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white">
              {activeChapter.title}
            </h2>
            <p className="text-sm text-slate-400">{activeChapter.subtitle}</p>
          </header>

          <div className="space-y-6 max-w-prose">
            {activeChapter.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h3 className="text-base font-semibold text-slate-100">{section.heading}</h3>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pt-1">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-slate-300 leading-relaxed pl-3 border-l border-white/15">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {section.table && (
                  <div className="overflow-x-auto rounded-md border border-white/10 bg-[#0B0F17] mt-3">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-white/10 font-mono uppercase text-slate-400">
                        <tr>
                          {section.table.headers.map((h) => (
                            <th key={h} className="px-3.5 py-2.5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-3.5 py-2.5 ${
                                  cIdx === 0 ? 'font-mono text-amber-200 whitespace-nowrap' : 'text-slate-300'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>
      </section>

      {/* Full Test Matrix Verification Table */}
      <section className="space-y-4">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-white">
            Core Verification Matrix (TC-01 to TC-06)
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Every test case specified in P58 Chapter 6 is interactive inside this web application and verified by automated unit tests in <span className="font-mono text-amber-200">tests/credibility.test.ts</span>.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#111827]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#0D131E] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Test ID</th>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Expected Result</th>
                <th className="px-4 py-3">Where to Test Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {TEST_CASES.map((tc) => (
                <tr key={tc.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono font-semibold text-amber-300 whitespace-nowrap">
                    {tc.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{tc.scenario}</td>
                  <td className="px-4 py-3 text-slate-300">{tc.expectedResult}</td>
                  <td className="px-4 py-3 font-mono text-emerald-300">{tc.verifiedInApp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
