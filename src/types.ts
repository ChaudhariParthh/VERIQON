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
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  decision?: DecisionVerification;
  mode?: "standard" | "audit" | "deep_search";
  routingTrigger?: "auto" | "manual";
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
