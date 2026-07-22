import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  Send,
  Plus,
  Search,
  Pin,
  PinOff,
  Share2,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  X,
  FileText,
  Image,
  Video,
  Music,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Menu,
  Clock,
  ArrowRight,
  Sparkles,
  Copy,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  FileUp,
  FileCode,
  Shield,
  SquareTerminal,
  Zap,
  Info,
  Volume2,
  VolumeX,
  RotateCw,
  ChevronUp,
  MoreHorizontal,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  Settings,
  LogOut,
  PanelLeft,
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Square,
  Palette
} from "lucide-react";

import { Chat, Message, Attachment, Evidence, VerificationAngles } from "./types";
import { DocumentWorkshop } from "./components/DocumentWorkshop";

// Seed data to ensure Veriqon AI never loads with an empty chat screen
const SEED_CHATS: Chat[] = [
  {
    id: "q3-strategy",
    title: "Q3 Product Launch Strategy",
    pinned: true,
    temporary: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    messages: [
      {
        id: "msg-1-u",
        role: "user",
        content: "Should we expand our upcoming Q3 SaaS product launch to secondary tier-2 markets immediately, or consolidate in primary markets first? Budget constraint is strict at $150K."
      },
      {
        id: "msg-1-a",
        role: "assistant",
        content: "### Q3 Market Expansion Analysis\n\nExpanding to tier-2 markets immediately offers a high growth trajectory but introduces substantial operational strain. Based on current constraints, **consolidating in tier-1 primary markets first** while executing a low-cost pilot in secondary markets is the most verifiable path forward.\n\n#### Recommendation Matrix\n1. **Consolidation**: Focus 80% ($120K) of budget on primary markets to secure early renewals and stabilize unit economics.\n2. **Pilot Expansion**: Allocate 20% ($30K) to digital-only acquisition in tier-2 regions to gather high-fidelity conversion data.\n\nThis mitigates capital risk while maintaining secondary market visibility.",
        decision: {
          score: 85,
          scoreState: "scored",
          evidence: [
            {
              label: "Primary SaaS Benchmark Q2",
              claim: "Focusing on core markets achieves 35% higher customer lifetime value (LTV) than multi-region splits.",
              stance: "support"
            },
            {
              label: "Q3 Cost Projection Report",
              claim: "Immediate physical localization in tier-2 markets will exceed the $150K total budget ceiling by 22%.",
              stance: "contradict"
            },
            {
              label: "Channel Ad Tech Study",
              claim: "Digital-only search ads in tier-2 regions average 40% lower cost per acquisition.",
              stance: "support"
            }
          ],
          angles: {
            logicalConsistency: "The budget ceiling and localization costs are mathematically incompatible with a full dual-launch. Consolidating primary spend while running a lightweight digital pilot resolves this contradiction directly.",
            factualGrounding: "Supported by standard SaaS LTV benchmarks and localized ad-spend models. Cost projection overrides general expansion optimism.",
            riskEdgeCases: "Over-allocation to primary markets risks stagnation if local competition shifts aggressively. A failure in partner networks could halt the secondary pilot.",
            alternativeView: "An alternative approach is raising another $50K bridge round to fully launch in both primary and secondary markets simultaneously, capturing early land-grab advantages."
          }
        }
      }
    ]
  },
  {
    id: "relocating-hq",
    title: "Relocating HQ to Austin",
    pinned: false,
    temporary: false,
    createdAt: new Date().toISOString(), // Today
    messages: [
      {
        id: "msg-2-u",
        role: "user",
        content: "Relocating our tech HQ from San Francisco to Austin. Will this improve net operating margins within 18 months?"
      },
      {
        id: "msg-2-a",
        role: "assistant",
        content: "### Corporate Relocation Assessment\n\nRelocating the physical headquarters to Austin, Texas is highly likely to improve operating margins in the *long term*, but the 18-month timeline is highly aggressive. Major upfront relocation expenditures, recruitment lag, and SF lease termination penalties will heavily depress margins in year one.\n\n#### Timeline of Margin Impact\n- **Months 1-6**: Margin decrease of **-12%** due to capital exit costs and severance.\n- **Months 7-12**: Neutral margin as Austin recruitment offsets San Francisco payroll overhead.\n- **Months 13-18**: Margin expansion of **+6%** driven by Texas tax structures and lower facilities costs.",
        decision: {
          score: 68,
          scoreState: "scored",
          evidence: [
            {
              label: "Texas Tax Directive Code",
              claim: "Zero state corporate income tax lowers long-term tax liabilities significantly.",
              stance: "support"
            },
            {
              label: "SF Lease Exit Audit",
              claim: "Premature lease termination costs will incur an immediate $450K liquidity penalty.",
              stance: "contradict"
            },
            {
              label: "Tech Recruitment Index",
              claim: "Average tech payroll in Austin is 18% lower than SF equivalents, but the senior talent pool is highly competitive.",
              stance: "neutral"
            }
          ],
          angles: {
            logicalConsistency: "Claiming margin gains in 18 months ignores immediate lease termination penalties. The long-term tax advantages are logical, but the short-term capital outlay suppresses immediate positive ROI.",
            factualGrounding: "Grounded in state tax codes and local real estate pricing. However, recruiting friction averages are highly variable and represent a soft data point.",
            riskEdgeCases: "Attrition of critical staff could exceed 30%, which would delay core product roadmaps and offset facility-based cost savings.",
            alternativeView: "Keep HQ in SF as a small executive hub and hire all future engineering remotely in low-cost jurisdictions to avoid physical real estate exit fees."
          }
        }
      }
    ]
  },
  {
    id: "coreflow-acquisition",
    title: "Competitor CoreFlow Acquisition",
    pinned: false,
    temporary: false,
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // Yesterday
    messages: [
      {
        id: "msg-3-u",
        role: "user",
        content: "We want to acquire CoreFlow for $2.4M to absorb their 40 enterprise customers. Their codebase is built on legacy Rails 5. Is this structurally sound?"
      },
      {
        id: "msg-3-a",
        role: "assistant",
        content: "### Technical Acquisition Risk Report\n\nAcquiring CoreFlow purely for enterprise distribution is viable, but the legacy tech stack is a **critical vulnerability**. Absorbing Rails 5 legacy infrastructure with unresolved technical debt presents a severe security and integration barrier.\n\n#### Strategic Alternatives\n1. **Acquire & Sunset**: Buy the assets, migrate the 40 accounts immediately to your modern platform, and fully sunset CoreFlow's infrastructure within 90 days.\n2. **Technology Refactoring**: Allocate an additional $600K and 12 months solely for complete system refactoring.",
        decision: {
          score: 42,
          scoreState: "scored",
          evidence: [
            {
              label: "Technical Debt Audit",
              claim: "CoreFlow code contains 48 known vulnerabilities and lacks modern API support.",
              stance: "contradict"
            },
            {
              label: "Customer Account Audit",
              claim: "Enterprise contracts yield $800K in predictable annual recurring revenue.",
              stance: "support"
            },
            {
              label: "Migration Sizing Study",
              claim: "Data migration is estimated to take 6-9 months due to incompatible schemas.",
              stance: "contradict"
            }
          ],
          angles: {
            logicalConsistency: "The speed advantage of 'instant market share' is contradicted by a 9-month painful system migration. Acquiring legacy tech to accelerate product capability is logically inconsistent.",
            factualGrounding: "Based directly on Rails 5 security support lifecycle (ended) and enterprise contract ARR calculations.",
            riskEdgeCases: "Major customers could churn during a slow, disruptive migration phase if they perceive support drop-offs.",
            alternativeView: "Launch a highly targeted sales campaign targeting CoreFlow accounts with custom migration discounts, acquiring the accounts organically for a fraction of the $2.4M price."
          }
        }
      }
    ]
  },
  {
    id: "insufficient-evidence-sample",
    title: "Brand Name: 'AeroSpire'",
    pinned: false,
    temporary: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    messages: [
      {
        id: "msg-4-u",
        role: "user",
        content: "What do you think of 'AeroSpire' for a high-performance drone delivery service brand name?"
      },
      {
        id: "msg-4-a",
        role: "assistant",
        content: "### Brand Name Assessment: 'AeroSpire'\n\n'AeroSpire' is a strong, phonetic blend that combines themes of high-altitude flight (Aero) and reaching top peaks or ambitions (Spire).\n\n#### Aesthetic Evaluation\n- **Phonetics**: Crisp, dual-syllable, easily pronounceable.\n- **Associations**: Premium, aerospace grade, tech-driven.\n- **Memorability**: Highly competitive domain space, but clean branding structure.",
        decision: {
          score: 0,
          scoreState: "insufficient_evidence",
          evidence: [
            {
              label: "Model reasoning only — no external evidence used.",
              claim: "Subjective naming evaluation based on semantic metrics.",
              stance: "neutral"
            }
          ],
          angles: {
            logicalConsistency: "Naming quality is highly subjective and depends heavily on brand execution. There is no contradiction, but no formal logic can prove name supremacy.",
            factualGrounding: "Trademark and trademark search databases are required to verify commercial viability. No live legal grounding is available in this snapshot.",
            riskEdgeCases: "Trademark collisions with 'Aero' or 'Spire' software companies are a high risk without a comprehensive legal audit.",
            alternativeView: "Consider shorter names like 'VeloDrone' or 'Zenith' to avoid the high-density 'Aero-' namespace prefix."
          }
        }
      }
    ]
  }
];

