import { Chat } from "./types";

export interface DecisionTemplate {
  id: string;
  title: string;
  category: "finance" | "technology" | "blockchain" | "operations" | "legal";
  tagline: string;
  emoji: string;
  description: string;
  userPrompt: string;
  assistantContent: string;
  score: number;
  evidence: {
    label: string;
    claim: string;
    stance: "support" | "contradict" | "neutral";
  }[];
  angles: {
    logicalConsistency: string;
    factualGrounding: string;
    riskEdgeCases: string;
    alternativeView: string;
  };
}

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: "lease-vs-buy",
    title: "Capital Lease vs. Buy Audit",
    category: "finance",
    tagline: "Heavy machinery and server cluster capitalization",
    emoji: "📊",
    description: "Audit capital expenditure allocations for a $2.5M manufacturing or high-density server asset. Analyzes tax shields, residual risk, WACC impact, and cash reserves.",
    userPrompt: "Should we purchase a $2.5M high-precision wafer-cutting tool outright with 45% debt financing or lease it over 4 years under an operating lease with zero residual value guarantee? WACC is 9.5%.",
    assistantContent: `### Lease vs. Buy Capital Expenditure Audit

Under current capital constraints and a WACC of 9.5%, leasing the wafer-cutting asset over 4 years represents a higher Net Present Value (NPV) benefit compared to direct purchase. Although ownership offers long-term depreciation tax shields, the rapid obsolescence cycle of silicon manufacturing machinery overrides capital ownership value.

#### Financial NPV Comparison
* **Option A (Outright Purchase with 45% Debt)**: Present Value of cash outflows is **$2,150,000** (including interest payments and maintenance).
* **Option B (4-Year Operating Lease)**: Present Value of lease payments is **$1,920,000** (fully deductible as an operating expense, with zero disposal costs).
* **Net Advantage**: **+$230,000 NPV** in favor of leasing.`,
    score: 78,
    evidence: [
      {
        label: "IRS Section 179 Code",
        claim: "First-year depreciation write-offs are capped at $1.16M, limiting immediate tax shields on a $2.5M asset purchase.",
        stance: "support"
      },
      {
        label: "Semicond Tech Depreciation Index",
        claim: "Precision optical wafers lose up to 60% of their market value within 36 months due to next-gen node upgrades.",
        stance: "support"
      },
      {
        label: "Debt Covenants Log",
        claim: "Taking an additional $1.125M in bank debt breaches our current liquidity ratio covenant of 1.5x.",
        stance: "contradict"
      }
    ],
    angles: {
      logicalConsistency: "The recommendation to lease is highly consistent with the goal of preserving short-term liquidity and complying with debt covenants. Ownership advocates fail to account for technical obsolescence write-downs.",
      factualGrounding: "Tax calculations are grounded in IRS Section 179 depreciation ceilings. Semicond node lifecycles are backed by five-year industry trends.",
      riskEdgeCases: "If production demand doubles in Year 3, leasing constraints might prevent 24/7 continuous operations without incurring heavy over-usage penalties.",
      alternativeView: "Negotiate a modified lease-to-buy clause allowing purchase at fair market value at month 36, providing an exit ramp if hardware lifecycles persist longer than expected."
    }
  },
  {
    id: "llm-vs-rag",
    title: "LLM Fine-Tuning vs. Vector RAG",
    category: "technology",
    tagline: "Infrastructure cost and accuracy optimization",
    emoji: "🤖",
    description: "Evaluates building custom fine-tuned Large Language Models versus scaling Vector Database RAG architectures for private financial and legal document analysis.",
    userPrompt: "We need to automate client portfolio auditing. Should we build and fine-tune a custom 70B parameter model on our private financial advisory data or deploy a scaled Vector RAG pipeline using Google Vertex AI and Gemini 1.5 Pro?",
    assistantContent: `### AI System Architecture Audit

Deploying a scaled Retrieval-Augmented Generation (RAG) pipeline utilizing high-context models like Gemini 1.5 Pro is highly superior to fine-tuning a custom 70B parameter model. Fine-tuning introduces massive upfront training latency and fails to handle real-time market data updates, whereas RAG maintains strict citation-based compliance.

#### Comparison Scorecard
1. **RAG Pipeline**: Upfront setup cost is low ($15K), operational database costs scale with query load, and update latency is sub-second (instant database upserts).
2. **Model Fine-Tuning**: Pre-training and engineering costs exceed $200K, requiring cold retraining cycles for any changes to compliance rules or daily market tables.`,
    score: 89,
    evidence: [
      {
        label: "Vertex AI Token Pricing Guide",
        claim: "Context windows of up to 2M tokens enable entire folders of client portfolios to be passed directly without chunking loss.",
        stance: "support"
      },
      {
        label: "LLM Hallucination Benchmark",
        claim: "Fine-tuned models without continuous grounding exhibit an 11% hallucination rate on private numerical lookups.",
        stance: "contradict"
      },
      {
        label: "Fintech Security Standards",
        claim: "Vector database record-level access keys satisfy corporate SOC2 data segregation requirements.",
        stance: "support"
      }
    ],
    angles: {
      logicalConsistency: "Advocating for fine-tuning to 'embed private knowledge' is logically flawed because fine-tuning changes style/tone, not factual retrieval. RAG provides exact reference citations required for auditing compliance.",
      factualGrounding: "Supported by standard Vertex AI token pricing metrics and verified numerical hallucination rates in financial modeling.",
      riskEdgeCases: "API dependency on cloud models exposes client portfolio audits to external network latency or transient service outages.",
      alternativeView: "Deploy a lightweight 8B model locally strictly for initial PII redacting and document structural parsing, then feed clean text into the RAG cloud model."
    }
  },
  {
    id: "defi-compliance",
    title: "DeFi Yield Protocol Security Audit",
    category: "blockchain",
    tagline: "Smart contract risk and liquidity protection",
    emoji: "⚡",
    description: "Verify protocol solvency and multi-sig security pipelines. Identifies flash-loan vulnerabilities, compliance blocks, and liquidity de-pegging vectors.",
    userPrompt: "We are launching a cross-chain decentralized liquidity pool for dynamic yield optimization. Is our current multi-signature vault architecture and continuous audit pipeline robust enough to launch next week?",
    assistantContent: `### DeFi Launch Security & Solvency Audit

Launching the yield protocol next week presents an **unacceptably high risk profile (Critical Vulnerability)**. The proposed 3-of-5 multi-signature threshold is structurally weak, and the automated smart-contract linting tools used in your pipeline cannot detect complex cross-contract logical exploits or flash-loan arbitrage cascades.

#### Risk Severity Dashboard
* **Contract Exploit Likelihood**: **CRITICAL**. No third-party manual smart contract audit has been finalized.
* **Solvency Buffer**: **POOR**. Dynamic yield rebalancing triggers cross-chain slippage that exceeds expected returns in volatile environments.`,
    score: 34,
    evidence: [
      {
        label: "Multi-Sig Key Management Best Practices",
        claim: "A 3-of-5 threshold where three keys reside in the same corporate subnet constitutes a single point of failure.",
        stance: "contradict"
      },
      {
        label: "Cross-Chain Bridge Vulnerability Index",
        claim: "Bridge contracts account for over 68% of all decentralized finance exploits totaling $1.8B in annual losses.",
        stance: "contradict"
      },
      {
        label: "DeFi Compliance Guidelines",
        claim: "Dynamic cross-chain asset rebalancing is categorized as asset-management activity under revised regulatory drafts.",
        stance: "neutral"
      }
    ],
    angles: {
      logicalConsistency: "Launching 'immediately' to capture early TVL directly contradicts the core goal of asset preservation. Speed is prioritized over formal system verification.",
      factualGrounding: "Grounded directly in historic bridge hack statistics and key-management baseline security frameworks.",
      riskEdgeCases: "A flash-loan attack could manipulate pool pricing on secondary DEXs, draining the pool's entire balance within a single block transition.",
      alternativeView: "Postpone public launch by 4 weeks. Engage an external firm for a manual code audit, upgrade the multi-sig to 5-of-8 with distributed hardware keys, and launch on a testnet first."
    }
  },
  {
    id: "mexico-nearshoring",
    title: "Mexico Nearshoring & Logistics Audit",
    category: "operations",
    tagline: "Cross-border supply chain restructuring",
    emoji: "🚛",
    description: "Compare transit times, tariff exposure, geopolitical risks, and labor cost trade-offs between Chinese/Vietnamese production and Mexican manufacturing.",
    userPrompt: "Should we relocate our primary consumer electronics assembly facilities from Shenzhen and Vietnam to Monterrey, Mexico to reduce tariff exposure and transit times, despite a 22% increase in base labor costs?",
    assistantContent: `### Supply Chain Sourcing & Nearshoring Audit

Relocating assembly operations to Monterrey, Mexico is highly recommended. The 22% increase in base labor wages is fully offset by the elimination of 25% import tariffs, a **92% reduction in transit times** (from 30 days ocean freight to 2 days truck freight), and significantly lower working capital requirements.

#### Logistics and Financial Summary
* **Shenzhen/Vietnam Logistics**: Transit is 28-35 days; shipping cost is $6,200 per container; tariff is 25%.
* **Monterrey, Mexico Logistics**: Transit is 2-3 days; shipping cost is $2,400 per truckload; tariff is 0% (under USMCA rules).
* **Net Margin Impact**: **+7.4% net margin improvement** within 12 months of transition.`,
    score: 82,
    evidence: [
      {
        label: "USMCA Trade Agreement Chapter 4",
        claim: "Electronics assembled in Mexico with at least 60% regional value content qualify for completely tariff-free entry.",
        stance: "support"
      },
      {
        label: "Monterrey Industrial Zone Survey",
        claim: "Premium warehouse space in Monterrey has reached 98% occupancy, raising lease rates by 14% year-over-year.",
        stance: "neutral"
      },
      {
        label: "Shenzhen Port Delays Log",
        claim: "Ocean terminal bottlenecks introduce an average 8-day variance in delivery timelines, harming just-in-time delivery.",
        stance: "support"
      }
    ],
    angles: {
      logicalConsistency: "The logic is sound. Rising labor rates in Mexico are offset by reduced inventory carry times and elimination of port demurrage and high tariffs.",
      factualGrounding: "USMCA tariff exemptions are statutory facts. Transit timelines are verified by global shipping logs.",
      riskEdgeCases: "Monterrey faces critical infrastructure challenges, specifically electric grid stability and water supply issues, which could disrupt production lines.",
      alternativeView: "Establish a hybrid model: Keep component fabrication in high-efficiency Chinese factories, but move final assembly, testing, and packaging to Monterrey to qualify for tariff exemptions."
    }
  },
  {
    id: "series-a-equity",
    title: "Series-A Equity & Option Pool Structuring",
    category: "legal",
    tagline: "Founder dilution and investor terms evaluation",
    emoji: "🔑",
    description: "Evaluate Series-A term sheets. Analyze the impact of 'pre-money' option pool expansion requirements on founder equity, voting control, and future dilutions.",
    userPrompt: "Our lead VC wants a pre-money valuation of $18M on our Series-A but demands we establish a 15% post-money employee option pool taken entirely from the pre-money valuation. How does this impact existing founder dilution?",
    assistantContent: `### Series-A Term Sheet & Cap Table Audit

Agreeing to place the entire 15% post-money option pool expansion in the **pre-money** valuation is a highly aggressive investor-friendly clause. This effectively lowers your true pre-money valuation from $18M to **$14.85M**, absorbing 100% of the dilution penalty into the founders' shares instead of sharing it proportionally with the new investors.

#### True Valuation Breakdowns
* **Nominal Terms**: Pre-money Valuation of $18,000,000; Investment of $5,000,000.
* **The Option Pool Dilution Loop**: Inserting a 15% post-money pool ($3.45M) into the pre-money pool dilutes the founders' equity by **an additional 19.1%** prior to the investment.
* **Effective Pre-money Valuation**: **$14,550,000** is the true price paid for existing shares.`,
    score: 56,
    evidence: [
      {
        label: "Venture Capital Term Sheet Manual",
        claim: "Standard employee option pools for Series-A range between 8% and 12% post-money.",
        stance: "neutral"
      },
      {
        label: "National Venture Capital Assoc Code",
        claim: "Placing the pool in the pre-money valuation is standard, but the size should be right-sized to actual hiring needs over the next 18 months.",
        stance: "support"
      },
      {
        label: "Founder Equity Calculator",
        claim: "A 15% pre-money option pool cuts the founding team's post-investment ownership from 56% to 41.5%, giving up negative control rights.",
        stance: "contradict"
      }
    ],
    angles: {
      logicalConsistency: "Claiming an $18M pre-money valuation is mathematically inconsistent when the option pool is forced entirely onto the pre-money cap. The founders bear 100% of the price reduction.",
      factualGrounding: "Cap table mathematical formulas are absolute. Option pool size standards are backed by NVCA industry averages.",
      riskEdgeCases: "If hiring is slower than projected, the unused pool remains on the cap table, diluting founders unnecessarily until a liquidation or recapitalization event.",
      alternativeView: "Counter with a 10% pool size, or propose that any pool expansion above 8% be funded post-money, dividing the dilution penalty proportionally between founders and new Series-A investors."
    }
  }
];

export const getTemplateById = (id: string): DecisionTemplate | undefined => {
  return DECISION_TEMPLATES.find(t => t.id === id);
};

export const createChatFromTemplate = (template: DecisionTemplate, dynamicId = false): Chat => {
  const chatId = dynamicId ? `template-${template.id}-${Date.now()}` : `template-${template.id}`;
  return {
    id: chatId,
    title: template.title,
    pinned: false,
    temporary: false,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${chatId}-u`,
        role: "user",
        content: template.userPrompt
      },
      {
        id: `msg-${chatId}-a`,
        role: "assistant",
        content: template.assistantContent,
        decision: {
          score: template.score,
          scoreState: "scored",
          evidence: template.evidence,
          angles: template.angles
        }
      }
    ]
  };
};
