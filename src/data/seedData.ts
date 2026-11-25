import type {
  Article,
  FlagAppeal,
  ProjectChapter,
  SourceReputation,
  TestCaseSpec,
  UserReport,
} from '../types/truthlens.ts';
import { evaluateCredibility } from '../utils/credibilityEngine.ts';

export const SEED_SOURCES: SourceReputation[] = [
  {
    domain: 'reuters.com',
    name: 'Reuters Science & Policy Wire',
    tier: 'established',
    reputationScore: 92,
    factCheckHistory: 'Consistent adherence to corrections policy and multi-source corroboration.',
    ownershipTransparency: 'Thomson Reuters Corporation (publicly disclosed governance)',
    lastAudited: '2026-11-10',
  },
  {
    domain: 'nature.com',
    name: 'Nature Briefing',
    tier: 'established',
    reputationScore: 95,
    factCheckHistory: 'Peer-reviewed scientific reporting with mandatory DOI and methodology links.',
    ownershipTransparency: 'Springer Nature Editorial Board',
    lastAudited: '2026-11-12',
  },
  {
    domain: 'thehindu.com',
    name: 'The Hindu National Desk',
    tier: 'established',
    reputationScore: 86,
    factCheckHistory: 'Dedicated readers’ editor and public correction logs.',
    ownershipTransparency: 'The Hindu Group Publishing Pvt. Ltd.',
    lastAudited: '2026-11-08',
  },
  {
    domain: 'metrodispatch.regional',
    name: 'Metro Civic Dispatch',
    tier: 'regional',
    reputationScore: 66,
    factCheckHistory: 'Generally accurate local coverage; occasional reliance on early municipal briefings.',
    ownershipTransparency: 'Independent Regional News Co-op',
    lastAudited: '2026-11-14',
  },
  {
    domain: 'viralhealthalert.net',
    name: 'Viral Health Alert',
    tier: 'low_reputation',
    reputationScore: 18,
    factCheckHistory: 'Repeatedly flagged by medical fact-checkers for unverified miracle remedy claims.',
    ownershipTransparency: 'Undisclosed anonymous domain registration',
    lastAudited: '2026-11-18',
  },
  {
    domain: 'dailyrumorwire.xyz',
    name: 'Daily Rumor Wire',
    tier: 'low_reputation',
    reputationScore: 22,
    factCheckHistory: 'Publishes unattributed viral screenshots and fabricated policy circulars.',
    ownershipTransparency: 'Unverified ad-supported network',
    lastAudited: '2026-11-19',
  },
  {
    domain: 'earlypulse.blog',
    name: 'Early Pulse Notes',
    tier: 'unverified',
    reputationScore: 46,
    factCheckHistory: 'New aggregator blog without formal editorial review board.',
    ownershipTransparency: 'Single-author independent blog',
    lastAudited: '2026-11-20',
  },
];

interface RawArticleSeed {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Article['category'];
  sourceName: string;
  sourceDomain: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  url: string;
  reportCount: number;
  appealCount: number;
}