const getDetectedWorkshopFile = (content: string) => {
  if (!content) return null;

  // 1. Check SVG
  const svgRegex = /```(?:xml|svg)?\s*(<svg[\s\S]*?<\/svg>)/i;
  const svgMatch = content.match(svgRegex) || content.match(/(<svg[\s\S]*?<\/svg>)/i);
  if (svgMatch) {
    return { type: "svg" as const, name: "vector_diagram.svg", content: svgMatch[1].trim() };
  }

  // 2. Check CSV
  const csvMatch = content.match(/```(?:csv|tsv)\s*([\s\S]*?)```/i);
  if (csvMatch && csvMatch[1].trim()) {
    return { type: "csv" as const, name: "spreadsheet.csv", content: csvMatch[1].trim() };
  }

  // 3. Check general HTML
  const htmlMatch = content.match(/```(?:html)\s*([\s\S]*?)```/i);
  if (htmlMatch && htmlMatch[1].trim()) {
    return { type: "document" as const, name: "page.html", content: htmlMatch[1].trim() };
  }

  // 4. Fallback: If message content is long, let's treat the entire content as a Markdown document
  if (content.trim().length > 150) {
    return { type: "document" as const, name: "document.md", content: content.trim() };
  }

  return null;
};

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isTemporary, setIsTemporary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Workshop States
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [workshopFile, setWorkshopFile] = useState<{
    type: "document" | "csv" | "svg" | "canvas";
    name: string;
    content: string;
  } | null>(null);

  // User Session & Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("veriqon_is_logged_in");
    return saved !== "false"; // Default to true unless explicitly logged off
  });
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("parthchaudhari974@gmail.com");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Simulated Registered Users Persistence
  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; password: string }[]>(() => {
    const saved = localStorage.getItem("veriqon_registered_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [{ email: "parthchaudhari974@gmail.com", password: "password123" }];
  });

  // Simulated OAuth Popups State
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | "gmail" | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthSuccess, setOauthSuccess] = useState(false);

  // Desktop Sidebar Toggle (Sidebar for tabs)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Theme and Mode State
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [userSelectedMode, setUserSelectedMode] = useState<"auto" | "standard" | "audit">("auto");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // Intent Classification Router
  const classifyIntent = (text: string): "standard" | "audit" | "deep_search" => {
    const t = text.toLowerCase().trim();
    
    // 1. Check Deep Search Triggers
    const deepSearchKeywords = [
      "compare", "competitor", "market research", "versus", "vs", "academic", "scientific analysis", 
      "latest trends", "current events", "google search", "web search", "investigate", "sources", 
      "evidence gathering", "recent news", "pricing comparison", "feature comparison", "industry report",
      "latest", "newest", "recently", "recent", "search for", "who is", "current status"
    ];
    if (deepSearchKeywords.some(kw => t.includes(kw))) {
      return "deep_search";
    }
    
    // 2. Check Decision Triggers
    const decisionKeywords = [
      "should we", "acquire", "relocate", "invest", "hiring", "recruit", "compliance", "legal", 
      "medical", "policy", "strategy", "architecture", "trade-off", "risk", "security analysis", 
      "budget", "liability", "ethics", "consequences", "operating margin", "capital", "roi", "audit",
      "decide", "pros and cons", "evaluate"
    ];
    if (decisionKeywords.some(kw => t.includes(kw))) {
      return "audit";
    }
    
    // Default to Standard Mode
    return "standard";
  };

  // Sync theme to localStorage and document class
  useEffect(() => {
    const savedTheme = localStorage.getItem("veriqon_theme") as "light" | "dark" | "auto" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("veriqon_theme", theme);
    const root = document.documentElement;
    
    const applyTheme = () => {
      if (theme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        // Auto System Theme
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
          root.classList.remove("light");
        } else {
          root.classList.add("light");
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();

    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme();
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Editing state (inline rename)
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Toast notifications (3-second undo delete)
  const [recentlyDeleted, setRecentlyDeleted] = useState<Chat | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sharing states
  const [shareModalChat, setShareModalChat] = useState<Chat | null>(null);
  const [includeScoreInShare, setIncludeScoreInShare] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Expanded evidence state per message ID
  const [expandedEvidence, setExpandedEvidence] = useState<{ [key: string]: number | null }>({});
  
  // Multi-Angle selected tab state per message ID (defaults to 'logicalConsistency')
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: keyof VerificationAngles }>({});

  // Loading animation state cycling
  const [loadingText, setLoadingText] = useState("Generating response...");
  const [freezeLoading, setFreezeLoading] = useState(false);
  const loadingCycleRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Read-only share parameter parsing
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);
  const [sharedChat, setSharedChat] = useState<Chat | null>(null);
  const [excludeScoreOnSharedView, setExcludeScoreOnSharedView] = useState(false);

  // Auto-scroll chat thread
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AbortController for cancelling active prompt requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Action states
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [shareOnlyLatestPair, setShareOnlyLatestPair] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [editingPromptMessageId, setEditingPromptMessageId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState("");

  // Smart Prompt Optimizer States
  const [isOptimizingPrompt, setIsOptimizingPrompt] = useState(false);
  const [optimizationSuccessReason, setOptimizationSuccessReason] = useState<string | null>(null);
  const [selectedRefinementTab, setSelectedRefinementTab] = useState<Record<string, 'initial' | 'critic' | 'improve' | 'final'>>({});

  // 2-Variations Smart Prompt Optimizer States
  const [promptVariations, setPromptVariations] = useState<{ title: string; vibe: string; optimized: string }[] | null>(null);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number | null>(null);
  const [noOptimizationStatus, setNoOptimizationStatus] = useState<boolean>(false);

  const handleGenerateVariations = async () => {
    if (!inputText.trim()) return;
    setIsGeneratingVariations(true);
    setSelectedVariationIndex(null);
    setPromptVariations(null);
    setNoOptimizationStatus(false);
    try {
      const res = await fetch("/api/optimize-prompt-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.shouldOptimize === false || data.status === "NO_OPTIMIZATION") {
          setNoOptimizationStatus(true);
        } else if (data.variations && data.variations.length >= 2) {
          setPromptVariations(data.variations);
        }
      }
    } catch (err) {
      console.error("Failed to generate prompt variations:", err);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const isVagueInput = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return false;
    if (trimmed.toLowerCase() === "clear") return false;
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    const isVaguePattern = /^(help|explain|calculate|check|is this good|should i do it|what is|how to|test|hello|hi|please help|verify|review)\??$/i.test(trimmed);
    return trimmed.length < 35 || wordCount < 6 || isVaguePattern;
  };

  const handleOptimizePrompt = async () => {
    if (!inputText.trim()) return;
    setIsOptimizingPrompt(true);
    setOptimizationSuccessReason(null);
    try {
      const res = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.optimized) {
          setInputText(data.optimized);
          setOptimizationSuccessReason(data.reason || "Prompt expanded successfully!");
          setTimeout(() => setOptimizationSuccessReason(null), 4500);
        }
      }
    } catch (err) {
      console.error("Failed to optimize prompt:", err);
    } finally {
      setIsOptimizingPrompt(false);
    }
  };

  // Initialize: Load from localStorage or seed
  useEffect(() => {
    // Check if there is a shared link first
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get("share");
    if (shareParam) {
      try {
        const decoded = decodeURIComponent(escape(atob(shareParam)));
        const parsed: Chat = JSON.parse(decoded);
        if (parsed && parsed.id && Array.isArray(parsed.messages)) {
          setSharedChat(parsed);
          setIsReadOnlyView(true);
          const exclude = params.get("excludeScore") === "true";
          setExcludeScoreOnSharedView(exclude);
          return;
        }
      } catch (e) {
        console.error("Failed to parse shared chat link", e);
      }
    }

    // Load from local storage
    const stored = localStorage.getItem("veriqon_chats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
          setActiveChatId(parsed[0].id);
          return;
        }
      } catch (err) {
        console.error("Error loading chats from storage", err);
      }
    }

    // Set default seed data
    setChats(SEED_CHATS);
    setActiveChatId(SEED_CHATS[0].id);
    localStorage.setItem("veriqon_chats", JSON.stringify(SEED_CHATS));
  }, []);

  // Sync to local storage
  const saveChats = (newChats: Chat[]) => {
    setChats(newChats);
    // Only persist non-temporary chats
    const persistable = newChats.filter(c => !c.temporary);
    localStorage.setItem("veriqon_chats", JSON.stringify(persistable));
  };

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, isGenerating]);

  // Loading animation cycles
  useEffect(() => {
    if (isGenerating) {
      setFreezeLoading(false);
      setLoadingText("Generating response...");
      
      const phrases = [
        "Generating response...",
        "Cross-checking evidence...",
        "Evaluating from multiple angles..."
      ];
      let phraseIndex = 0;

      // Cycle phrases every 1.5 seconds
      loadingCycleRef.current = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setLoadingText(phrases[phraseIndex]);
      }, 1500);

      // Freeze after 7 seconds to "Still verifying..."
      loadingTimeoutRef.current = setTimeout(() => {
        if (loadingCycleRef.current) clearInterval(loadingCycleRef.current);
        setLoadingText("Still verifying...");
        setFreezeLoading(true);
      }, 7000);
    } else {
      if (loadingCycleRef.current) clearInterval(loadingCycleRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    }

    return () => {
      if (loadingCycleRef.current) clearInterval(loadingCycleRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [isGenerating]);

  // Clean up Voice Aloud playback on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Click outside listener for attachment/kebab menu & mode dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showAttachmentMenu && attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target as Node)) {
        setShowAttachmentMenu(false);
      }
      if (showModeDropdown && modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAttachmentMenu, showModeDropdown]);

  // Password Strength Checker
  const getPasswordStrength = (pwd: string) => {
    return {
      length: pwd.length >= 12 && pwd.length <= 128,
      recommended: pwd.length >= 16,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\s]/.test(pwd)
    };
  };

  // Handle log off / sign out
  const handleLogOff = () => {
    setIsLoggedIn(false);
    localStorage.setItem("veriqon_is_logged_in", "false");
    // Clear any temporary states
    setLoginError("");
    setSignupError("");
  };

  // Handle stopping/cancelling the active API request
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Handle simulated login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const trimmedEmail = loginEmail.trim().toLowerCase();
    
    if (!trimmedEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      // Find user in registered list
      const matchedUser = registeredUsers.find(
        u => u.email.toLowerCase() === trimmedEmail && u.password === loginPassword
      );

      // Also allow default user if registeredUsers fails to sync
      const isDefaultUser = trimmedEmail === "parthchaudhari974@gmail.com" && loginPassword === "password123";

      if (matchedUser || isDefaultUser) {
        setIsLoggedIn(true);
        localStorage.setItem("veriqon_is_logged_in", "true");
        setIsLoggingIn(false);
        setLoginError("");

        // Requirement: "when relogin start with new tab" (start with a brand new verification tab)
        const newId = `chat-${Date.now()}`;
        const newChat: Chat = {
          id: newId,
          title: "New Decision Analysis",
          pinned: false,
          temporary: false,
          createdAt: new Date().toISOString(),
          messages: []
        };

        setChats(prev => [newChat, ...prev.filter(c => c.id !== newId)]);
        setActiveChatId(newId);
      } else {
        setIsLoggingIn(false);
        setLoginError("Invalid email or password combination. Try parthchaudhari974@gmail.com / password123 or sign up.");
      }
    }, 850);
  };

  // Handle simulated signup submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess(false);

    const trimmedEmail = signupEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setSignupError("Email address is required.");
      return;
    }

    // Password validation according to standard
    const pStatus = getPasswordStrength(signupPassword);
    const isPasswordValid = pStatus.length && pStatus.uppercase && pStatus.lowercase && pStatus.number && pStatus.special;

    if (!isPasswordValid) {
      setSignupError("Your password does not satisfy all validation criteria below.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    // Check if user already exists
    const userExists = registeredUsers.some(u => u.email.toLowerCase() === trimmedEmail);
    if (userExists) {
      setSignupError("An account with this email address already exists.");
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      const newUser = { email: trimmedEmail, password: signupPassword };
      const updatedUsers = [...registeredUsers, newUser];
      
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("veriqon_registered_users", JSON.stringify(updatedUsers));
      
      setSignupSuccess(true);
      setIsLoggingIn(false);

      // Pre-fill login screen for instant verification
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);
      
      // Clear signup form
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      
      // Auto-switch to login tab with success banner after 1.5 seconds
      setTimeout(() => {
        setAuthMode("login");
        setSignupSuccess(false);
      }, 1500);

    }, 1000);
  };

  // Handle simulated OAuth action (Google, GitHub, Gmail)
  const handleOAuthClick = (provider: "google" | "github" | "gmail") => {
    setOauthProvider(provider);
    setOauthModalOpen(true);
    setOauthLoading(true);
    setOauthSuccess(false);

    // Step-by-step progress simulation
    setTimeout(() => {
      setOauthLoading(false);
      setOauthSuccess(true);

      setTimeout(() => {
        setOauthModalOpen(false);
        setIsLoggedIn(true);
        localStorage.setItem("veriqon_is_logged_in", "true");

        // Requirement: "when relogin start with new tab"
        const newId = `chat-${Date.now()}`;
        const newChat: Chat = {
          id: newId,
          title: `Decision Analysis (${provider === "google" ? "Google" : provider === "github" ? "GitHub" : "Gmail"} Auth)`,
          pinned: false,
          temporary: false,
          createdAt: new Date().toISOString(),
          messages: []
        };

        setChats(prev => [newChat, ...prev.filter(c => c.id !== newId)]);
        setActiveChatId(newId);
      }, 1200);
    }, 2000);
  };

  // Handle active chat retrieval
  const activeChat = isReadOnlyView ? sharedChat : chats.find(c => c.id === activeChatId);
  const lastMessage = activeChat && activeChat.messages.length > 0 ? activeChat.messages[activeChat.messages.length - 1] : null;
  const canRegenerateLast = lastMessage && lastMessage.role === "assistant";

  // Create a new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: isTemporary ? "Temporary Verification Session" : "New Decision Analysis",
      pinned: false,
      temporary: isTemporary,
      createdAt: new Date().toISOString(),
      messages: []
    };

    if (!isTemporary) {
      const updated = [newChat, ...chats];
      saveChats(updated);
    }
    // Set active chat even if temporary
    if (isTemporary) {
      // Temporary chat stored only in component state, not saved to storage
      setChats(prev => [newChat, ...prev.filter(c => !c.temporary)]);
    }
    setActiveChatId(newChat.id);
    setSearch("");
    setSidebarOpen(false);
  };

  // Toggle Pinned status
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const updated = chats.map(c => (c.id === id ? { ...c, pinned: !c.pinned } : c));
    saveChats(updated);
  };

  // Rename action
  const handleStartRename = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (id: string) => {
    if (!editTitle.trim()) return;
    const updated = chats.map(c => (c.id === id ? { ...c, title: editTitle.trim() } : c));
    saveChats(updated);
    setEditingChatId(null);
  };

  // Inline Delete confirmation triggering (instead of modal)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleTriggerDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setDeleteConfirmId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chatToDelete = chats.find(c => c.id === id);
    if (!chatToDelete) return;

    // Clear existing timer if any
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    // Save recently deleted item
    setRecentlyDeleted(chatToDelete);
    setShowUndoToast(true);

    // Remove from main list
    const updated = chats.filter(c => c.id !== id);
    saveChats(updated);
    setDeleteConfirmId(null);

    // Auto-select another chat if deleted active
    if (activeChatId === id && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }

    // Set 3-second timeout for commit
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndoToast(false);
      setRecentlyDeleted(null);
    }, 3000);
  };

  // Undo delete
  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    const restoredChats = [recentlyDeleted, ...chats];
    saveChats(restoredChats);
    setActiveChatId(recentlyDeleted.id);
    
    setRecentlyDeleted(null);
    setShowUndoToast(false);
  };

  // Clear all messages in the currently active chat (Clear whole tab feature)
  const handleClearCurrentThread = () => {
    if (!activeChat) return;
    
    const clearedChat = {
      ...activeChat,
      messages: []
    };
    
    if (!isTemporary) {
      const otherChats = chats.map(c => c.id === activeChat.id ? clearedChat : c);
      saveChats(otherChats);
    } else {
      setChats(prev => prev.map(c => c.id === activeChat.id ? clearedChat : c));
    }
  };

  // Toggle selection of a single chat
  const handleToggleSelectChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChatIds(prev =>
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  // Select all visible non-temporary chats
  const handleSelectAllChats = () => {
    const allVisibleIds = chats.filter(c => !c.temporary).map(c => c.id);
    setSelectedChatIds(allVisibleIds);
  };

  // Deselect all chats
  const handleDeselectAllChats = () => {
    setSelectedChatIds([]);
  };

  // Bulk delete selected chats (Select & Delete feature)
  const handleBulkDeleteChats = () => {
    if (selectedChatIds.length === 0) return;
    
    const updatedChats = chats.filter(c => !selectedChatIds.includes(c.id));
    saveChats(updatedChats);
    
    // Reset selection and multi-select mode
    setSelectedChatIds([]);
    setIsMultiSelectMode(false);
    
    // If the active chat was deleted, switch to the first remaining chat, or seed if empty
    if (activeChatId && selectedChatIds.includes(activeChatId)) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
      } else {
        const newId = `chat-${Date.now()}`;
        const newC: Chat = {
          id: newId,
          title: "New Decision Verification",
          pinned: false,
          temporary: false,
          createdAt: new Date().toISOString(),
          messages: []
        };
        saveChats([newC]);
        setActiveChatId(newId);
      }
    }
  };

  // Share link generator
  const handleOpenShare = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setShareModalChat(chat);
    setIncludeScoreInShare(true);
    setShareOnlyLatestPair(false); // Reset on open
    setCopiedLink(false);
  };

  // Filter messages to include only the last specific prompt-answer pair if requested
  const getShareableChat = () => {
    if (!shareModalChat) return null;
    if (!shareOnlyLatestPair) return shareModalChat;

    const msgs = shareModalChat.messages;
    const assistantIndex = [...msgs].reverse().findIndex(m => m.role === "assistant");
    if (assistantIndex === -1) return shareModalChat;

    const actualAssistantIndex = msgs.length - 1 - assistantIndex;
    let userIndex = -1;
    for (let i = actualAssistantIndex - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        userIndex = i;
        break;
      }
    }

    const filteredMessages = [];
    if (userIndex !== -1) {
      filteredMessages.push(msgs[userIndex]);
    }
    filteredMessages.push(msgs[actualAssistantIndex]);

    return {
      ...shareModalChat,
      messages: filteredMessages
    };
  };

  const handleCopyShareLink = () => {
    const shareable = getShareableChat();
    if (!shareable) return;
    
    const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(shareable))));
    const link = `${window.location.origin}${window.location.pathname}?share=${serialized}&excludeScore=${!includeScoreInShare}`;
    
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Message Copy functionality
  const handleCopyMessageText = (messageId: string, content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  // Copy and Edit functionality
  const handleCopyAndEditMessage = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInputText(content);
    // Focus prompt input
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  // Inline Edit Prompt Save Handler
  const handleSaveEditedPrompt = async (messageId: string, newText: string) => {
    if (!newText.trim() || !activeChat || isGenerating) return;

    // Find the message index
    const msgIndex = activeChat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Updated user message with new text
    const updatedUserMsg: Message = {
      ...activeChat.messages[msgIndex],
      content: newText.trim()
    };

    // Keep messages up to this user message (truncate everything after it)
    const updatedMessages = [
      ...activeChat.messages.slice(0, msgIndex),
      updatedUserMsg
    ];

    const updatedChat = {
      ...activeChat,
      messages: updatedMessages
    };

    if (!isTemporary) {
      const otherChats = chats.map(c => c.id === activeChat.id ? updatedChat : c);
      saveChats(otherChats);
    } else {
      setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    }

    setEditingPromptMessageId(null);
    setEditingPromptText("");
    setIsGenerating(true);

    // Classify mode
    let targetMode: "standard" | "audit" | "deep_search" = "standard";
    let trigger: "auto" | "manual" = "auto";

    if (userSelectedMode === "standard") {
      targetMode = "standard";
      trigger = "manual";
    } else if (userSelectedMode === "audit") {
      targetMode = "audit";
      trigger = "manual";
    } else {
      targetMode = classifyIntent(newText.trim());
      trigger = "auto";
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, mode: targetMode }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Failed to receive structured decision response.");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-asst`,
        role: "assistant",
        content: data.content,
        decision: data.decision,
        refinement: data.refinement,
        optimizedPrompt: data.optimizedPrompt,
        mode: targetMode,
        routingTrigger: trigger
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedMessages, assistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.filter(c => c.id !== finalChat.id);
        saveChats([finalChat, ...otherChats]);
      } else {
        setChats(prev => [finalChat, ...prev.filter(c => c.id !== finalChat.id)]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === "AbortError" || (err instanceof DOMException && err.name === "AbortError")) {
        const stoppedMessage: Message = {
          id: `msg-${Date.now()}-stop`,
          role: "assistant",
          content: "### ⏹️ Verification Aborted\n\nThe generation and verification process was stopped by the user.",
          mode: targetMode,
          routingTrigger: trigger
        };

        const stoppedChat = {
          ...updatedChat,
          messages: [...updatedMessages, stoppedMessage]
        };

        if (!isTemporary) {
          const otherChats = chats.filter(c => c.id !== stoppedChat.id);
          saveChats([stoppedChat, ...otherChats]);
        } else {
          setChats(prev => [stoppedChat, ...prev.filter(c => c.id !== stoppedChat.id)]);
        }
        return;
      }

      const errorAssistantMessage: Message = {
        id: `msg-${Date.now()}-err`,
        role: "assistant",
        content: `### ❌ Decision Engine Interrupted\n\nUnable to process prompt. System error: ${err.message || "Network Timeout"}`,
        mode: targetMode,
        routingTrigger: trigger
      };

      const errorChat = {
        ...updatedChat,
        messages: [...updatedMessages, errorAssistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.filter(c => c.id !== errorChat.id);
        saveChats([errorChat, ...otherChats]);
      } else {
        setChats(prev => [errorChat, ...prev.filter(c => c.id !== errorChat.id)]);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Delete specific message in thread
  const handleDeleteMessage = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeChat) return;

    const updatedMessages = activeChat.messages.filter(m => m.id !== messageId);
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages
    };

    if (!isTemporary) {
      const otherChats = chats.map(c => c.id === activeChat.id ? updatedChat : c);
      saveChats(otherChats);
    } else {
      setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    }
  };

  // Speak Aloud / Text to Speech Toggle functionality
  const handleToggleSpeak = (messageId: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Cancel active synthesis first
    window.speechSynthesis.cancel();

    // Clean markdown characters out for realistic verbal flow
    const cleanText = text
      .replace(/[#*`_~]/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Regeneration of assistant response
  const handleRegenerate = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating || !activeChat) return;

    const msgIndex = activeChat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Slice history up to this assistant message (excluding it)
    const updatedMessages = activeChat.messages.slice(0, msgIndex);
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages
    };

    if (!isTemporary) {
      const otherChats = chats.map(c => c.id === activeChat.id ? updatedChat : c);
      saveChats(otherChats);
    } else {
      setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    }

    setIsGenerating(true);

    // Retrieve last user message to classify intent
    const lastUser = [...updatedMessages].reverse().find(m => m.role === "user");
    const textToClassify = lastUser ? lastUser.content : "";

    let targetMode: "standard" | "audit" | "deep_search" = "standard";
    let trigger: "auto" | "manual" = "auto";

    if (userSelectedMode === "standard") {
      targetMode = "standard";
      trigger = "manual";
    } else if (userSelectedMode === "audit") {
      targetMode = "audit";
      trigger = "manual";
    } else {
      targetMode = classifyIntent(textToClassify);
      trigger = "auto";
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, mode: targetMode }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Failed to receive structured decision response.");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-asst`,
        role: "assistant",
        content: data.content,
        decision: data.decision,
        refinement: data.refinement,
        optimizedPrompt: data.optimizedPrompt,
        mode: targetMode,
        routingTrigger: trigger
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedMessages, assistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.map(c => c.id === finalChat.id ? finalChat : c);
        saveChats(otherChats);
      } else {
        setChats(prev => prev.map(c => c.id === finalChat.id ? finalChat : c));
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === "AbortError" || (err instanceof DOMException && err.name === "AbortError")) {
        const stoppedMessage: Message = {
          id: `msg-${Date.now()}-stop`,
          role: "assistant",
          content: "### ⏹️ Verification Aborted\n\nThe generation and verification process was stopped by the user.",
          mode: targetMode,
          routingTrigger: trigger
        };

        const stoppedChat = {
          ...updatedChat,
          messages: [...updatedMessages, stoppedMessage]
        };

        if (!isTemporary) {
          const otherChats = chats.map(c => c.id === stoppedChat.id ? stoppedChat : c);
          saveChats(otherChats);
        } else {
          setChats(prev => prev.map(c => c.id === stoppedChat.id ? stoppedChat : c));
        }
        return;
      }

      const errorAssistantMessage: Message = {
        id: `msg-${Date.now()}-err`,
        role: "assistant",
        content: targetMode === "standard"
          ? "### ⚠️ System Warning\n\nI was unable to retrieve this response against the cloud-based Veriqon engine. Please verify that your **GEMINI_API_KEY** is configured in AI Studio secrets."
          : "### ⚠️ System Warning\n\nI was unable to verify this decision against the cloud-based Veriqon engine. Please verify that your **GEMINI_API_KEY** is configured in AI Studio secrets.",
        decision: targetMode === "standard" ? undefined : {
          score: targetMode === "deep_search" ? 80 : 0,
          scoreState: "insufficient_evidence",
          evidence: [
            {
              label: "Offline Engine",
              claim: "Verification server returned an unparseable state.",
              stance: "neutral"
            }
          ],
          angles: {
            logicalConsistency: "System consistency could not be verified automatically.",
            factualGrounding: "Verification requires an active, authenticated API connection.",
            riskEdgeCases: "Risk models cannot be calculated in offline fallback.",
            alternativeView: "Alternative perspective generation is currently offline."
          }
        },
        mode: targetMode,
        routingTrigger: trigger
      };

      const errorChat = {
        ...updatedChat,
        messages: [...updatedMessages, errorAssistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.map(c => c.id === errorChat.id ? errorChat : c);
        saveChats(otherChats);
      } else {
        setChats(prev => prev.map(c => c.id === errorChat.id ? errorChat : c));
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;
    if (isGenerating) return;

    // Check for clear command
    if (inputText.trim().toLowerCase() === "clear") {
      handleClearCurrentThread();
      setInputText("");
      setAttachments([]);
      setPromptVariations(null);
      setSelectedVariationIndex(null);
      return;
    }

    // Reset smart prompt variations
    setPromptVariations(null);
    setSelectedVariationIndex(null);

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: inputText,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    let currentChat = activeChat;
    const isNew = !currentChat || currentChat.messages.length === 0;

    // Create a new chat on the fly if needed
    if (!currentChat) {
      currentChat = {
        id: `chat-${Date.now()}`,
        title: isTemporary ? "Temporary Verification Session" : (inputText.substring(0, 30) || "Decision Analysis"),
        pinned: false,
        temporary: isTemporary,
        createdAt: new Date().toISOString(),
        messages: []
      };
    }

    const updatedMessages = [...currentChat.messages, userMessage];
    const updatedChat = {
      ...currentChat,
      title: isNew && !isTemporary ? (inputText.substring(0, 32) || "Decision Analysis") : currentChat.title,
      messages: updatedMessages
    };

    if (!isTemporary) {
      const otherChats = chats.filter(c => c.id !== currentChat!.id);
      saveChats([updatedChat, ...otherChats]);
    } else {
      setChats(prev => [updatedChat, ...prev.filter(c => c.id !== currentChat!.id)]);
    }

    setActiveChatId(updatedChat.id);
    setInputText("");
    setAttachments([]);
    setIsGenerating(true);

    // Classify the mode
    let targetMode: "standard" | "audit" | "deep_search" = "standard";
    let trigger: "auto" | "manual" = "auto";

    if (userSelectedMode === "standard") {
      targetMode = "standard";
      trigger = "manual";
    } else if (userSelectedMode === "audit") {
      targetMode = "audit";
      trigger = "manual";
    } else {
      targetMode = classifyIntent(inputText);
      trigger = "auto";
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Query our Express server backend `/api/chat` proxy with selected mode
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, mode: targetMode }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Failed to receive structured decision response.");
      }

      const data = await response.json();

      // Create assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-asst`,
        role: "assistant",
        content: data.content,
        decision: data.decision,
        refinement: data.refinement,
        optimizedPrompt: data.optimizedPrompt,
        mode: targetMode,
        routingTrigger: trigger
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedMessages, assistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.filter(c => c.id !== finalChat.id);
        saveChats([finalChat, ...otherChats]);
      } else {
        setChats(prev => [finalChat, ...prev.filter(c => c.id !== finalChat.id)]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === "AbortError" || (err instanceof DOMException && err.name === "AbortError")) {
        const stoppedMessage: Message = {
          id: `msg-${Date.now()}-stop`,
          role: "assistant",
          content: "### ⏹️ Verification Aborted\n\nThe generation and verification process was stopped by the user.",
          mode: targetMode,
          routingTrigger: trigger
        };

        const stoppedChat = {
          ...updatedChat,
          messages: [...updatedMessages, stoppedMessage]
        };

        if (!isTemporary) {
          const otherChats = chats.filter(c => c.id !== stoppedChat.id);
          saveChats([stoppedChat, ...otherChats]);
        } else {
          setChats(prev => [stoppedChat, ...prev.filter(c => c.id !== stoppedChat.id)]);
        }
        return;
      }

      // Fallback message locally if something went wrong
      const errorAssistantMessage: Message = {
        id: `msg-${Date.now()}-err`,
        role: "assistant",
        content: targetMode === "standard"
          ? "### ⚠️ System Warning\n\nI was unable to retrieve this response against the cloud-based Veriqon engine. Please verify that your **GEMINI_API_KEY** is configured in AI Studio secrets."
          : "### ⚠️ System Warning\n\nI was unable to verify this decision against the cloud-based Veriqon engine. Please verify that your **GEMINI_API_KEY** is configured in AI Studio secrets.",
        decision: targetMode === "standard" ? undefined : {
          score: targetMode === "deep_search" ? 80 : 0,
          scoreState: "insufficient_evidence",
          evidence: [
            {
              label: "Offline Engine",
              claim: "Verification server returned an unparseable state.",
              stance: "neutral"
            }
          ],
          angles: {
            logicalConsistency: "System consistency could not be verified automatically.",
            factualGrounding: "Verification requires an active, authenticated API connection.",
            riskEdgeCases: "Risk models cannot be calculated in offline fallback.",
            alternativeView: "Alternative perspective generation is currently offline."
          }
        },
        mode: targetMode,
        routingTrigger: trigger
      };

      const errorChat = {
        ...updatedChat,
        messages: [...updatedMessages, errorAssistantMessage]
      };

      if (!isTemporary) {
        const otherChats = chats.filter(c => c.id !== errorChat.id);
        saveChats([errorChat, ...otherChats]);
      } else {
        setChats(prev => [errorChat, ...prev.filter(c => c.id !== errorChat.id)]);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // File Upload parsing
  const triggerFileInput = (type: "file" | "image" | "video" | "audio") => {
    setShowAttachmentMenu(false);
    if (!fileInputRef.current) return;

    if (type === "image") {
      fileInputRef.current.accept = "image/*";
    } else if (type === "video") {
      fileInputRef.current.accept = "video/*";
    } else if (type === "audio") {
      fileInputRef.current.accept = "audio/*";
    } else {
      fileInputRef.current.accept = "*/*";
    }
    
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64Content = event.target?.result as string;
      let type: "file" | "image" | "video" | "audio" = "file";

      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";

      const newAttachment: Attachment = {
        type,
        name: file.name,
        size: file.size,
        content: base64Content,
        mimeType: file.type
      };

      setAttachments(prev => [...prev, newAttachment]);
    };

    reader.readAsDataURL(file);
    // Reset file input value so same file can be uploaded again
    e.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Format File Size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Categorize Chats
  const categorized = React.useMemo(() => {
    const filtered = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) && !c.temporary);
    const pinned = filtered.filter(c => c.pinned);
    const remaining = filtered.filter(c => !c.pinned);

    const categories: { [key: string]: Chat[] } = {
      Pinned: pinned,
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      Older: []
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const sevenDaysAgoStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgoStart = todayStart - 30 * 24 * 60 * 60 * 1000;

    remaining.forEach(chat => {
      const chatTime = new Date(chat.createdAt).getTime();
      if (chatTime >= todayStart) {
        categories["Today"].push(chat);
      } else if (chatTime >= yesterdayStart) {
        categories["Yesterday"].push(chat);
      } else if (chatTime >= sevenDaysAgoStart) {
        categories["Previous 7 Days"].push(chat);
      } else if (chatTime >= thirtyDaysAgoStart) {
        categories["Previous 30 Days"].push(chat);
      } else {
        categories["Older"].push(chat);
      }
    });

    return categories;
  }, [chats, search]);

  const hasAnySidebarItems = Object.values(categorized).some(arr => arr.length > 0);

  // If user is logged off, render the secure Login / Sign In / Sign Up interface
  if (!isLoggedIn) {
    const signupPassChecks = getPasswordStrength(signupPassword);
    
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg text-text selection:bg-primary/30 antialiased font-sans relative overflow-hidden">
        {/* BACKGROUND DECORATIVE GLOW */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0" />
        
        <div className="w-full max-w-lg p-6 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-surface border border-border rounded-2xl p-8 shadow-2xl relative"
          >
            {/* Top Logo / Brand */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
                <Shield className="w-6 h-6 stroke-[2px]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-text">Veriqon AI</h1>
              <p className="text-xs text-muted mt-1 uppercase tracking-wider font-semibold">Trust Every Decision</p>
            </div>

            {/* Tab Selector: Login vs Sign Up */}
            <div className="flex bg-card p-1 rounded-xl border border-border/60 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setLoginError("");
                  setSignupError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                  authMode === "login" ? "text-primary" : "text-muted hover:text-text"
                }`}
              >
                {authMode === "login" && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-surface border border-border/40 shadow-sm rounded-lg"
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setLoginError("");
                  setSignupError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                  authMode === "signup" ? "text-primary" : "text-muted hover:text-text"
                }`}
              >
                {authMode === "signup" && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-surface border border-border/40 shadow-sm rounded-lg"
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10">Sign Up / Register</span>
              </button>
            </div>

            {/* Error & Success Alerts */}
            {authMode === "login" && loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4 text-xs text-error flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </motion.div>
            )}

            {authMode === "signup" && signupError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4 text-xs text-error flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{signupError}</span>
              </motion.div>
            )}

            {signupSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-success/10 border border-success/20 rounded-xl p-3 mb-4 text-xs text-success flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Account created successfully! Switching to sign-in screen...</span>
              </motion.div>
            )}

            {/* AUTHENTICATION FORMS */}
            {authMode === "login" ? (
              /* SIGN IN FORM */
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="parthchaudhari974@gmail.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password / Passcode</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-muted hover:text-text flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="password123"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mt-1">
                  <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3.5 h-3.5 rounded border-border text-primary bg-card focus:ring-0 cursor-pointer"
                    />
                    <span>Remember session</span>
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline text-[11px] font-semibold">Forgot Passcode?</a>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 mt-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In Securely</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-muted hover:text-text flex items-center gap-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                        <span>{showPassword ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="Choose password"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Confirm</label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-[10px] text-muted hover:text-text flex items-center gap-0.5 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                        <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-muted" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div className="bg-card/45 border border-border/50 rounded-xl p-4 flex flex-col gap-2.5 mt-1 select-none">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block border-b border-border/30 pb-1.5">
                    Password Validation Standards:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {/* Length Check */}
                    <div className="flex items-center gap-2 text-[11px]">
                      {signupPassChecks.length ? (
                        <Check className="w-3.5 h-3.5 text-success stroke-[3px]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted/60 stroke-[3px]" />
                      )}
                      <span className={signupPassChecks.length ? "text-text font-medium" : "text-muted"}>
                        Length: 12 - 128 characters
                      </span>
                    </div>

                    {/* Uppercase Check */}
                    <div className="flex items-center gap-2 text-[11px]">
                      {signupPassChecks.uppercase ? (
                        <Check className="w-3.5 h-3.5 text-success stroke-[3px]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted/60 stroke-[3px]" />
                      )}
                      <span className={signupPassChecks.uppercase ? "text-text font-medium" : "text-muted"}>
                        1 uppercase letter (A–Z)
                      </span>
                    </div>

                    {/* Lowercase Check */}
                    <div className="flex items-center gap-2 text-[11px]">
                      {signupPassChecks.lowercase ? (
                        <Check className="w-3.5 h-3.5 text-success stroke-[3px]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted/60 stroke-[3px]" />
                      )}
                      <span className={signupPassChecks.lowercase ? "text-text font-medium" : "text-muted"}>
                        1 lowercase letter (a–z)
                      </span>
                    </div>

                    {/* Number Check */}
                    <div className="flex items-center gap-2 text-[11px]">
                      {signupPassChecks.number ? (
                        <Check className="w-3.5 h-3.5 text-success stroke-[3px]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted/60 stroke-[3px]" />
                      )}
                      <span className={signupPassChecks.number ? "text-text font-medium" : "text-muted"}>
                        1 number (0–9)
                      </span>
                    </div>

                    {/* Special Character Check */}
                    <div className="flex items-center gap-2 text-[11px] sm:col-span-2">
                      {signupPassChecks.special ? (
                        <Check className="w-3.5 h-3.5 text-success stroke-[3px]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted/60 stroke-[3px]" />
                      )}
                      <span className={signupPassChecks.special ? "text-text font-medium" : "text-muted"}>
                        1 special char (! @ # $ % ^ & * ( ) _ + - =)
                      </span>
                    </div>

                    {/* Spaces allowed & Recommendation Check */}
                    <div className="flex items-center gap-2 text-[11px] sm:col-span-2 border-t border-border/20 pt-2 mt-0.5 justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted">
                        <Check className="w-3 h-3 text-success" />
                        <span>Spaces are allowed</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {signupPassChecks.recommended ? (
                          <span className="text-amber bg-amber/10 px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase">
                            ★ Recommended (16+ chars)
                          </span>
                        ) : (
                          <span className="text-muted text-[9px]">
                            16+ characters recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 mt-1 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Secure Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SEPARATOR: OR CONTINUE WITH */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border/80" />
              <span className="px-3 text-[10px] font-bold text-muted uppercase tracking-wider">Or Sign In Instantly With</span>
              <div className="flex-1 border-t border-border/80" />
            </div>

            {/* THIRD-PARTY SOCIAL OAUTH TEMPLATES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => handleOAuthClick("google")}
                className="flex items-center justify-center py-2 px-3 bg-card hover:bg-card-hover border border-border/80 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold text-text cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={() => handleOAuthClick("github")}
                className="flex items-center justify-center py-2 px-3 bg-card hover:bg-card-hover border border-border/80 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold text-text cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>

              {/* Gmail OAuth Button */}
              <button
                type="button"
                onClick={() => handleOAuthClick("gmail")}
                className="flex items-center justify-center py-2 px-3 bg-card hover:bg-card-hover border border-border/80 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold text-text cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-error" />
                <span>Gmail</span>
              </button>
            </div>
          </motion.div>
          
          <p className="text-[10px] text-muted text-center mt-6 max-w-sm">
            Veriqon AI uses localized zero-knowledge session encryption. Your verification data and credentials stay on your device unless explicit cloud export is selected.
          </p>
        </div>

        {/* FULLY INTERACTIVE REAL-TIME SOCIAL OAUTH SECURITY MODAL */}
        <AnimatePresence>
          {oauthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              >
                {/* Header with provider logo */}
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    {oauthProvider === "google" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    )}
                    {oauthProvider === "github" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    )}
                    {oauthProvider === "gmail" && <Mail className="w-5 h-5 text-error" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text uppercase tracking-wider">
                      {oauthProvider === "google" ? "Google Accounts" : oauthProvider === "github" ? "GitHub Authentication" : "Gmail Secure OAuth"}
                    </span>
                    <span className="text-[10px] text-muted">Exchanging secure digital signature...</span>
                  </div>
                </div>

                <div className="flex flex-col items-center py-6 text-center">
                  {oauthLoading ? (
                    <>
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                      <span className="text-xs font-semibold text-text">Establishing hand-shake with identity provider...</span>
                      <p className="text-[10px] text-muted mt-1.5 max-w-xs">
                        Exchanging standard OAuth2 client authorization credentials and redirect tokens safely.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-success/15 border border-success/20 text-success rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                      <span className="text-xs font-bold text-success">Identity Successfully Verified!</span>
                      <p className="text-[10px] text-muted mt-1 max-w-xs">
                        Welcome back, <span className="font-semibold text-text">parthchaudhari974@gmail.com</span>. Starting your new decision analysis session...
                      </p>
                    </>
                  )}
                </div>

                {/* Simulated Handshake Security Steps */}
                <div className="bg-card/40 border border-border/60 rounded-xl p-3.5 flex flex-col gap-2 text-[10px] text-muted font-sans font-mono mt-2">
                  <div className="flex items-center justify-between">
                    <span>1. Handshake request</span>
                    <span className="text-success font-bold">DONE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Profile metadata synchronization</span>
                    {oauthLoading ? (
                      <span className="text-primary animate-pulse font-bold">CONNECTING...</span>
                    ) : (
                      <span className="text-success font-bold">SUCCESS</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Establishing local session tab</span>
                    {oauthLoading ? (
                      <span className="text-muted">WAITING</span>
                    ) : (
                      <span className="text-success font-bold">SECURED</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text selection:bg-primary/30 antialiased font-sans">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* SIDEBAR */}
      {!isReadOnlyView && (
        <>
          {/* MOBILE SIDEBAR DRAWERS */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
            )}
          </AnimatePresence>

          <div
            className={`fixed inset-y-0 left-0 w-[280px] bg-sidebar border-r border-border flex flex-col z-50 transform transition-transform duration-300 md:relative shrink-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${
              desktopSidebarOpen ? "md:translate-x-0 md:flex" : "md:-translate-x-full md:hidden"
            }`}
          >
            {/* Header / New Chat */}
            <div className="p-4 flex flex-col gap-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-bold tracking-tight text-md">Veriqon AI</h1>
                    <p className="text-[10px] text-muted font-medium tracking-wider uppercase -mt-1">Trust Every Decision</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-muted hover:text-text rounded hover:bg-card md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                New Verification Tab
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-2 border-b border-border bg-sidebar/50">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search verification tabs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-card border border-border rounded-lg text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 p-0.5 text-muted hover:text-text">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Multi-Select Toggle & Actions Row */}
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMultiSelectMode(!isMultiSelectMode);
                    setSelectedChatIds([]); // Clear selections when toggling
                  }}
                  className={`px-2 py-0.5 rounded border flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                    isMultiSelectMode
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-card hover:bg-card/80 border-border text-muted hover:text-text"
                  }`}
                >
                  <span>Select & Delete</span>
                </button>

                {isMultiSelectMode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllChats}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-border">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllChats}
                      className="text-muted hover:text-text font-semibold cursor-pointer"
                    >
                      None
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Action Panel */}
              {isMultiSelectMode && selectedChatIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error/10 border border-error/35 p-1.5 rounded-lg flex items-center justify-between text-xs mt-1"
                >
                  <span className="text-error font-semibold">
                    {selectedChatIds.length} Selected
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChatIds([]);
                        setIsMultiSelectMode(false);
                      }}
                      className="px-2 py-0.5 bg-card hover:bg-card/80 text-muted rounded text-[10px] font-semibold border border-border transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkDeleteChats}
                      className="px-2.5 py-0.5 bg-error hover:bg-error/90 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar Tabs Header */}
            <div className="px-4 py-2 border-b border-border bg-sidebar/30 flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
              <span>Active Verification Tabs</span>
              <span className="bg-card/50 px-1.5 py-0.5 rounded border border-border tracking-normal normal-case">
                {chats.length} open
              </span>
            </div>

            {/* Chat List Scroll Container */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar flex flex-col gap-4">
              {hasAnySidebarItems ? (
                Object.entries(categorized).map(([category, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold text-muted tracking-wider uppercase">
                        {category === "Pinned" ? <Pin className="w-3 h-3 text-secondary" /> : <Clock className="w-3 h-3" />}
                        {category}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {items.map((chat) => {
                          const isActive = chat.id === activeChatId;
                          const isEditing = editingChatId === chat.id;
                          const isDeleteConfirm = deleteConfirmId === chat.id;
                          const isSelected = selectedChatIds.includes(chat.id);

                          return (
                            <div
                              key={chat.id}
                              onClick={(e) => {
                                if (isMultiSelectMode) {
                                  handleToggleSelectChat(chat.id, e);
                                } else if (!isEditing && !isDeleteConfirm) {
                                  setActiveChatId(chat.id);
                                  setSidebarOpen(false);
                                }
                              }}
                              className={`group relative flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all text-xs border ${
                                isMultiSelectMode && isSelected
                                  ? "bg-accent/10 border-accent/40 text-accent font-semibold"
                                  : isActive
                                  ? "bg-card border-border text-text"
                                  : "border-transparent hover:bg-card/50 text-muted hover:text-text"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden w-full">
                                {isMultiSelectMode ? (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleToggleSelectChat(chat.id, e as any);
                                    }}
                                    className="w-3.5 h-3.5 rounded border-border text-accent bg-bg focus:ring-0 cursor-pointer shrink-0"
                                  />
                                ) : chat.pinned ? (
                                  <Pin className="w-3 h-3 text-secondary shrink-0" />
                                ) : (
                                  <FileCode className="w-3 h-3 text-primary shrink-0" />
                                )}
                                
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveRename(chat.id);
                                      if (e.key === "Escape") setEditingChatId(null);
                                    }}
                                    onBlur={() => handleSaveRename(chat.id)}
                                    autoFocus
                                    className="w-full bg-surface border border-primary px-1.5 py-0.5 rounded text-text focus:outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : isDeleteConfirm ? (
                                  <div className="flex items-center gap-2 text-error font-semibold">
                                    <span>Delete?</span>
                                    <button
                                      onClick={(e) => handleConfirmDelete(chat.id, e)}
                                      className="px-1.5 py-0.5 bg-error/20 hover:bg-error/30 rounded text-[10px]"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={handleCancelDelete}
                                      className="px-1.5 py-0.5 bg-muted/20 hover:bg-muted/30 text-text rounded text-[10px]"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <span className="truncate font-medium">{chat.title}</span>
                                )}
                              </div>

                              {/* Options Kebab (only show if not in multi-select mode, editing, or confirming delete) */}
                              {!isMultiSelectMode && !isEditing && !isDeleteConfirm && (
                                <div className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100 shrink-0 ml-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                                    }}
                                    className="p-1 hover:bg-surface border border-transparent hover:border-border rounded text-muted hover:text-text transition-all"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>

                                  {activeMenuId === chat.id && (
                                    <>
                                      <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                      <div className="absolute right-0 mt-1 w-32 bg-surface border border-border rounded-lg shadow-xl py-1 z-20 text-xs">
                                        <button
                                          onClick={(e) => handleTogglePin(chat.id, e)}
                                          className="w-full text-left px-3 py-1.5 hover:bg-card flex items-center gap-1.5"
                                        >
                                          {chat.pinned ? <PinOff className="w-3 h-3 text-secondary" /> : <Pin className="w-3 h-3 text-secondary" />}
                                          <span>{chat.pinned ? "Unpin" : "Pin"}</span>
                                        </button>
                                        <button
                                          onClick={(e) => handleStartRename(chat, e)}
                                          className="w-full text-left px-3 py-1.5 hover:bg-card flex items-center gap-1.5"
                                        >
                                          <Edit2 className="w-3 h-3 text-primary" />
                                          <span>Rename</span>
                                        </button>
                                        <button
                                          onClick={(e) => handleOpenShare(chat, e)}
                                          className="w-full text-left px-3 py-1.5 hover:bg-card flex items-center gap-1.5"
                                        >
                                          <Share2 className="w-3 h-3 text-accent" />
                                          <span>Share Analysis</span>
                                        </button>
                                        <div className="border-t border-border my-1" />
                                        <button
                                          onClick={(e) => handleTriggerDelete(chat.id, e)}
                                          className="w-full text-left px-3 py-1.5 hover:bg-card text-error flex items-center gap-1.5 hover:bg-error/10 font-medium"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Sidebar Placeholder Empty List Card (Never empty blank list) */
                <div className="flex flex-col items-center justify-center text-center p-4 bg-card/30 border border-dashed border-border rounded-xl mt-4">
                  <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center text-muted mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-semibold text-text">No Verification History</h3>
                  <p className="text-[10px] text-muted mt-1 leading-relaxed max-w-[200px]">
                    Your verified decision conversations will be preserved here securely.
                  </p>
                </div>
              )}
            </div>

            {/* User Session Profile & Log Off */}
            <div className="p-4 border-t border-border bg-card/20 flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between gap-2 bg-card/40 p-2 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary font-bold text-xs shrink-0 select-none">
                    P
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-text truncate">Parth Chaudhari</span>
                    <span className="text-[9px] text-muted truncate">parthchaudhari974@gmail.com</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogOff}
                  className="p-1.5 hover:bg-error/15 text-muted hover:text-error rounded-lg border border-transparent hover:border-error/20 transition-all cursor-pointer"
                  title="Log Off"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="text-[10px] text-muted flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  <span>Decision integrity online.</span>
                </div>
                <div className="text-[8px] text-muted/60">
                  Veriqon AI builds on structured verification metrics.
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN THREAD CONTAINER */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-surface ${
        activeChat?.temporary ? "border-2 border-dashed border-accent/40" : ""
      }`}>
        
        {/* HEADER BAR */}
        <header className="h-14 border-b border-border px-6 flex items-center justify-between shrink-0 bg-surface/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            {!isReadOnlyView && (
              <>
                {/* Mobile Sidebar Toggle Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 text-muted hover:text-text rounded-lg hover:bg-card md:hidden mr-1 cursor-pointer"
                  title="Toggle Mobile Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Desktop Sidebar Toggle Button (Sidebar for tabs) */}
                <button
                  onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                  className="hidden md:flex p-1.5 text-muted hover:text-text rounded-lg hover:bg-card mr-1 cursor-pointer"
                  title="Toggle Tabs Sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </>
            )}
            
            {!isReadOnlyView ? (
              <div className="relative flex items-center gap-3" ref={modeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card text-text text-xs font-semibold cursor-pointer select-none transition-all hover:border-muted active:scale-[0.98]"
                >
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                  <span className="font-bold tracking-wider uppercase text-[10px]">Veriqon</span>
                  <span className="text-[10px] text-muted font-medium bg-surface px-1.5 py-0.5 rounded border border-border">
                    {userSelectedMode === "auto" ? "Auto" : userSelectedMode === "standard" ? "Standard" : "Audit"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
                </button>

                {showModeDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1 text-[9px] font-bold text-muted uppercase tracking-wider">
                      Decision Operations Mode
                    </div>
                    <div className="border-b border-border my-1.5" />
                    
                    {/* AUTO ROUTER BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserSelectedMode("auto");
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-card/40 flex flex-col gap-0.5 transition-all cursor-pointer ${
                        userSelectedMode === "auto" ? "bg-primary/5 text-text border-l-2 border-primary" : "text-muted border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-accent" />
                        <span className="font-semibold text-text">Auto Router</span>
                        <span className="text-[8px] bg-accent/10 text-accent px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">Heuristic</span>
                      </div>
                      <span className="text-[10px] text-muted leading-relaxed">
                        Evaluates query complexity on the fly to route automatically between Standard AI and Decision Audit.
                      </span>
                    </button>

                    {/* STANDARD AI BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserSelectedMode("standard");
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-card/40 flex flex-col gap-0.5 transition-all cursor-pointer ${
                        userSelectedMode === "standard" ? "bg-primary/5 text-text border-l-2 border-primary" : "text-muted border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <SquareTerminal className="w-3.5 h-3.5 text-primary" />
                        <span className="font-semibold text-text">Standard AI Mode</span>
                      </div>
                      <span className="text-[10px] text-muted leading-relaxed">
                        Lightweight conversational flow. Bypasses decision matrixes, evidence scores, and analytical panels.
                      </span>
                    </button>

                    {/* DECISION AUDIT BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserSelectedMode("audit");
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-card/40 flex flex-col gap-0.5 transition-all cursor-pointer ${
                        userSelectedMode === "audit" ? "bg-primary/5 text-text border-l-2 border-primary" : "text-muted border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-secondary" />
                        <span className="font-semibold text-text">Decision Audit Mode</span>
                      </div>
                      <span className="text-[10px] text-muted leading-relaxed">
                        Full enterprise-grade verification. Forces tactical scores, logical audits, alternative perspective panels on all requests.
                      </span>
                    </button>
                  </div>
                )}

                <div className="hidden sm:flex items-center gap-2 border-l border-border pl-3">
                  <span className="text-xs font-semibold text-text truncate max-w-[200px]">
                    {activeChat ? activeChat.title : "New verification"}
                  </span>
                  {activeChat?.temporary && (
                    <span className="px-1.5 py-0.5 bg-accent/10 border border-accent/20 text-accent font-bold rounded text-[8px] uppercase tracking-wider">
                      Temp
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-bold tracking-tight text-xs text-text uppercase">Veriqon Shared Analysis</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Selector (Always visible) */}
            <div className="flex items-center gap-0.5 border border-border bg-card/30 rounded-lg p-0.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  theme === "light" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  theme === "dark" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-text"
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("auto")}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  theme === "auto" ? "bg-surface text-muted shadow-sm" : "text-muted hover:text-text"
                }`}
                title="Auto (System Theme)"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {!isReadOnlyView && (
              <button
                type="button"
                onClick={() => {
                  if (!workshopFile) {
                    setWorkshopFile({
                      type: "canvas",
                      name: "creative_drawing.png",
                      content: ""
                    });
                  }
                  setIsWorkshopOpen(!isWorkshopOpen);
                }}
                className={`p-2 border transition-all text-xs flex items-center gap-1.5 rounded-lg cursor-pointer ${
                  isWorkshopOpen
                    ? "bg-primary/15 border-primary text-primary font-bold shadow-sm"
                    : "bg-card/40 border-border text-muted hover:text-text hover:bg-card hover:border-muted"
                }`}
                title="Open the interactive Document & Media Workshop"
              >
                <Palette className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Media Workshop</span>
              </button>
            )}

            {isReadOnlyView ? (
              <a
                href={window.location.origin + window.location.pathname}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-primary text-bg font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try Veriqon AI
              </a>
            ) : (
              activeChat && activeChat.messages.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleClearCurrentThread}
                    className="p-2 text-muted hover:text-error border border-border hover:border-error/40 rounded-lg bg-card/40 hover:bg-error/10 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Clear all messages in this discussion"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-warning" />
                    <span className="hidden sm:inline">Clear Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleOpenShare(activeChat, e)}
                    className="p-2 text-muted hover:text-text border border-border hover:border-muted rounded-lg bg-card/40 hover:bg-card transition-all text-xs flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share Analysis</span>
                  </button>
                </>
              )
            )}
          </div>
        </header>

        {/* THREAD MESSAGE FLOW AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar flex flex-col gap-6">
          <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
            
            {activeChat && activeChat.messages.length > 0 ? (
              <div className="flex flex-col gap-6 flex-1">
                {activeChat.messages.map((message) => {
                  const isUser = message.role === "user";
                  const hasDecision = message.decision !== undefined;
                  const decision = message.decision;
                  
                  // Verification Tabs configuration
                  const activeTab = activeTabs[message.id] || "logicalConsistency";

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-2 max-w-full ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      {/* ROLE IDENTIFIER & ATTACHMENTS */}
                      <div className="flex items-center gap-2 px-1 text-[10px] font-semibold text-muted tracking-wider uppercase">
                        {isUser ? "Decision Maker" : "Verification Analyst"}
                      </div>

                      {/* USER CHIP AND TEXT CONTAINER */}
                      {isUser ? (
                        <div className="flex flex-col items-end gap-1.5 max-w-[85%] group">
                          {/* Attachments within message */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-end">
                              {message.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg text-xs"
                                >
                                  {att.type === "image" && <Image className="w-4 h-4 text-accent" />}
                                  {att.type === "video" && <Video className="w-4 h-4 text-secondary" />}
                                  {att.type === "audio" && <Music className="w-4 h-4 text-warning" />}
                                  {att.type === "file" && <FileText className="w-4 h-4 text-primary" />}
                                  <div className="flex flex-col max-w-[120px]">
                                    <span className="truncate text-[10px] font-medium">{att.name}</span>
                                    <span className="text-[8px] text-muted">{formatSize(att.size)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {editingPromptMessageId === message.id ? (
                            <div className="w-full min-w-[280px] sm:min-w-[420px] bg-card border border-primary/50 rounded-2xl p-3.5 flex flex-col gap-3 shadow-xl">
                              <textarea
                                value={editingPromptText}
                                onChange={(e) => setEditingPromptText(e.target.value)}
                                className="w-full bg-surface text-text border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[90px] resize-y custom-scrollbar"
                                placeholder="Edit your prompt..."
                                autoFocus
                              />
                              <div className="flex items-center justify-end gap-2 text-xs">
                                <button
                                  onClick={() => {
                                    setEditingPromptMessageId(null);
                                    setEditingPromptText("");
                                  }}
                                  className="px-3 py-1.5 text-muted hover:text-text bg-surface hover:bg-surface/80 border border-border rounded-lg transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEditedPrompt(message.id, editingPromptText)}
                                  disabled={!editingPromptText.trim() || isGenerating}
                                  className="px-3.5 py-1.5 text-bg font-bold bg-primary hover:bg-primary/95 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Save & Submit</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="bg-primary/10 border border-primary/25 rounded-2xl rounded-tr-none px-4 py-2.5 text-text leading-relaxed text-sm relative">
                                {message.content}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-0.5 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {/* Edit Prompt inline button */}
                                <button
                                  onClick={() => {
                                    setEditingPromptMessageId(message.id);
                                    setEditingPromptText(message.content);
                                  }}
                                  className="text-[10px] text-muted hover:text-text flex items-center gap-1 bg-surface/30 px-1.5 py-0.5 rounded border border-border/30 hover:border-border cursor-pointer transition-colors"
                                  title="Edit prompt inline"
                                >
                                  <Edit2 className="w-2.5 h-2.5 text-primary" />
                                  <span>Edit Prompt</span>
                                </button>

                                {/* Copy button */}
                                <button
                                  onClick={(e) => handleCopyMessageText(message.id, message.content, e)}
                                  className="text-[10px] text-muted hover:text-text flex items-center gap-1 bg-surface/30 px-1.5 py-0.5 rounded border border-border/30 hover:border-border cursor-pointer transition-colors"
                                  title="Copy message content"
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className="w-2.5 h-2.5 text-success" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5 text-accent" />
                                  )}
                                  <span>{copiedMessageId === message.id ? "Copied" : "Copy"}</span>
                                </button>

                                {/* Delete button */}
                                <button
                                  onClick={(e) => handleDeleteMessage(message.id, e)}
                                  className="text-[10px] text-muted hover:text-error flex items-center gap-1 bg-surface/30 px-1.5 py-0.5 rounded border border-border/30 hover:border-error/40 cursor-pointer transition-colors"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-error" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        
                        /* ASSISTANT CARD CONTAINING CORE DECISION INTEGRITY BLOCK */
                        <div className="w-full bg-card/30 border border-border rounded-2xl p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden pt-10 sm:pt-11">
                          
                          {/* GLOW DECORATOR FOR SYSTEM INTEGRITY */}
                          <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${
                            message.mode === "standard" 
                              ? "bg-primary" 
                              : message.mode === "deep_search" 
                              ? "bg-accent" 
                              : "bg-secondary"
                          }`} />

                          {/* DYNAMIC ROUTING MODE STATUS INDICATOR */}
                          <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[9px] text-muted font-mono bg-surface/60 border border-border px-2 py-0.5 rounded-full select-none">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              message.mode === "standard" 
                                ? "bg-primary" 
                                : message.mode === "deep_search" 
                                ? "bg-accent animate-pulse" 
                                : "bg-secondary"
                            }`} />
                            <span>
                              {message.routingTrigger === "manual" ? "Override" : "Auto"}
                            </span>
                            <span className="text-border">|</span>
                            <span className="text-text font-semibold uppercase text-[8px] tracking-wider">
                              {message.mode === "standard" ? "Standard AI" : message.mode === "deep_search" ? "Deep Search" : "Decision Audit"}
                            </span>
                          </div>

                          {/* CORE DECISION VERIFICATION BLOCK - MUST SIT ABOVE AI RESPONSE TEXT */}
                          {hasDecision && decision && message.mode !== "standard" && (!isReadOnlyView || !excludeScoreOnSharedView) && (
                            <div className="bg-surface border border-border rounded-xl p-5 shadow-xl flex flex-col gap-5 mb-4">
                              
                              {/* 1. DECISION STATUS DASHBOARD */}
                              <div className="border-b border-border/50 pb-4">
                                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5 text-secondary" />
                                  Decision Dashboard Matrix
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  
                                  {/* Score Card */}
                                  <div className="bg-card/40 border border-border/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Decision Score</span>
                                    <div className="text-2xl font-black text-text tracking-tight">
                                      {decision.scoreState === "scored" ? `${decision.score}` : "N/A"}
                                      <span className="text-xs text-muted font-normal ml-0.5">/100</span>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded-full border ${
                                      decision.scoreState !== "scored"
                                        ? "bg-accent/10 border-accent/20 text-accent"
                                        : decision.score >= 80
                                        ? "bg-success/10 border-success/20 text-success"
                                        : decision.score >= 50
                                        ? "bg-warning/10 border-warning/20 text-warning"
                                        : "bg-error/10 border-error/20 text-error"
                                    }`}>
                                      {decision.scoreState !== "scored" ? "Needs Evidence" : decision.score >= 80 ? "High Trust" : decision.score >= 50 ? "Moderate" : "Low Trust"}
                                    </span>
                                  </div>

                                  {/* Confidence Ring Display */}
                                  <div className="bg-card/40 border border-border/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Confidence</span>
                                    
                                    {/* Circular Progress Ring */}
                                    <div className="relative w-10 h-10 flex items-center justify-center">
                                      <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="20" cy="20" r="16" className="stroke-border/35 stroke-[3px] fill-transparent" />
                                        <circle
                                          cx="20"
                                          cy="20"
                                          r="16"
                                          strokeDasharray={`${2 * Math.PI * 16}`}
                                          strokeDashoffset={`${2 * Math.PI * 16 * (1 - (decision.scoreState === "scored" ? decision.score : 40) / 100)}`}
                                          className={`stroke-[3px] fill-transparent stroke-linecap-round ${
                                            decision.scoreState !== "scored"
                                              ? "stroke-muted"
                                              : decision.score >= 95
                                              ? "stroke-[#22C55E]"
                                              : decision.score >= 80
                                              ? "stroke-[#5B8CFF]"
                                              : decision.score >= 60
                                              ? "stroke-[#F59E0B]"
                                              : "stroke-[#EF4444]"
                                          }`}
                                        />
                                      </svg>
                                      <span className="absolute text-[10px] font-bold text-text">
                                        {decision.scoreState === "scored" ? `${decision.score}%` : "40%"}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-semibold text-muted mt-1">
                                      {decision.scoreState !== "scored" ? "Insufficient" : decision.score >= 95 ? "Very High" : decision.score >= 80 ? "High" : decision.score >= 60 ? "Moderate" : "Low"}
                                    </span>
                                  </div>

                                  {/* Risk Assessment */}
                                  <div className="bg-card/40 border border-border/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Risk Level</span>
                                    <div className="text-xs font-black flex items-center gap-1.5 py-2">
                                      {decision.scoreState !== "scored" ? (
                                        <>
                                          <span className="text-warning">🟡</span>
                                          <span className="text-text tracking-wider">MEDIUM</span>
                                        </>
                                      ) : decision.score >= 80 ? (
                                        <>
                                          <span className="text-success">🟢</span>
                                          <span className="text-success tracking-wider">LOW</span>
                                        </>
                                      ) : decision.score >= 50 ? (
                                        <>
                                          <span className="text-warning">🟡</span>
                                          <span className="text-warning tracking-wider">MEDIUM</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-error">🔴</span>
                                          <span className="text-error tracking-wider">HIGH</span>
                                        </>
                                      )}
                                    </div>
                                    <span className="text-[8px] text-muted font-semibold mt-1">Based on metrics</span>
                                  </div>

                                  {/* Evidence Overview */}
                                  <div className="bg-card/40 border border-border/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Evidence Points</span>
                                    <div className="text-base font-black text-text py-1">
                                      {decision.evidence ? decision.evidence.length : 0}
                                    </div>
                                    <span className="text-[8px] text-muted font-bold">
                                      {decision.evidence ? (
                                        `${decision.evidence.filter(e => e.stance === 'support').length} support | ${decision.evidence.filter(e => e.stance === 'contradict').length} contradict`
                                      ) : "No external data"}
                                    </span>
                                  </div>

                                </div>
                              </div>

                              {/* 2. EVIDENCE MATRIX LIST */}
                              <div>
                                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-secondary" />
                                  Factual Claims & Supporting Evidence
                                </div>
                                <div className="flex flex-col gap-2">
                                  {decision.evidence && decision.evidence.length > 0 ? (
                                    decision.evidence.map((ev, index) => {
                                      const isExpanded = expandedEvidence[message.id] === index;
                                      return (
                                        <div
                                          key={index}
                                          onClick={() => setExpandedEvidence(prev => ({
                                            ...prev,
                                            [message.id]: isExpanded ? null : index
                                          }))}
                                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                            isExpanded
                                              ? "bg-card border-secondary/40 shadow-sm"
                                              : "bg-card/40 border-border/50 hover:border-muted/50"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="px-1.5 py-0.5 bg-surface border border-border/60 text-[8px] font-bold text-muted uppercase tracking-wider rounded truncate max-w-[120px]">
                                                {ev.label}
                                              </span>
                                              <span className="text-xs font-semibold text-text truncate max-w-[200px] sm:max-w-md">
                                                {ev.claim}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                                                ev.stance === "support"
                                                  ? "bg-success/10 border-success/30 text-success"
                                                  : ev.stance === "contradict"
                                                  ? "bg-error/10 border-error/30 text-error"
                                                  : "bg-muted/10 border-muted/30 text-muted"
                                              }`}>
                                                {ev.stance}
                                              </span>
                                              <ChevronRight className={`w-3.5 h-3.5 text-muted/60 transition-transform ${isExpanded ? "rotate-90 text-secondary" : ""}`} />
                                            </div>
                                          </div>
                                          
                                          {isExpanded && (
                                            <motion.p
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              className="text-xs text-muted mt-2 pt-2 border-t border-border/30 leading-relaxed"
                                            >
                                              <strong>Verification detail:</strong> This source supports the decision context by validating the underlying assumptions or physical/logical rules of the proposed case.
                                            </motion.p>
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="p-3 bg-card/20 border border-dashed border-border rounded-xl text-xs text-muted text-center">
                                      Model reasoning only — no external evidence used.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 3. MULTI-ANGLE DETAILED VIEWS (Grounded 2x2 grid for scanning) */}
                              <div>
                                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                                  Multi-Angle Verification Audit
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                  
                                  {/* Logical Consistency */}
                                  <div className="bg-card/40 border border-border/50 p-4 rounded-xl flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                      Logical Logic
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">
                                      {decision.angles.logicalConsistency || "Verification details unavailable for this lens."}
                                    </p>
                                  </div>

                                  {/* Factual Grounding */}
                                  <div className="bg-card/40 border border-border/50 p-4 rounded-xl flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      Factual Grounding
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">
                                      {decision.angles.factualGrounding || "Verification details unavailable for this lens."}
                                    </p>
                                  </div>

                                  {/* Risk & Edges */}
                                  <div className="bg-card/40 border border-border/50 p-4 rounded-xl flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                                      Risk & Edges
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">
                                      {decision.angles.riskEdgeCases || "Verification details unavailable for this lens."}
                                    </p>
                                  </div>

                                  {/* Alternative View */}
                                  <div className="bg-card/40 border border-border/50 p-4 rounded-xl flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                      Alternative View
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">
                                      {decision.angles.alternativeView || "Verification details unavailable for this lens."}
                                    </p>
                                  </div>

                                </div>
                              </div>

                            </div>
                          )}

                          {/* SYSTEM ANALYST CORE RESPONSE CONTENT - SITS BELOW THE VERIFICATION PANEL */}
                          
                          {/* Smart Prompt Optimizer Auto-Alert Card */}
                          {message.optimizedPrompt && (
                            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4 text-xs flex flex-col gap-2.5 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-full -mr-8 -mt-8" />
                              <div className="flex items-center gap-1.5 text-accent font-bold text-[10px] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                                <span>Smart Prompt Optimizer Active</span>
                              </div>
                              <p className="text-muted leading-relaxed text-[11.5px]">
                                Veriqon detected that your query was brief or vague. To ensure maximum accuracy and analytical depth, our **Adaptive AI** automatically optimized it for the verification engine:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 font-sans">
                                <div className="bg-surface/50 border border-border/40 rounded-lg p-2.5 flex flex-col gap-1">
                                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Original Prompt</span>
                                  <span className="text-text italic font-medium">"{message.optimizedPrompt.original}"</span>
                                </div>
                                <div className="bg-surface border border-accent/15 rounded-lg p-2.5 flex flex-col gap-1">
                                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Optimized Scenario</span>
                                  <span className="text-text font-medium">"{message.optimizedPrompt.optimized}"</span>
                                </div>
                              </div>
                              <div className="text-[10px] text-muted italic flex items-center gap-1.5 mt-1 bg-surface/35 px-2.5 py-1.5 rounded-md border border-border/20">
                                <Info className="w-3.5 h-3.5 text-accent shrink-0" />
                                <span><strong>Reasoning Added:</strong> {message.optimizedPrompt.reason}</span>
                              </div>
                            </div>
                          )}

                          {/* Self-Correction Refinement Loop Tabs */}
                          {message.refinement && (() => {
                            const activeTab = selectedRefinementTab[message.id] || 'final';
                            return (
                              <div className="bg-card/45 border border-border/80 rounded-xl p-3 sm:p-4 mb-4 flex flex-col gap-3">
                                
                                {/* Tab Stepper Bar */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-3 gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-warning/15 border border-warning/25 rounded-md flex items-center justify-center text-warning">
                                      <Zap className="w-3 h-3 text-warning animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-text uppercase tracking-wider">Adaptive Self-Correction Flow</span>
                                      <span className="text-[9px] text-muted -mt-0.5">Dual-pass reflection audit</span>
                                    </div>
                                  </div>

                                  {/* Steps Button Container */}
                                  <div className="flex items-center flex-wrap gap-1 bg-surface border border-border/40 rounded-lg p-0.5 text-[10px]">
                                    
                                    <button
                                      type="button"
                                      onClick={() => setSelectedRefinementTab(prev => ({ ...prev, [message.id]: 'initial' }))}
                                      className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                                        activeTab === 'initial'
                                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                          : "text-muted hover:text-text border border-transparent"
                                      }`}
                                    >
                                      1. AI Writes
                                    </button>

                                    <div className="text-muted/40 text-[8px] select-none">→</div>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedRefinementTab(prev => ({ ...prev, [message.id]: 'critic' }))}
                                      className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                                        activeTab === 'critic'
                                          ? "bg-error/10 text-error border border-error/20 shadow-sm"
                                          : "text-muted hover:text-text border border-transparent"
                                      }`}
                                    >
                                      2. Critic Reviews
                                    </button>

                                    <div className="text-muted/40 text-[8px] select-none">→</div>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedRefinementTab(prev => ({ ...prev, [message.id]: 'improve' }))}
                                      className={`px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer ${
                                        activeTab === 'improve'
                                          ? "bg-accent/10 text-accent border border-accent/20 shadow-sm"
                                          : "text-muted hover:text-text border border-transparent"
                                      }`}
                                    >
                                      3. AI Improves
                                    </button>

                                    <div className="text-muted/40 text-[8px] select-none">→</div>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedRefinementTab(prev => ({ ...prev, [message.id]: 'final' }))}
                                      className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                                        activeTab === 'final'
                                          ? "bg-success/15 text-success border border-success/20 shadow-sm"
                                          : "text-muted hover:text-text border border-transparent"
                                      }`}
                                    >
                                      4. Final Answer
                                    </button>

                                  </div>
                                </div>

                                {/* Expended Tab Body content */}
                                <div className="text-xs text-text leading-relaxed font-sans">
                                  {activeTab === 'initial' && (
                                    <div className="bg-surface border border-border/40 rounded-lg p-3 flex flex-col gap-2">
                                      <div className="text-[9px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                                        <span>✍️ First-pass Draft (Raw generation)</span>
                                      </div>
                                      <div className="markdown-body text-xs italic opacity-85 text-muted leading-relaxed">
                                        <Markdown>{message.refinement.initialDraft}</Markdown>
                                      </div>
                                    </div>
                                  )}

                                  {activeTab === 'critic' && (
                                    <div className="bg-error/5 border border-error/20 rounded-lg p-3 flex flex-col gap-2">
                                      <div className="text-[9px] font-bold text-error uppercase tracking-wider flex items-center gap-1.5">
                                        <ShieldAlert className="w-3.5 h-3.5 text-error" />
                                        <span>🔍 Veriqon Skeptical Critic Audit</span>
                                      </div>
                                      <div className="text-muted italic bg-surface/40 p-2.5 border border-border/20 rounded text-[11px] leading-relaxed markdown-body">
                                        <Markdown>{message.refinement.criticFeedback}</Markdown>
                                      </div>
                                    </div>
                                  )}

                                  {activeTab === 'improve' && (
                                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 flex flex-col gap-2">
                                      <div className="text-[9px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                                        <span>⚡ Self-Correction Plan (AI Improves)</span>
                                      </div>
                                      <div className="text-muted font-medium bg-surface/40 p-2.5 border border-border/20 rounded text-[11px] leading-relaxed markdown-body">
                                        <Markdown>{message.refinement.improvementReasoning}</Markdown>
                                      </div>
                                    </div>
                                  )}

                                  {activeTab === 'final' && (
                                    <div className="flex items-center gap-2 bg-success/5 border border-success/10 rounded-lg px-3 py-2 text-[11px] font-medium text-success">
                                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                                      <span>Showing the fully audited, double-pass refined final output below.</span>
                                    </div>
                                  )}
                                </div>

                              </div>
                            );
                          })()}

                          <div className="markdown-body text-sm leading-relaxed text-text">
                            <Markdown>{message.content}</Markdown>
                          </div>

                          {/* ASSISTANT MESSAGE ACTIONS ROW */}
                          <div className="flex items-center flex-wrap gap-2 mt-2 pt-3 border-t border-border/40 text-[11px] text-muted select-none">
                            {/* Copy Button */}
                            <button
                              onClick={(e) => handleCopyMessageText(message.id, message.content, e)}
                              className="flex items-center gap-1 hover:text-text transition-colors px-2.5 py-1 bg-surface/40 hover:bg-surface/80 border border-border/40 hover:border-border rounded-lg"
                              title="Copy response to clipboard"
                            >
                              {copiedMessageId === message.id ? (
                                <>
                                  <Check className="w-3 h-3 text-success" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-accent" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {/* Voice Aloud Button */}
                            <button
                              onClick={(e) => handleToggleSpeak(message.id, message.content, e)}
                              className={`flex items-center gap-1 transition-colors px-2.5 py-1 border rounded-lg ${
                                speakingMessageId === message.id
                                  ? "bg-primary/20 border-primary text-primary animate-pulse font-medium"
                                  : "bg-surface/40 hover:bg-surface/80 border-border/40 hover:border-border hover:text-text"
                              }`}
                              title={speakingMessageId === message.id ? "Stop voice aloud readout" : "Read aloud response"}
                            >
                              {speakingMessageId === message.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>Stop Voice</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                                  <span>Voice Aloud</span>
                                </>
                              )}
                            </button>

                            {/* Regenerate Button */}
                            {!isReadOnlyView && (
                              <button
                                onClick={(e) => handleRegenerate(message.id, e)}
                                disabled={isGenerating}
                                className="flex items-center gap-1 hover:text-text transition-colors px-2.5 py-1 bg-surface/40 hover:bg-surface/80 border border-border/40 hover:border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Regenerate verified analysis"
                              >
                                <RotateCw className={`w-3.5 h-3.5 text-warning ${isGenerating ? "animate-spin" : ""}`} />
                                <span>Regenerate</span>
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={(e) => handleDeleteMessage(message.id, e)}
                              className="flex items-center gap-1 hover:text-error transition-colors px-2.5 py-1 bg-surface/40 hover:bg-surface/80 border border-border/40 hover:border-error/40 rounded-lg cursor-pointer"
                              title="Delete this message from history"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-error" />
                              <span>Delete</span>
                            </button>

                            {/* Open in Workshop Button */}
                            {(() => {
                              const detected = getDetectedWorkshopFile(message.content);
                              if (!detected) return null;
                              
                              const iconEmoji = detected.type === "svg" ? "🎨" : detected.type === "csv" ? "📊" : "📝";
                              const typeLabel = detected.type === "svg" ? "Vector SVG" : detected.type === "csv" ? "Data Sheet" : "Document";

                              return (
                                <button
                                  onClick={() => {
                                    setWorkshopFile(detected);
                                    setIsWorkshopOpen(true);
                                  }}
                                  className="flex items-center gap-1.5 hover:text-primary transition-colors px-2.5 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-primary font-bold rounded-lg cursor-pointer animate-pulse"
                                  title={`Open this ${typeLabel} inside the interactive Veriqon Workshop`}
                                >
                                  <span>{iconEmoji} Open in Workshop</span>
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ACTIVE VERIFICATION LOADING SKELETON */}
                {isGenerating && (
                  <div className="w-full bg-card/30 border border-border rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-accent animate-pulse" />
                    
                    {/* PULSING ACCENT RADIAL SKELETON WITH CYCLING CROSS-CHECKING METRICS */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-4 w-full">
                      <div className="flex items-center gap-4">
                        {/* Pulse Ring */}
                        <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-accent animate-spin flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                        </div>

                        {/* Cycling Status Text */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-accent font-bold tracking-wider uppercase animate-pulse">Veriqon Engine Active</span>
                          <div className="text-xs font-semibold text-muted transition-all duration-300">
                            {loadingText}
                          </div>
                        </div>
                      </div>

                      {/* STOP BUTTON */}
                      <button
                        onClick={handleStopGeneration}
                        className="px-3 py-1.5 bg-error hover:bg-error/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] border border-error/15 shrink-0"
                        title="Stop current prompt analysis"
                      >
                        <Square className="w-3.5 h-3.5" fill="currentColor" />
                        <span className="hidden sm:inline">Stop Prompt</span>
                      </button>
                    </div>

                    {/* Placeholder Content lines */}
                    <div className="flex flex-col gap-2.5 py-2 animate-pulse">
                      <div className="h-4 bg-muted/10 rounded w-[80%]" />
                      <div className="h-4 bg-muted/10 rounded w-[95%]" />
                      <div className="h-4 bg-muted/10 rounded w-[60%]" />
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            ) : (
              
              /* WELCOME / PLACEHOLDER HERO (No Chat History welcome card) */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md bg-card/40 border border-border p-6 rounded-2xl shadow-xl flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-4 shadow-inner">
                    <Shield className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-xl font-bold tracking-tight text-text">Veriqon AI Verification</h2>
                  <p className="text-muted text-xs font-medium tracking-wider uppercase -mt-0.5">"Trust Every Decision."</p>

                  <p className="text-xs text-muted/80 mt-3 leading-relaxed">
                    Veriqon is a specialized decision checking platform. Unlike conversational bots, we cross-reference facts, verify logical claims, analyze risks, and provide actionable confidence scores above every answer.
                  </p>

                  <div className="w-full border-t border-border/60 my-4" />

                  <div className="flex flex-col gap-2.5 w-full text-left">
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Verification Lenses</span>
                    
                    <div className="flex gap-2 items-center bg-surface/50 p-2.5 rounded-xl border border-border">
                      <Zap className="w-4 h-4 text-accent" />
                      <div>
                        <h4 className="text-[11.5px] font-bold text-text">Confidence Dialing</h4>
                        <p className="text-[9.5px] text-muted">A clear radial ring score of logical certainty and backing.</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center bg-surface/50 p-2.5 rounded-xl border border-border">
                      <ShieldAlert className="w-4 h-4 text-warning" />
                      <div>
                        <h4 className="text-[11.5px] font-bold text-text">Risk & Alternate Angles</h4>
                        <p className="text-[9.5px] text-muted">Exposes blind spots, liabilities, and devil's advocate choices.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT PROMPT BAR FOOTER */}
        {!isReadOnlyView && (
          <footer className="p-4 bg-surface shrink-0 z-20">
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 relative">
              
              {/* Attachment chips container */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-card/85 border border-border rounded-xl mb-1 backdrop-blur">
                  {attachments.map((att, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs"
                    >
                      {att.type === "image" && <Image className="w-3.5 h-3.5 text-accent" />}
                      {att.type === "video" && <Video className="w-3.5 h-3.5 text-secondary" />}
                      {att.type === "audio" && <Music className="w-3.5 h-3.5 text-warning" />}
                      {att.type === "file" && <FileText className="w-3.5 h-3.5 text-primary" />}
                      <div className="flex flex-col max-w-[100px]">
                        <span className="truncate text-[10px] font-medium">{att.name}</span>
                        <span className="text-[8px] text-muted">{formatSize(att.size)}</span>
                      </div>

                      {/* Load to Workshop Button */}
                      {(att.type === "image" || att.type === "file") && (
                        <button
                          type="button"
                          onClick={() => {
                            let wType: "document" | "csv" | "svg" | "canvas" = "document";
                            if (att.type === "image") {
                              wType = "canvas";
                            } else if (att.name.endsWith(".csv")) {
                              wType = "csv";
                            } else if (att.name.endsWith(".svg")) {
                              wType = "svg";
                            }
                            
                            let content = "";
                            if (att.content) {
                              if (att.content.includes(",")) {
                                const base64Parts = att.content.split(",");
                                if (att.type === "image" || wType === "canvas") {
                                  content = att.content;
                                } else {
                                  try {
                                    content = atob(base64Parts[1]);
                                  } catch (e) {
                                    content = att.content;
                                  }
                                }
                              } else {
                                content = att.content;
                              }
                            }
                            
                            setWorkshopFile({
                              type: wType,
                              name: att.name,
                              content
                            });
                            setIsWorkshopOpen(true);
                          }}
                          className="p-1 text-primary hover:text-primary-hover hover:bg-primary/10 rounded text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-0.5"
                          title="Open this ingested file directly in the interactive Workshop to update or edit it"
                        >
                          <Palette className="w-3 h-3" />
                          <span>Load</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-0.5 text-muted hover:text-text hover:bg-card rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 2-Variations Smart Prompt Optimizer Feature */}
              {inputText.trim() && inputText.toLowerCase() !== "clear" && (
                <div className="bg-card border border-border/80 rounded-xl p-3 sm:p-4 mb-2 flex flex-col gap-3 relative shadow-md overflow-hidden animate-fade-in">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                  
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text uppercase tracking-wider">Smart Prompt Optimizer</span>
                        <span className="text-[9px] text-muted -mt-0.5">Optimize into 2 distinct intent-based perspectives</span>
                      </div>
                    </div>
                    {promptVariations && (
                      <button
                        type="button"
                        onClick={() => {
                          setPromptVariations(null);
                          setSelectedVariationIndex(null);
                        }}
                        className="text-muted hover:text-text p-1 hover:bg-surface rounded transition-all text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        title="Dismiss Variations"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Dismiss</span>
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  {noOptimizationStatus ? (
                    <div className="bg-amber-500/5 border border-amber-500/20 text-amber-500 rounded-lg p-3 text-center flex flex-col items-center justify-center gap-1 animate-fade-in">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/90 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        NO_OPTIMIZATION
                      </span>
                      <p className="text-[10.5px] text-muted leading-relaxed max-w-md">
                        Optimization is bypassed for greetings, small talk, acknowledgements, or simple non-task expressions.
                      </p>
                    </div>
                  ) : !promptVariations ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50 border border-border/40 rounded-lg p-2.5">
                      <div className="text-[10.5px] text-muted leading-snug max-w-md">
                        Transform your draft query into structured, highly analytical decision-making scenarios according to its vibe.
                      </div>
                      <button
                        type="button"
                        disabled={isGeneratingVariations}
                        onClick={handleGenerateVariations}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                      >
                        {isGeneratingVariations ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            <span>Generate 2 Variations</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {/* Grid of 2 Variations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {promptVariations.map((v, idx) => {
                          const isSelected = selectedVariationIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedVariationIndex(idx);
                                setInputText(v.optimized);
                              }}
                              className={`text-left p-3 rounded-lg border transition-all duration-200 flex flex-col gap-1.5 relative overflow-hidden group cursor-pointer ${
                                isSelected
                                  ? "bg-primary/5 border-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.1)]"
                                  : "bg-surface/50 border-border/60 hover:border-border hover:bg-surface"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className={`text-[11px] font-bold ${isSelected ? "text-primary" : "text-text"}`}>
                                  {v.title}
                                </span>
                                {isSelected && (
                                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                    Active
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted leading-snug italic">
                                {v.vibe}
                              </span>
                              
                              {/* Hover clue */}
                              {!isSelected && (
                                <span className="text-[8px] text-primary/0 group-hover:text-primary/80 transition-all font-bold uppercase mt-1 self-end">
                                  Click to Apply →
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Improved Prompt Show Area */}
                      {selectedVariationIndex !== null && (
                        <div className="bg-surface/80 border border-primary/25 rounded-lg p-3 flex flex-col gap-1.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Improved Prompt Preview</span>
                            </span>
                            <span className="text-[9px] text-muted italic">Loaded in prompt bar</span>
                          </div>
                          <div className="text-[11px] text-text font-mono bg-card p-2 border border-border/40 rounded leading-relaxed max-h-24 overflow-y-auto select-all">
                            {promptVariations[selectedVariationIndex].optimized}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Form Input Container */}
              <form
                onSubmit={handleSendMessage}
                className="bg-surface border border-border rounded-xl p-2 flex items-center gap-2 relative shadow-lg focus-within:border-primary/50 transition-all"
              >
                {/* Hidden input for attachment */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Attachment Menu Plus Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="p-2 text-muted hover:text-text rounded-lg hover:bg-card/80 flex items-center justify-center transition-colors border border-transparent hover:border-border cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Upload Menu dropdown */}
                  {showAttachmentMenu && (
                    <div
                      ref={attachmentMenuRef}
                      className="absolute bottom-11 left-0 w-44 bg-card border border-border rounded-xl shadow-2xl py-1 z-30 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => triggerFileInput("file")}
                        className="w-full text-left px-3 py-2 hover:bg-surface flex items-center gap-2 text-muted hover:text-text transition-colors"
                      >
                        <FileUp className="w-3.5 h-3.5 text-primary" />
                        <span>Upload from device</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerFileInput("image")}
                        className="w-full text-left px-3 py-2 hover:bg-surface flex items-center gap-2 text-muted hover:text-text transition-colors"
                      >
                        <Image className="w-3.5 h-3.5 text-accent" />
                        <span>Photos / Screenshots</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerFileInput("video")}
                        className="w-full text-left px-3 py-2 hover:bg-surface flex items-center gap-2 text-muted hover:text-text transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-secondary" />
                        <span>Videos</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerFileInput("audio")}
                        className="w-full text-left px-3 py-2 hover:bg-surface flex items-center gap-2 text-muted hover:text-text transition-colors"
                      >
                        <Music className="w-3.5 h-3.5 text-warning" />
                        <span>Audio recording</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* TEXT INPUT PROMPT */}
                <input
                  ref={promptInputRef}
                  type="text"
                  placeholder="Ask Anything......"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setNoOptimizationStatus(false);
                  }}
                  disabled={isGenerating}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-text placeholder-muted focus:ring-0 py-2 px-1 disabled:opacity-50"
                />

                {/* TEMPORARY CHAT TOGGLE (Dashed style, accent badge) */}
                <div className="flex items-center gap-2">
                  {canRegenerateLast && (
                    <button
                      type="button"
                      onClick={(e) => handleRegenerate(lastMessage.id, e)}
                      disabled={isGenerating}
                      className="p-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer bg-warning/10 hover:bg-warning/25 border-warning/40 hover:border-warning text-warning disabled:opacity-40"
                      title="Regenerate last verified analysis"
                    >
                      <RotateCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Regenerate</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsTemporary(!isTemporary);
                      if (!isTemporary) {
                        // Purge/clean up session history if entering temp mode
                        setChats(prev => prev.filter(c => !c.temporary));
                      }
                    }}
                    className={`p-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isTemporary
                        ? "bg-accent/15 border-accent text-accent"
                        : "bg-card/30 border-border text-muted hover:text-text"
                    }`}
                    title="Temporary chats purge at the end of the session"
                  >
                    <Zap className="w-3 h-3" />
                    <span className="hidden sm:inline">Temporary</span>
                  </button>

                  {/* SEND / STOP BUTTON */}
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="p-2 bg-error hover:bg-error/90 text-white font-bold rounded-lg transition-all flex items-center justify-center shrink-0 shadow cursor-pointer animate-pulse"
                      title="Stop loading"
                    >
                      <Square className="w-4 h-4 stroke-[2.5px]" fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputText.trim() && attachments.length === 0}
                      className="p-2 bg-primary hover:bg-primary/95 text-bg font-bold rounded-lg transition-all flex items-center justify-center shrink-0 shadow cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                  )}
                </div>

              </form>
            </div>
          </footer>
        )}

      </div>

      {/* DOCUMENT & MEDIA WORKSHOP SIDEBAR DRAWER */}
      <DocumentWorkshop
        isOpen={isWorkshopOpen}
        onClose={() => setIsWorkshopOpen(false)}
        file={workshopFile}
        onUpdateFile={(newContent) => {
          setWorkshopFile(prev => prev ? { ...prev, content: newContent } : null);
        }}
      />

      {/* SHARE ANALYSIS DIALOG MODAL */}
      <AnimatePresence>
        {shareModalChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalChat(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border w-full max-w-md rounded-2xl p-5 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setShareModalChat(null)}
                className="absolute top-4 right-4 p-1 text-muted hover:text-text rounded-lg hover:bg-card"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-bold text-md text-text flex items-center gap-2">
                <Share2 className="w-4 h-4 text-accent" />
                Share Decision Analysis
              </h3>
              <p className="text-xs text-muted mt-1">
                Generate a secure, read-only verification link to share with colleagues or stakeholders.
              </p>

              <div className="w-full border-t border-border/60 my-4" />

              {/* Options */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div>
                    <h4 className="text-xs font-semibold text-text">Include Verification Panels</h4>
                    <p className="text-[10px] text-muted">Displays score, evidence chips, and multi-angle evaluation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeScoreInShare}
                    onChange={(e) => setIncludeScoreInShare(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border bg-surface focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div>
                    <h4 className="text-xs font-semibold text-text">Share Last Prompt & Answer Only</h4>
                    <p className="text-[10px] text-muted">Excludes previous conversational history from the shareable link view.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareOnlyLatestPair}
                    onChange={(e) => setShareOnlyLatestPair(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border bg-surface focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Shareable URL</span>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-card border border-border p-2 rounded-lg text-xs text-muted truncate select-all">
                      {shareModalChat ? (() => {
                        const shareable = getShareableChat();
                        const serialized = shareable ? btoa(unescape(encodeURIComponent(JSON.stringify(shareable)))) : "";
                        return `${window.location.origin}${window.location.pathname}?share=${serialized.substring(0, 25)}...`;
                      })() : ""}
                    </div>
                    <button
                      onClick={handleCopyShareLink}
                      className="px-3 py-2 bg-primary hover:bg-primary/90 text-bg font-bold rounded-lg text-xs transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* THREE-SECOND INLINE UNDO DELETE TOAST */}
      <AnimatePresence>
        {showUndoToast && recentlyDeleted && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[100] bg-surface border border-border p-3 rounded-xl shadow-2xl flex items-center gap-4 text-xs font-medium max-w-sm"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <span className="text-muted">Deleted "{recentlyDeleted.title}"</span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {/* Undo click action */}
              <button
                onClick={handleUndoDelete}
                className="px-2.5 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary hover:text-text font-bold rounded-lg transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Undo
              </button>
              <button
                onClick={() => setShowUndoToast(false)}
                className="p-1 text-muted hover:text-text rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
