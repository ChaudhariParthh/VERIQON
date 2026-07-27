# VERIQON - High-Assurance Decision Verification Intelligence System

> **Trust Every Decision** — Enterprise-grade decision verification and auditing platform powered by Google Gemini AI

**Veriqon-AI** is a **no-code AI assistant** built using **Google AI Studio** through prompt engineering and AI system design. Developed by applying the knowledge gained from the **Google AI Professional Certification**, particularly the **AI in App Building** module, it leverages the **Gemini 3.5 Flash** model to deliver fast, reliable, and intelligent AI interactions.

The assistant integrates intelligent web search, multimodal AI capabilities, and explainable AI features to provide transparent and efficient responses. A key feature is its **Decision Audit Mode**, which enhances trust by displaying the AI's **confidence level**, **risk level**, and the **supporting evidence** behind each response. It also includes usability-focused enhancements such as **chat deletion**, allowing users to remove individual conversations, and a **`clear` command** in the prompt bar that instantly clears the chat context for a fresh interaction.

---

## Table of Contents
- [Project Title](#project-title)
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Use Cases](#use-cases)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Project Title

**VERIQON** - High-Assurance Decision Verification Interface

A professional, enterprise-grade decision-verification and auditing intelligence system that transforms how organizations evaluate critical decisions. VERIQON leverages advanced AI reasoning to provide structured, evidence-based decision support with rigorous multi-angle verification and comprehensive risk assessment.

---

## About the Project

VERIQON AI is a sophisticated full-stack web application designed to serve as a premium decision intelligence platform. Built with React 19 (Vite) on the frontend and Express on the backend, VERIQON combines state-of-the-art generative AI with enterprise-grade security, comprehensive decision auditing, and intuitive user experience design.

The system operates in two intelligent modes:
- **Standard Mode**: Fast, conversational assistance for general queries, coding help, creative generation, and information requests
- **Decision Audit Mode**: Deep, rigorous analysis for high-stakes decisions involving financial, medical, legal, security, and strategic considerations

Every decision receives a confidence score, evidence-based reasoning, multi-angle verification, and actionable recommendations backed by comprehensive risk assessment.

---

## Key Features

#### Intelligent Dual-Mode System
- **Auto-Router Engine**: Automatically detects query complexity and routes to appropriate analysis mode
- **Standard Mode**: Fast, direct responses for conversational queries and general assistance
- **Decision Audit Mode**: Enterprise-grade decision verification with structured analysis

#### Advanced Decision Analytics
- **Confidence Scoring**: 0-100 reliability scores with colored visual indicators (Green/Amber/Red)
- **Evidence Panel**: Factual claims supporting or contradicting decisions with source attribution
- **Multi-Angle Verification**: Logical consistency, factual grounding, risk assessment, and alternative perspectives
- **Risk Matrix**: Comprehensive identification of edge cases, blind spots, and potential negative consequences

#### Intelligent Prompt Optimization
- **Smart Prompt Analyzer**: Automatically detects vague or incomplete prompts
- **Auto-Expansion**: Enhances poorly-defined queries into highly specific, actionable decision prompts
- **Alternative Perspectives**: Generates 2-3 distinct optimization variations (Technical, Business, Strategic)

#### Enterprise Security & Governance
- **Server-Side API Proxying**: API keys never exposed to the client browser
- **Prompt Injection Protection**: Hardened against common jailbreak and manipulation attempts
- **Session Isolation**: Secure operator session management with role-based controls
- **Data Privacy**: No credentials, developer names, or sensitive information in source code

#### Rich Media Support
- **Multi-Format Attachments**: Upload images, videos, audio, and documents for contextual analysis
- **Inline Data Processing**: Base64-encoded attachments transmitted securely to the backend
- **Content-Aware Analysis**: AI understands context from various media types

#### Responsive Modern UI
- **Tailwind CSS**: Beautiful, dark-mode enabled interface
- **Real-Time Streaming**: Live response generation with progressive content display
- **Mobile-Optimized**: Fully responsive design for desktop, tablet, and mobile devices
- **Smooth Animations**: Motion.js integration for elegant UI transitions

#### Developer-Friendly Architecture
- **Full TypeScript**: Type-safe codebase across frontend and backend
- **Environment Configuration**: Simple .env-based API key management
- **Production Build Optimization**: Single-command build for Docker and cloud deployment
- **Comprehensive Error Handling**: Graceful fallbacks and detailed error messages

---

## Tech Stack

### Frontend
- **React 19** - Modern UI framework with latest hooks and features
- **Vite 6.2.3** - Lightning-fast build tool with HMR support
- **TypeScript 5.8** - Type-safe JavaScript for maintainability
- **Tailwind CSS 4.1** - Utility-first CSS framework with dark mode support
- **Lucide React** - Beautiful, customizable SVG icons
- **Motion 12** - Smooth animation library for fluid UI transitions
- **React Markdown** - Markdown rendering with security safeguards

### Backend
- **Express 4.21** - Minimalist Node.js web framework
- **Google Gemini API 2.4** - Advanced AI reasoning and content generation
- **dotenv 17** - Environment variable management
- **tsx 4.21** - TypeScript execution runtime for Node.js

### Build & Development
- **esbuild 0.25** - Ultra-fast JavaScript bundler
- **Autoprefixer 10** - CSS vendor prefixing automation
- **Node.js 18+** - JavaScript runtime environment

### Language Composition
- **TypeScript**: 302,792 bytes (97.0% of codebase)
- **CSS**: 4,945 bytes (1.6%)
- **HTML**: 311 bytes (0.1%)

---

## How It Works

### 1. Intelligent Intent Detection
When you submit a query, VERIQON's enterprise-grade router analyzes multiple dimensions:
- Complexity assessment (LOW, MEDIUM, HIGH)
- Risk evaluation (NONE, LOW, MEDIUM, HIGH, CRITICAL)
- Verification requirements and evidence needs
- Multi-perspective analysis requirements

### 2. Auto-Routing Decision Engine
Based on intent analysis, the system automatically selects:
- **STANDARD_AI Mode** for: casual conversation, coding, creative tasks, general Q&A
- **DECISION_AUDIT Mode** for: financial decisions, medical queries, legal topics, security architecture, policy analysis, hiring decisions, business strategy

### 3. Prompt Optimization Pipeline
If your input is vague or incomplete:
- Smart analyzer detects unclear prompts
- Auto-expander enriches your query with specific objectives, constraints, and metrics
- Optional: Review 2-3 alternative perspectives before proceeding

### 4. Response Generation with Self-Correction
VERIQON runs an internal 4-step refinement loop:
1. **Initial Draft**: Raw first-pass response generation
2. **Critic Feedback**: Rigorous internal audit identifies gaps and weaknesses
3. **Improvement Reasoning**: Strategic refinement plan to address all criticism
4. **Final Polish**: Optimized, corrected response ready for output

### 5. Multi-Angle Verification (Decision Audit Mode)
Responses are evaluated from multiple perspectives:
- **Logical Consistency**: Reasoning flow analysis for contradictions and fallacies
- **Factual Grounding**: Verification of assumptions, data points, and claims
- **Risk & Edge Cases**: Identification of blind spots and negative consequences
- **Alternative Viewpoints**: Devil's advocate perspectives and competing options

### 6. Evidence-Based Scoring
Every decision receives:
- **Confidence Score** (0-100): Reliability and logical consistency rating
- **Score State**: "scored" if sufficient evidence exists, "insufficient_evidence" otherwise
- **Evidence Panel**: Factual claims with source attribution and stance (support/contradict/neutral)
- **Risk Level**: Strategic impact assessment (NONE to CRITICAL)

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)
- Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/ChaudhariParthh/VERIQON.git
cd VERIQON
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