const RAW_ARTICLES: RawArticleSeed[] = [
  {
    id: 'art-01',
    title: 'Phase-III Urban Air Quality Study Links Particulate Reduction to 14% Drop in Pediatric ER Visits',
    summary:
      'A peer-reviewed multi-city cohort published in Lancet Planetary Health tracked 180,000 hospital admissions across four metropolitan corridors over 36 months.',
    content:
      'Researchers published in Lancet Planetary Health reported a 14.2% decline in acute pediatric asthma emergency admissions following low-emission freight zoning. According to the report and municipal health data released Friday, the sample size covered 180,000 pediatric records with standardized methodology adjustments for seasonal viral spikes. A city health spokesperson confirmed that monitoring stations will expand to 24 additional wards next quarter.',
    category: 'Science & Health',
    sourceName: 'Nature Briefing',
    sourceDomain: 'nature.com',
    author: 'Dr. Kavya Menon',
    publishedAt: '2026-11-21T08:30:00Z',
    readTimeMinutes: 4,
    url: 'https://nature.com/articles/urban-air-quality-pediatric-study',
    reportCount: 0,
    appealCount: 0,
  },
  {
    id: 'art-02',
    title: 'SHOCKING Miracle Lemon & Baking Soda Protocol 100% Cures Chronic Diabetes Overnight — Mainstream Media Hides It!',
    summary:
      'An unverified post claims an instant kitchen remedy reverses metabolic disease in 48 hours while alleging global health agencies suppressed clinical trials.',
    content:
      'SHOCKING discovery! Doctors are baffled as this miracle lemon protocol 100% cures diabetes overnight and eliminates insulin dependency! The secret they do not want you to know is being banned tomorrow while mainstream media refuses to report the truth. Forwarded social media messages claim anonymous insiders leaked a document proving pharmaceutical suppression!!',
    category: 'Science & Health',
    sourceName: 'Viral Health Alert',
    sourceDomain: 'viralhealthalert.net',
    author: 'Staff Contributor',
    publishedAt: '2026-11-21T11:15:00Z',
    readTimeMinutes: 2,
    url: 'https://viralhealthalert.net/miracle-lemon-protocol-exposed',
    reportCount: 14,
    appealCount: 1,
  },
  {
    id: 'art-03',
    title: 'Reserve Bank Quarterly Bulletin Details 6.8% Digital Settlement Growth and Cross-Border UPI Pilot',
    summary:
      'Audited settlement figures released by the central bank highlight higher merchant adoption in tier-2 corridors alongside updated cybersecurity disclosures.',
    content:
      'According to the Reserve Bank quarterly bulletin published Thursday, real-time retail settlement volumes grew 6.8% quarter-over-quarter across 420 million active accounts. Data released by the payments supervision department notes that mandatory two-factor hardware tokens reduced unauthorized merchant chargebacks by 22%. A central bank spokesperson confirmed that bilateral corridor pilots remain subject to periodic security audits.',
    category: 'Economy',
    sourceName: 'Reuters Science & Policy Wire',
    sourceDomain: 'reuters.com',
    author: 'Rohan Deshmukh',
    publishedAt: '2026-11-20T14:20:00Z',
    readTimeMinutes: 5,
    url: 'https://reuters.com/finance/rbi-digital-settlement-bulletin',
    reportCount: 0,
    appealCount: 0,
  },
  {
    id: 'art-04',
    title: 'EXPOSED: Secret Circular Allegedly Orders 40% Freeze on All Bank Withdrawals Starting Monday',
    summary:
      'Circulated viral screenshots claim commercial banks will cap cash withdrawals next week based on an unauthenticated memo without official confirmation.',
    content:
      'EXPOSED: A leaked memo circulating on viral video channels claims commercial banks will freeze 40% of retail withdrawals next week! According to forwarded social media screenshots, anonymous insiders say emergency currency rules are already signed with no official confirmation from the treasury or RBI. Wake up before ATMs shut down!',
    category: 'Economy',
    sourceName: 'Daily Rumor Wire',
    sourceDomain: 'dailyrumorwire.xyz',
    author: 'Desk Wire',
    publishedAt: '2026-11-21T16:40:00Z',
    readTimeMinutes: 2,
    url: 'https://dailyrumorwire.xyz/secret-bank-withdrawal-freeze',
    reportCount: 9,
    appealCount: 0,
  },
  {
    id: 'art-05',
    title: 'Early Pulse Note: Regional Power Grid Outage Reportedly Linked to Unverified Firmware Patch',
    summary:
      'A brief breaking note alleges substation trips in two districts may stem from a software update, though utility engineers have not yet published root-cause telemetry.',
    content:
      'Early reports suggest two regional substations allegedly experienced brief voltage drops around 04:00 UTC, reportedly linked to an unconfirmed firmware patch. Utility officials have not issued preliminary telemetry yet.',
    category: 'Technology',
    sourceName: 'Early Pulse Notes',
    sourceDomain: 'earlypulse.blog',
    author: 'A. Nair',
    publishedAt: '2026-11-22T05:10:00Z',
    readTimeMinutes: 1,
    url: 'https://earlypulse.blog/regional-grid-firmware-rumor',
    reportCount: 2,
    appealCount: 1,
  },
  {
    id: 'art-06',
    title: 'Municipal Transit Draft Proposes Peak-Hour Congestion Pricing Trial on Three Ring Roads',
    summary:
      'Regional reporters cite an internal draft policy proposal under council review; final tariff brackets and exemptions reportedly remain undecided.',
    content:
      'Draft transport committee minutes reviewed by Metro Civic Dispatch indicate city planners may have proposed a six-month congestion pricing trial along three arterial corridors. Committee members allegedly debated commuter bus exemptions, though final tariff brackets reportedly remain preliminary ahead of next month’s public hearing.',
    category: 'Policy',
    sourceName: 'Metro Civic Dispatch',
    sourceDomain: 'metrodispatch.regional',
    author: 'Sneha Kulkarni',
    publishedAt: '2026-11-20T09:45:00Z',
    readTimeMinutes: 3,
    url: 'https://metrodispatch.regional/transit-congestion-trial-draft',
    reportCount: 1,
    appealCount: 1,
  },
  {
    id: 'art-07',
    title: 'Grid-Scale Sodium-Ion Battery Pilot Completes 1,500 Thermal Cycles in High-Ambient Testbed',
    summary:
      'Engineers published six-month durability metrics from a 40 MWh utility storage array operating in arid peak-summer conditions.',
    content:
      'According to data released by the National Energy Storage Consortium and published in Joule Applied Reports, a 40 MWh sodium-ion facility retained 93.4% nameplate capacity after 1,500 full charge-discharge cycles at 43°C ambient peaks. Methodology disclosures detail cell chemistry ratios and cooling overhead, and an independent engineering spokesperson confirmed third-party metering validation.',
    category: 'Climate',
    sourceName: 'The Hindu National Desk',
    sourceDomain: 'thehindu.com',
    author: 'Meera Iyer',
    publishedAt: '2026-11-19T13:05:00Z',
    readTimeMinutes: 4,
    url: 'https://thehindu.com/sci-tech/energy/sodium-ion-grid-pilot',
    reportCount: 0,
    appealCount: 0,
  },
];

