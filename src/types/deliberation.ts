export interface CritiqueResponse {
  frameId: string;
  critique: string;
  severity: "low" | "medium" | "high";
}

export interface FrameOutput {
  frameId: string;
  label: string;
  position: string;
  critiques: CritiqueResponse[];
}

export interface AgreementPoint {
  text: string;
  consensusScore: number;
}

export interface DisagreementPoint {
  text: string;
  frameIds: string[];
  reason: string;
}

export interface DisagreementSurface {
  agreements: AgreementPoint[];
  disagreements: DisagreementPoint[];
  openQuestions: string[];
  confidenceMap: Record<string, number>;
}

export interface RhetoricalDevice {
  deviceType: string;
  frameId: string;
  excerpt: string;
  explanation: string;
  severity: string;
}

export interface IdentifiedBias {
  biasType: string;
  frameId: string;
  evidence: string;
  impactScore: number;
}

export interface Inconsistency {
  frameId: string;
  claimA: string;
  claimB: string;
  explanation: string;
}

export interface Contradiction {
  frameIdA: string;
  frameIdB: string;
  pointOfContradiction: string;
}

export interface RhetoricAnalysis {
  devices: RhetoricalDevice[];
  biases: IdentifiedBias[];
  inconsistencies: Inconsistency[];
  crossFrameContradictions: Contradiction[];
}

export interface DeliberationResult {
  question: string;
  frames: FrameOutput[];
  rhetoricAnalysis: RhetoricAnalysis | null;
  disagreementSurface: DisagreementSurface;
  synthesis: string | null;
  traceId: string;
}