#### 4. Start Development Server
```bash
npm run dev
```

The application will launch at `http://localhost:3000`

#### 5. Access the Interface
- Open your browser to `http://localhost:3000`
- Start with a simple query to test connectivity
- Submit a decision prompt to experience Decision Audit Mode
- Upload attachments (images, documents) for contextual analysis

### Production Build & Deployment

#### Build for Production
```bash
npm run build
```

This command:
- Compiles React frontend assets using Vite
- Bundles Express server with esbuild
- Creates optimized production bundle at `dist/server.cjs`

#### Start Production Server
```bash
npm run start
```

Server will launch on port 3000 and serve both API endpoints and static frontend assets.

#### Deploy to Cloud Platforms
- **Google Cloud Run**: Deploy the built `dist/server.cjs` to Cloud Run
- **Docker**: Build container using the production artifacts
- **Traditional VPS**: Transfer `dist/server.cjs` and `package.json` to your server

---

## Project Structure

```
VERIQON/
├── .env.example                    # Template for environment variables
├── .gitignore                      # Git ignore patterns (Node, Vite, logs)
├── package.json                    # Dependencies, scripts, and metadata
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite build configuration with Tailwind
├── server.ts                       # Express backend (59.5 KB)
│                                   # - Gemini API proxy
│                                   # - Decision routing engine
│                                   # - Intent classification
│                                   # - Prompt optimization
│                                   # - Multi-modal attachment handling
├── index.html                      # SPA entry point
├── src/                            # Frontend source directory
│   ├── main.tsx                    # React app mounting point
│   ├── App.tsx                     # Core React component
│   │                               # - Chat interface
│   │                               # - Tab management
│   │                               # - Message history
│   │                               # - Attachment upload
│   │                               # - Theme management
│   ├── index.css                   # Global styles (Tailwind CSS)
│   └── components/                 # Reusable UI components
│       ├── ChatInterface.tsx       # Main chat UI
│       ├── DecisionDashboard.tsx   # Decision score & analytics
│       ├── EvidencePanel.tsx       # Evidence display
│       ├── MultiAngleVerification.tsx  # Verification tabs
│       ├── RiskMatrix.tsx          # Risk assessment visualization
│       └── AttachmentUpload.tsx    # File upload handler
├── assets/                         # Static resources
│   ├── logo.svg                    # VERIQON logo
│   └── styles/                     # Additional CSS
├── dist/                           # Production build output
│   └── server.cjs                  # Bundled Express server
└── node_modules/                   # Installed dependencies
```

