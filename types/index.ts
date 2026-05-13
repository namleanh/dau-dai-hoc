export interface AdmissionScore {
  majorName: string;
  majorCode?: string;
  score2025?: number;
  score2024?: number;
  score2023?: number;
}

export interface CareerOption {
  title: string;
  description: string;
}

export interface SimilarItem {
  name: string;
  type: 'university' | 'major';
  /** Optional hint about score or ranking */
  hint?: string;
}

export interface SourceInfo {
  title: string;
  url: string;
}

export interface SearchResult {
  /** University or major name */
  name: string;
  /** Full official name */
  fullName?: string;
  /** Brief description */
  description?: string;
  /** Array of interesting facts or advice to rotate in UI */
  funFacts?: string[];
  /** Type of result */
  type: 'university' | 'major';
  /** Admission scores by major */
  admissionScores: AdmissionScore[];
  /** Career opportunities */
  careers: CareerOption[];
  /** Similar majors */
  similarMajors: SimilarItem[];
  /** Similar universities */
  similarUniversities: SimilarItem[];
  /** Data sources */
  sources: SourceInfo[];
}

export interface SearchResponse {
  success: boolean;
  data?: SearchResult;
  error?: string;
  /** Raw error code for debugging (shown in expandable section) */
  errorCode?: string;
}