export const SEED_ARTICLES: Article[] = RAW_ARTICLES.map((item) => ({
  ...item,
  analysis: evaluateCredibility(item.title, item.content, item.sourceDomain, SEED_SOURCES),
}));

export const SEED_REPORTS: UserReport[] = [
  {
    id: 'rep-101',
    articleId: 'art-02',
    articleTitle:
      'SHOCKING Miracle Lemon & Baking Soda Protocol 100% Cures Chronic Diabetes Overnight — Mainstream Media Hides It!',
    reporterName: 'Arjun Rao',
    reasonCategory: 'fabricated_claim',
    details:
      'Makes dangerous unsubstantiated medical claims ("100% cures diabetes overnight") without clinical trial citations.',
    supportingUrl: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
    status: 'pending',
    createdAt: '2026-11-21T12:15:00Z',
  },
  {
    id: 'rep-102',
    articleId: 'art-04',
    articleTitle:
      'EXPOSED: Secret Circular Allegedly Orders 40% Freeze on All Bank Withdrawals Starting Monday',
    reporterName: 'Priya Sharma',
    reasonCategory: 'unverified_source',
    details:
      'Relies solely on a doctored social media screenshot; RBI official press room has zero withdrawal freeze notices.',
    supportingUrl: 'https://www.rbi.org.in',
    status: 'pending',
    createdAt: '2026-11-21T17:10:00Z',
  },
  {
    id: 'rep-103',
    articleId: 'art-06',
    articleTitle:
      'Municipal Transit Draft Proposes Peak-Hour Congestion Pricing Trial on Three Ring Roads',
    reporterName: 'Vikram Hegde',
    reasonCategory: 'out_of_context',
    details:
      'Headline presents a preliminary subcommittee draft as an active proposal prior to council vote.',
    status: 'needs_review',
    moderatorNote: 'Awaiting public hearing minutes from city council clerk.',
    createdAt: '2026-11-20T15:30:00Z',
    reviewedAt: '2026-11-21T09:00:00Z',
  },
];

export const SEED_APPEALS: FlagAppeal[] = [
  {
    id: 'app-201',
    articleId: 'art-05',
    articleTitle:
      'Early Pulse Note: Regional Power Grid Outage Reportedly Linked to Unverified Firmware Patch',
    appellantName: 'A. Nair (Author)',
    currentStatus: 'insufficient_evidence',
    rationale:
      'Substation maintenance log #44-B was partially released after publication; requesting re-evaluation once utility report is attached.',
    evidenceUrl: 'https://earlypulse.blog/errata-substation-log',
    status: 'open',
    createdAt: '2026-11-22T06:20:00Z',
  },
  {
    id: 'app-202',
    articleId: 'art-06',
    articleTitle:
      'Municipal Transit Draft Proposes Peak-Hour Congestion Pricing Trial on Three Ring Roads',
    appellantName: 'Metro Civic Dispatch Editorial',
    currentStatus: 'caution',
    rationale:
      'Our article explicitly notes the draft status and quotes municipal committee members; requesting clarification on caution label wording.',
    evidenceUrl: 'https://metrodispatch.regional/editorial-note',
    status: 'open',
    createdAt: '2026-11-21T10:05:00Z',
  },
];