### Key File Responsibilities

**server.ts** (Backend Hub - 59.5 KB)
- Initializes Express server on port 3000
- Manages Gemini API client initialization
- Implements `/api/chat` endpoint with dual-mode logic
- Classifies user intent using multi-dimensional analysis
- Routes requests to STANDARD_AI or DECISION_AUDIT mode
- Handles automatic prompt optimization
- Processes multi-modal attachments (images, video, audio)
- Implements resilience protocols with model fallbacks
- Serves Vite middleware in development and static assets in production

**App.tsx** (Frontend Hub)
- Manages React application state and lifecycle
- Implements chat interface with message threading
- Handles tab management for multiple conversations
- Manages message history and scroll behavior
- Processes attachment uploads and preview
- Implements theme detection (light/dark mode)
- Manages decision dashboard visibility
- Handles real-time response streaming

**package.json** (Configuration)
- `npm run dev`: Start development server with hot reload
- `npm run build`: Compile frontend and bundle backend
- `npm run start`: Launch production server
- `npm run clean`: Remove build artifacts
- `npm run lint`: TypeScript type checking

---

## Use Cases

### Financial & Investment Analysis
- Stock investment evaluation with ROI assessment
- Business acquisition due diligence
- Capital allocation strategy verification
- Merger & integration risk analysis
- Portfolio diversification recommendations

### Medical & Healthcare Decisions
- Treatment option comparison with efficacy data
- Medication interaction risk assessment
- Diagnostic pathway verification
- Clinical decision support for patient scenarios
- Health insurance plan evaluation

### Legal & Compliance
- Contract review and liability assessment
- Regulatory compliance verification
- Legal strategy and litigation risk analysis
- Intellectual property protection evaluation
- Data privacy and GDPR compliance audit

### Technology & Architecture
- System design and scalability assessment
- Cloud infrastructure selection and optimization
- Security architecture evaluation
- Technical debt analysis and remediation
- Database and API design verification

