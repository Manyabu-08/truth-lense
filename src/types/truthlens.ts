export type CredibilityStatus =
  | 'reliable'
  | 'caution'
  | 'flagged'
  | 'insufficient_evidence';

export type SourceTier = 'established' | 'regional' | 'unverified' | 'low_reputation';

export interface SourceReputation {
  domain: string;
  name: string;
  tier: SourceTier;
  reputationScore: number; // 0 to 100
  factCheckHistory: string;
  ownershipTransparency: string;
  lastAudited: string;
}

export interface EvidenceLink {
  title: string;
  publisher: string;
  url: string;
  stance: 'supports' | 'refutes' | 'contextualizes';
  summary: string;
}

export interface ClassifierFeatures {
  sensationalismScore: number; // 0 to 100
  hedgingAndUncertainty: number; // 0 to 100
  citationDensity: number; // 0 to 100
  unverifiedClaimCues: string[];
  clickbaitSignals: string[];
  reputableMarkers: string[];
}

export interface CredibilityAnalysis {
  status: CredibilityStatus;
  confidenceScore: number; // 0 to 100
  headlineReason: string;
  detailedExplanation: string;
  uncertaintyNotice?: string;
  textClassifierScore: number; // 0 to 100 (higher = more credible)
  sourceReputationScore: number; // 0 to 100
  combinedScore: number; // 0 to 100
  features: ClassifierFeatures;
  evidenceLinks: EvidenceLink[];
  evaluatedAt: string;
  pipelineSteps: {
    step: number;
    label: string;
    outcome: string;
  }[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Science & Health' | 'Economy' | 'Policy' | 'Technology' | 'Climate';
  sourceName: string;
  sourceDomain: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  url: string;
  analysis: CredibilityAnalysis;
  reportCount: number;
  appealCount: number;
}

export type ReportStatus = 'pending' | 'confirmed' | 'dismissed' | 'needs_review';

export interface UserReport {
  id: string;
  articleId: string;
  articleTitle: string;
  reporterName: string;
  reasonCategory:
    | 'fabricated_claim'
    | 'misleading_headline'
    | 'out_of_context'
    | 'unverified_source'
    | 'manipulated_data';
  details: string;
  supportingUrl?: string;
  status: ReportStatus;
  moderatorNote?: string;
  createdAt: string;
  reviewedAt?: string;
}

export type AppealStatus = 'open' | 'upheld_flag' | 'overturned_flag' | 'needs_more_evidence';

export interface FlagAppeal {
  id: string;
  articleId: string;
  articleTitle: string;
  appellantName: string;
  currentStatus: CredibilityStatus;
  rationale: string;
  evidenceUrl?: string;
  status: AppealStatus;
  moderatorDecisionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AnalyzeRequestPayload {
  title: string;
  content: string;
  sourceDomain?: string;
  sourceName?: string;
}

export interface TestCaseSpec {
  id: string;
  scenario: string;
  expectedResult: string;
  verifiedInApp: string;
}

export interface ProjectChapter {
  number: string;
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}