export const TEST_CASES: TestCaseSpec[] = [
  {
    id: 'TC-01',
    scenario: 'Feed displays recent articles with source and timestamp',
    expectedResult: 'Recent articles load cleanly with title, source attribution, timestamp, and credibility indicator.',
    verifiedInApp: 'News Feed View & GET /api/articles',
  },
  {
    id: 'TC-02',
    scenario: 'User submits a report on a suspicious article',
    expectedResult: 'Report is stored via POST /api/reports and immediate confirmation is shown to the user.',
    verifiedInApp: 'Article Inspector -> Submit Report',
  },
  {
    id: 'TC-03',
    scenario: 'Flagged article shows reason and evidence links',
    expectedResult: 'Flagged article displays human-readable explanation, NLP/reputation breakdown, and evidence links — never a bare label.',
    verifiedInApp: 'Article Inspector & Live Analyzer',
  },
  {
    id: 'TC-04',
    scenario: 'Model lacks sufficient evidence',
    expectedResult: 'System surfaces "Insufficient Evidence" uncertainty state instead of forcing a false binary claim.',
    verifiedInApp: 'art-05 & Live Analyzer Uncertainty Preset',
  },
  {
    id: 'TC-05',
    scenario: 'Moderator reviews and updates report status',
    expectedResult: 'Moderator records decision (confirm/dismiss/needs review) and updates queue + article status.',
    verifiedInApp: 'Moderator Console -> Reports Queue',
  },
  {
    id: 'TC-06',
    scenario: 'User submits a flag appeal',
    expectedResult: 'Appeal is logged via POST /api/appeals and enters the moderator appeals queue for human review.',
    verifiedInApp: 'Article Inspector -> Appeal Flag & Moderator Appeals Tab',
  },
];

export const PROJECT_TARGETS = [
  {
    metric: 'Flag Precision Target',
    target: '75%',
    scope: 'Handbook Target (Precision / Recall / F1 on flagged misinformation)',
    status: 'Target Benchmark',
  },
  {
    metric: 'Automated Test Coverage',
    target: '80%',
    scope: 'Handbook Target (Unit + Integration + E2E test suite)',
    status: 'Target Benchmark',
  },
  {
    metric: 'Critical / Blocker Defects',
    target: '0',
    scope: 'Production release gate prior to sign-off',
    status: 'Gate Criteria',
  },
  {
    metric: 'CI/CD Pipeline',
    target: '100% Green',
    scope: 'GitHub Actions & Jenkins automated lint, test, build',
    status: 'Configured in Repo',
  },
];

