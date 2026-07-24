# Veriqon AI - High-Assurance Decision Verification Interface

Veriqon AI is a professional, high-assurance decision-verification and auditing intelligence system. Built with a full-stack architecture using **React 19 (Vite)** on the frontend, **Express** on the backend, and styled with **Tailwind CSS**, it secures the core intelligence engine (Google Gemini API) server-side to prevent key exposure.

---

## 🚀 Instant GitHub Integration

Because you are using Google AI Studio, you do not need to manually initialize or configure external git configurations. The platform provides a native mechanism to instantly publish or export this codebase:

1. **Open the Settings Menu**: In the top-right corner of the Google AI Studio interface, click on the **Settings** cog or menu icon.
2. **Export to GitHub**: Select the **"Export to GitHub"** option.
3. **Authenticate & Ingest**: Grant GitHub authorization when prompted, choose your target repository (or create a new one), and the platform will automatically push this entire structured project directly to your GitHub account!
4. *(Alternative)*: You can also choose **"Download ZIP"** to download the clean, complete source tree locally.

---

## 📂 Repository & Project Structure

The project is structured according to clean, full-stack separation of concerns:

```text
├── .env.example         # Template for required environment variables (e.g. GEMINI_API_KEY)
├── .gitignore           # Standard Git ignores for Node.js, Vite build artifacts, and logs
├── index.html           # Main SPA entry point
├── package.json         # Dependency manifest, build, dev, and start scripts
├── server.ts            # Secure Express server & Gemini API proxy (Node.js backend)
├── tsconfig.json        # TypeScript compile configurations
├── vite.config.ts       # Vite config integrated with Tailwind CSS & React
├── src/                 # Frontend Source Directory
│   ├── main.tsx         # React application mounting point
│   ├── App.tsx          # Core React application, managing chats, tabs, and interactive UI
│   ├── index.css        # Global CSS stylesheet importing Tailwind CSS
│   └── components/      # Extracted reusable UI components
└── assets/              # Built-in system static assets and styles
```

---

## 🛠️ Local Development Setup

To download, run, or deploy this project locally on your system, follow these steps:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your machine.

### 2. Install Dependencies
Run the following command in the project root to install the required frontend and backend packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory by copying the example template:
```bash
cp .env.example .env
```
Open `.env` and configure your API keys securely:
```env
# Secure Server-side API Keys (Never exposed to the client)
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run Development Server
Start the full-stack development environment. This boots the Express backend with `tsx` on port `3000` and configures Vite in middleware mode:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to interact with Veriqon AI.

---

## 📦 Production Build & Run

To compile and execute the application for production deployment (e.g., to Docker, Cloud Run, or VPS):

### 1. Build the App
Compile both the React frontend assets (using Vite) and bundle the TypeScript Express server into a single, high-performance CommonJS module `dist/server.cjs` (using `esbuild`):
```bash
npm run build
```

### 2. Start Production Server
Launch the self-contained production server:
```bash
npm run start
```
The server will boot and serve the pre-built React frontend and proxy backend endpoints seamlessly from port `3000`.

---

## 🔒 Security & Privacy Architecture
- **Server-Side API Proxying**: The client never communicates directly with Google's API endpoints, protecting your `GEMINI_API_KEY` from exposure in the browser.
- **Operator Session**: The interface is pre-configured with a secure local status indicator (`operator@veriqon.ai`) representing an authenticated high-assurance console operator.
- **Private Data Protection**: No personal credentials, developer names, or private contact information are included in the source code or exposed by the model's self-awareness triggers.