### Business & Strategy
- Market entry strategy evaluation
- Competitive positioning analysis
- Product launch timing and strategy
- Pricing model optimization
- Organizational restructuring and hiring decisions

### Creative & Content
- Content marketing strategy development
- Marketing copy optimization and A/B testing
- Creative campaign ideation and refinement
- Writing and editing assistance
- Brainstorming and innovation sessions

---

## Future Roadmap

### Q3 2026 - Advanced Analytics & Visualization
- Interactive decision matrix visualization
- Real-time confidence trend analysis
- Historical decision tracking and performance feedback
- Comparative decision analysis across multiple scenarios
- Export functionality (PDF, JSON, CSV reports)

### Q4 2026 - Collaboration & Governance
- Multi-user collaboration on shared decision audits
- Role-based access control (RBAC) for team members
- Decision audit approval workflows
- Team decision history and audit trails
- Comment and annotation system for collaborative review

### Q1 2027 - Enhanced AI Capabilities
- Custom decision frameworks and templates
- Industry-specific decision models (Finance, Healthcare, Legal)
- Citation and source tracking integration
- Real-time data integration for live decision updates
- Advanced model selection and fine-tuning options

### Q2 2027 - Integration & Extensions
- Slack and Teams integration for chat-based decisions
- Zapier integration for workflow automation
- API access for enterprise customers
- Custom branding and white-label options
- Plugin ecosystem for third-party extensions

### Q3 2027 - Autocomplete & Intelligence
- Smart prompt autocomplete based on context
- Decision pattern recognition and recommendations
- AI-powered decision suggestion engine
- Semantic similarity for related decision discovery
- Automatic follow-up question generation

### Q4 2027 - Enterprise Features
- Single Sign-On (SSO) integration
- Advanced audit logging and compliance reporting
- Usage analytics and cost optimization
- Custom deployment options (on-premise, private cloud)
- Dedicated support and SLA agreements

---

## Contributing

We welcome contributions from the community! Whether you're a developer, designer, or domain expert, here are ways you can contribute:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/[your-username]/VERIQON.git
   cd VERIQON
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, well-documented code
   - Follow TypeScript and React best practices
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit and Push**
   ```bash
   git commit -m "feat: Add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure CI/CD checks pass
   - Request review from maintainers

### Development Guidelines

- **Code Style**: Use TypeScript with strict mode enabled
- **Formatting**: Run `npm run lint` before commits
- **Testing**: Write unit and integration tests for new features
- **Documentation**: Update README and code comments
- **Security**: Never commit API keys or sensitive data
- **Performance**: Optimize bundle size and runtime performance

### Reporting Issues

Found a bug? Have a suggestion? Please open an issue with:
- Clear, descriptive title
- Detailed reproduction steps
- Expected vs. actual behavior
- Environment details (OS, Node.js version, browser)
- Screenshots or error logs if applicable

---

## License

This project is open-source and available under the **MIT License**. See the LICENSE file for complete details.

### MIT License Summary
- You are free to use, modify, and distribute this software
- Include the original copyright notice and license in any distribution
- No warranty is provided; use at your own risk
- Commercial use is permitted

---
### AI in App Building
<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/cea1c913-71c5-47f4-999a-e3b00823452a" />


## Author

**Parth Chaudhari**

Artificial Intelligence & Data Science Engineer

- GitHub: [@ChaudhariParthh](https://github.com/ChaudhariParthh)
- Email: Contact via GitHub profile
- LinkedIn: [Parth Chaudhari](https://linkedin.com/Chaudhariparthh)

### About

Parth is a passionate AI and data science engineer specializing in enterprise decision intelligence systems, advanced language models, and enterprise-grade security architectures. VERIQON represents the culmination of years of research and development in applied AI, prompt engineering, and decision science.

### Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev/)
- Powered by [React 19](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Animations by [Motion.js](https://motion.dev/)

---

## Support & Resources

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Full documentation and API reference coming soon
- **Community**: Join discussions for feature requests and best practices
- **Security**: Report security vulnerabilities responsibly to the maintainers

---

**Last Updated**: July 24, 2026

**Status**: Active Development

**Star**: If you find VERIQON valuable, please star the repository to show your support!