export const P58_REPORT_CHAPTERS: ProjectChapter[] = [
  {
    number: '01',
    title: 'Problem Definition & Objectives',
    subtitle: 'Media Domain · P58 – TruthLens: News Aggregator with Misinformation Flagging',
    sections: [
      {
        heading: '1.1 Real-World Context',
        paragraphs: [
          'News spreads rapidly across websites, messaging apps, and social platforms. Readers frequently encounter conflicting headlines, doctored circulars, and sensationalized health or financial claims without reliable context.',
          'TruthLens addresses this information asymmetry by pairing clean news aggregation with an explainable credibility flagging layer and structured community moderation.',
        ],
      },
      {
        heading: '1.2 Core Problem Statement',
        paragraphs: [
          'Readers struggle to distinguish verified journalism from rumours or misleading claims. Bare binary labels ("True" / "Fake") undermine trust and fail when evidence is incomplete. Systems must pair automated text signals and source reputation checks with clear human-readable explanations, evidence links, and appeal mechanisms.',
        ],
      },
      {
        heading: '1.3 Intended Users & 1.4 Scope / Realistic Targets',
        paragraphs: [
          'TruthLens serves two primary personas: Readers (who browse articles, inspect source details and credibility flags with evidence, submit reports, and appeal flags) and Moderators (who review submitted reports, examine evidence, and record decisions).',
          'To remain grounded, numerical metrics follow realistic Handbook Targets rather than unverified claims: 75% flag precision target, 80% test coverage target, 0 blocker issues at release, and a green CI/CD pipeline.',
        ],
      },
    ],
  },
  {
    number: '02',
    title: 'System Design & Architecture',
    subtitle: 'Modular layered architecture separating client presentation, API routing, and credibility scoring',
    sections: [
      {
        heading: '2.1 High-Level Architecture & 2.2 Component Breakdown',
        paragraphs: [
          'The system decouples the user interface from REST endpoints, credibility evaluation logic, and persistent storage so classification rules or data stores can evolve independently.',
        ],
        table: {
          headers: ['Layer', 'Planned / Implemented Stack', 'Primary Responsibility'],
          rows: [
            ['Frontend UI', 'React + TypeScript + Tailwind CSS', 'News feed, article inspector, credibility explanation UI, report/appeal forms, moderator console'],
            ['Backend API', 'Express / Django REST API (/api/*)', 'Article retrieval, live credibility evaluation, report/appeal ingestion, moderator state updates'],
            ['Database / Store', 'PostgreSQL / Structured Registry Store', 'Articles, curated source reputation registry, reader reports, flag appeals, audit history'],
            ['Credibility Engine', 'Text Classifier + Source Reputation Lookup', 'Feature extraction (sensationalism, citations, hedging), source scoring, uncertainty guard, evidence assembly'],
            ['Monitoring', '/api/health & /api/metrics', 'Health checks, flag distribution counts, pending queue counters'],
          ],
        },
      },
      {
        heading: '2.3 Data Schema & Endpoints',
        paragraphs: [
          'Core domain entities include Article, CredibilityAnalysis, SourceReputation, UserReport, and FlagAppeal. Key endpoints expose GET /api/articles, POST /api/analyze, POST /api/reports, PATCH /api/reports/:id, POST /api/appeals, PATCH /api/appeals/:id, GET /api/health, and GET /api/metrics.',
        ],
      },
    ],
  },
  {
    number: '03',
    title: 'Agile Engineering & Sprint Plan',
    subtitle: '28-Day Integrated Project Lifecycle across two focused sprints',
    sections: [
      {
        heading: '3.1 User Stories & Acceptance Criteria',
        paragraphs: [
          'Backlog prioritized user-facing transparency and moderation integrity before auxiliary enhancements.',
        ],
        table: {
          headers: ['Story ID', 'Persona & Goal', 'Acceptance Criteria'],
          rows: [
            ['US-01', 'Reader browses recent articles', 'Feed displays headline, source, timestamp, and credibility indicator'],
            ['US-02', 'Reader inspects credibility flag', 'Shows status, reason, feature breakdown, and supporting evidence links'],
            ['US-03', 'Reader reports misleading article', 'Submits reason & details and receives immediate confirmation'],
            ['US-04', 'System handles missing evidence', 'Displays "Insufficient Evidence" instead of guessing'],
            ['US-05', 'Moderator reviews reports & appeals', 'Updates report/appeal status and logs decision notes'],
          ],
        },
      },
      {
        heading: '3.2 Two-Sprint Delivery Cadence',
        paragraphs: [
          'Sprint 1 (Days 1–14) established requirements, UI wireframes, source reputation schema, news feed aggregation, and baseline text classification.',
          'Sprint 2 (Days 15–28) delivered explainable evidence linking, user report & appeal workflows, moderator review console, automated tests (TC-01 to TC-06), Docker packaging, and CI/CD pipelines.',
        ],
      },
    ],
  },
  {
    number: '04',
    title: 'Implementation & Credibility Workflow',
    subtitle: '6-step explainable misinformation flagging pipeline',
    sections: [
      {
        heading: '4.1 How Credibility Flagging Works',
        paragraphs: [
          'Rather than acting as an opaque black box, every evaluation proceeds through six auditable stages combining linguistic feature extraction with source reputation lookup:',
        ],
        bullets: [
          'Step 1 — Text Normalization: Clean and tokenize article headline and body content.',
          'Step 2 — Feature Extraction: Measure sensationalist/clickbait tropes, unattributed leak phrases, citation density, and hedging markers.',
          'Step 3 — Text Classifier Score: Compute baseline NLP credibility score from weighted lexical and structural cues.',
          'Step 4 — Source Reputation Lookup: Match domain against the curated SourceReputation registry (established, regional, unverified, low reputation).',
          'Step 5 — Uncertainty Calibration (TC-04): Trigger an "Insufficient Evidence" status whenever claims lack corroboration or context is too thin.',
          'Step 6 — Explanation & Evidence Assembly (TC-03): Attach human-readable rationale and fact-check reference links.',
        ],
      },
    ],
  },
  {
    number: '05',
    title: 'DevOps, Containerization & CI/CD',
    subtitle: 'Clean-machine reproducibility with Docker, GitHub Actions, and Jenkins',
    sections: [
      {
        heading: '5.1 Repository & Build Hygiene',
        paragraphs: [
          'The GitHub repository adheres to Handbook Appendix D structure: README.md, src/, tests/, .github/workflows/ci.yml, Jenkinsfile, Dockerfile, docker-compose.yml, .env.example, and .gitignore.',
          'Every push executes automated dependency installation, TypeScript type checking (tsc --noEmit), unit/integration tests covering TC-01 through TC-06, and production Vite bundle verification.',
        ],
      },
    ],
  },
  {
    number: '06',
    title: 'Testing & Verification (TC-01 to TC-06)',
    subtitle: 'Structured test matrix verifying functional paths and edge-case uncertainty safeguards',
    sections: [
      {
        heading: '6.1 Functional & Edge-Case Verification',
        paragraphs: [
          'Tests validate normal reader aggregation flows alongside negative/edge cases such as insufficient evidence handling and moderator decision overrides.',
        ],
        table: {
          headers: ['Test ID', 'Scenario', 'Expected Outcome'],
          rows: [
            ['TC-01', 'Feed loads articles', 'Titles, sources, timestamps, and flags render properly'],
            ['TC-02', 'Reader submits report', 'Report persists and shows confirmation'],
            ['TC-03', 'Flagged article inspection', 'Shows explanation and evidence links (never bare label)'],
            ['TC-04', 'Insufficient evidence case', 'Surfaces uncertainty notice rather than forcing a verdict'],
            ['TC-05', 'Moderator reviews report', 'Updates status and logs moderator notes'],
            ['TC-06', 'User appeals flag', 'Appeal enters moderator queue for resolution'],
          ],
        },
      },
    ],
  },
  {
    number: '07',
    title: 'Software Quality Assurance (SQA)',
    subtitle: 'Five core quality attributes governing release readiness',
    sections: [
      {
        heading: '7.1 Quality Attributes & Measurable Criteria',
        paragraphs: [
          'Quality assurance evaluates the platform across five dimensions:',
        ],
        bullets: [
          'Reliability: Deterministic scoring fallback and explicit uncertainty states prevent silent misclassifications.',
          'Usability: Clear scannable hierarchy, non-color-dependent semantic icons/labels, and zero-clutter evidence inspection.',
          'Maintainability: Modular separation between UI components, shared types, credibility engine, and Express API routes.',
          'Security & Privacy: Input validation on report/appeal payloads, no client-side secrets, and safe HTML escaping.',
          'Testability: Pure TypeScript evaluation functions enabling fast unit verification against TC-01..TC-06.',
        ],
      },
    ],
  },
  {
    number: '08',
    title: 'Responsible AI & Ethics Checklist',
    subtitle: 'Human-in-the-loop accountability and anti-censorship guardrails',
    sections: [
      {
        heading: '8.1 Seven-Point Ethical Commitments',
        paragraphs: [
          'Automated misinformation tooling carries high stakes for public discourse. TruthLens enforces seven Responsible AI safeguards:',
        ],
        bullets: [
          '1. Advisory Signals, Never Final Truth: Every flag includes a disclaimer that signals assist readers and moderators rather than dictating censorship.',
          '2. Explainability by Default: Every status displays exact contributing linguistic features and source reputation context.',
          '3. Uncertainty Transparency (TC-04): Insufficient-evidence claims are explicitly labeled uncertain rather than guessing.',
          '4. Supporting Evidence Links (TC-03): Readers can inspect primary fact-checks and institutional references directly.',
          '5. Right of Appeal (TC-06): Publishers and readers can contest any flag with counter-evidence.',
          '6. Human Moderator Authority (TC-05): Moderators retain final override authority over automated classifier outputs.',
          '7. Bias & Source Auditing: Source reputation scores include transparent ownership and last-audited timestamps.',
        ],
      },
    ],
  },
  {
    number: '09',
    title: 'Conclusion, Limitations & Future Scope',
    subtitle: 'Author: Manya B U · USN: ENG24CS0126 · Section: 5B · 22 November 2026',
    sections: [
      {
        heading: '9.1 Summary & Known Limitations',
        paragraphs: [
          'TruthLens demonstrates how explainable text classification, transparent source reputation registries, and structured reader-moderator workflows work together to improve news literacy.',
          'Current limitations include reliance on curated source registries and English-language lexical patterns. Future phases can integrate multilingual claim embeddings, live RSS ingestion pipelines, and federated fact-checker APIs (ClaimReview schema).',
        ],
      },
    ],
  },
];
