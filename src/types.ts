export interface Attachment {
  type: "file" | "image" | "video" | "audio";
  name: string;
  size: number;
  content?: string; // base64 encoded dataURI for server-side processing
  mimeType?: string;
}

export interface Evidence {
  label: string;
  claim: string;
  stance: "support" | "contradict" | "neutral";
  strength?: string;
}

export interface VerificationAngles {
  logicalConsistency: string;
  factualGrounding: string;
  riskEdgeCases: string;
  alternativeView: string;
}

export interface DecisionVerification {
  score: number;
  scoreState: "scored" | "insufficient_evidence";
  evidence: Evidence[];
  angles: VerificationAngles;
  confidence?: string;
  confidencePercentage?: number;
  riskLevel?: string;
  showDashboard?: boolean;
  recommendation?: {
    action: string;
    alternatives: string[];
    pros: string[];
    cons: string[];
    tradeoffs: string[];
  };
}

export interface IntentClassification {
  category: string;
  confidence: number;
  explanation: string;
  tailoredStyle: string;
  humanized: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  decision?: DecisionVerification;
  mode?: "standard" | "audit" | "deep_search";
  routingTrigger?: "auto" | "manual";
  intentClassification?: IntentClassification;
  refinement?: {
    initialDraft: string;
    criticFeedback: string;
    improvementReasoning: string;
  };
  optimizedPrompt?: {
    original: string;
    optimized: string;
    reason: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  temporary: boolean;
  createdAt: string;
  messages: Message[];
}
