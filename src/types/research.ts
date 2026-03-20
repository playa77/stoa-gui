export interface Source {
  id: string;
  sessionId: string | null;
  type: string;
  uri: string | null;
  title: string | null;
  contentHash: string | null;
  createdAt: string;
}

export interface RetrievalResult {
  sourceId: string;
  content: string;
  score: number;
  location: string | null;
}

export interface SynthesizedClaim {
  text: string;
  citationIds: string[];
  confidence: number | null;
}

export interface SynthesisResult {
  query: string;
  claims: SynthesizedClaim[];
  uncertaintyMarkers: string[];
  sourceMap: Record<string, string>;
  rawOutput: string;
  traceId: string;
}

export interface SourceInput {
  type: string;
  uri?: string;
  content?: string;
  title?: string;
}
