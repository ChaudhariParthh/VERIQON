import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Code,
  Type,
  Maximize2,
  Minimize2,
  Undo,
  FileSpreadsheet,
  Image as ImageIcon,
  Edit2,
  ChevronRight,
  Palette,
  AlertCircle
} from "lucide-react";

interface DocumentWorkshopProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    type: "document" | "csv" | "svg" | "canvas";
    name: string;
    content: string;
  } | null;
  onUpdateFile: (updatedContent: string) => void;
}

export const DocumentWorkshop: React.FC<DocumentWorkshopProps> = ({
  isOpen,
  onClose,
  file,
  onUpdateFile
}) => {
  const [activeTab, setActiveTab] = useState<"document" | "csv" | "svg" | "canvas">("document");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Raw Content state
  const [textContent, setTextContent] = useState("");
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [svgXml, setSvgXml] = useState("");

  // SVG Controls
  const [svgZoom, setSvgZoom] = useState(1);
  const [svgPan, setSvgPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Canvas Paint Controls
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paintColor, setPaintColor] = useState("#3b82f6");
  const [brushSize, setBrushSize] = useState(5);
  const [paintMode, setPaintMode] = useState<"pen" | "eraser" | "text" | "rect" | "circle" | "line">("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [textToDraw, setTextToDraw] = useState("");

  // Synced from Props
  useEffect(() => {
    if (!file) return;
    setActiveTab(file.type);
    if (file.type === "document") {
      setTextContent(file.content);
    } else if (file.type === "csv") {
      parseCsv(file.content);
    } else if (file.type === "svg") {
      setSvgXml(file.content);
    }
  }, [file]);

  // Sync back to parent when states change
  const handleContentChange = (newVal: string) => {
    setTextContent(newVal);
    onUpdateFile(newVal);
  };

  const handleSvgChange = (newVal: string) => {
    setSvgXml(newVal);
    onUpdateFile(newVal);
  };

  // --- CSV parsing & editing helpers ---
  const parseCsv = (csvText: string) => {
    if (!csvText.trim()) {
      setCsvRows([["Column 1", "Column 2"], ["", ""]]);
      return;
    }
    const lines = csvText.split("\n");
    const parsed = lines.map(line => {
      // Basic CSV splitter
      let arr: string[] = [];
      let inQuotes = false;
      let cur = "";
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          arr.push(cur.trim());
          cur = "";
        } else {
          cur += char;
        }
      }
      arr.push(cur.trim());
      return arr;
    });
    setCsvRows(parsed);
  };

  const serializeCsv = (rows: string[][]) => {
    const text = rows.map(row => 
      row.map(val => {
        const cleaned = val.replace(/"/g, '""');
        return cleaned.includes(",") || cleaned.includes("\n") || cleaned.includes('"') 
          ? `"${cleaned}"` 
          : cleaned;
      }).join(",")
    ).join("\n");
    onUpdateFile(text);
  };

  const updateCsvCell = (rIdx: number, cIdx: number, val: string) => {
    const updated = [...csvRows];
    updated[rIdx][cIdx] = val;
    setCsvRows(updated);
    serializeCsv(updated);
  };

  const addCsvRow = () => {
    const colCount = csvRows[0]?.length || 2;
    const newRow = Array(colCount).fill("");
    const updated = [...csvRows, newRow];
    setCsvRows(updated);
    serializeCsv(updated);
  };

  const addCsvCol = () => {
    const updated = csvRows.map((row, idx) => [...row, idx === 0 ? `New Column ${row.length + 1}` : ""]);
    setCsvRows(updated);
    serializeCsv(updated);
  };

  const removeCsvRow = (idx: number) => {
    if (csvRows.length <= 1) return;
    const updated = csvRows.filter((_, i) => i !== idx);
    setCsvRows(updated);
    serializeCsv(updated);
  };

  // --- AI Document / Image refiner ---
  const handleAiRefine = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    let currentContent = "";
    if (activeTab === "document") currentContent = textContent;
    else if (activeTab === "csv") {
      // Serialize CSV current rows
      currentContent = csvRows.map(r => r.join(",")).join("\n");
    } else if (activeTab === "svg") currentContent = svgXml;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "standard",
          messages: [
            {
              id: "system-refine-prompt",
              role: "user",
              content: `You are the Veriqon Document Refiner.
Your task is to take the user's current file, edit/update it according to their instructions, and return ONLY the raw updated content without any conversational chatter or surrounding markdown text wrappers.
Format of file: ${activeTab === "csv" ? "CSV Table" : activeTab === "svg" ? "SVG Vector Image XML" : "Markdown / Text"}.

Current file contents:
"""
${currentContent}
"""

User Instructions to update/edit this document:
"${aiPrompt}"

Remember: Return ONLY the raw edited content. Do not say "Here is your updated document" or add normal conversational words. Just output the content.`
            }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          // Parse out markdown codeblock wrappers if Gemini added them despite system prompt
          let cleaned = data.content.trim();
          if (cleaned.startsWith("```")) {
            const firstLineBreak = cleaned.indexOf("\n");
            const lastCodeBlock = cleaned.lastIndexOf("```");
            if (firstLineBreak !== -1 && lastCodeBlock !== -1) {
              cleaned = cleaned.substring(firstLineBreak + 1, lastCodeBlock).trim();
            }
          }

          if (activeTab === "document") {
            setTextContent(cleaned);
            onUpdateFile(cleaned);
          } else if (activeTab === "csv") {
            parseCsv(cleaned);
            onUpdateFile(cleaned);
          } else if (activeTab === "svg") {
            setSvgXml(cleaned);
            onUpdateFile(cleaned);
          }
          setAiPrompt("");
        } else {
          setAiError("Empty response from AI Refiner.");
        }
      } else {
        setAiError("Failed to update document using AI service.");
      }
    } catch (err) {
      console.error("AI refinement error:", err);
      setAiError("A network error occurred while refining document.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- SVG Pan & Zoom handlers ---
  const handleSvgMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - svgPan.x, y: e.clientY - svgPan.y });
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setSvgPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleSvgMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  // --- Drawing Canvas Controls ---
  useEffect(() => {
    if (activeTab === "canvas") {
      initCanvas();
    }
  }, [activeTab]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 500;

    // Set high-quality defaults
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = paintColor;
    ctx.lineWidth = brushSize;

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    saveCanvasState();
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setCanvasHistory(prev => [...prev.slice(-19), dataUrl]); // max 20 undos
  };

  const handleUndoCanvas = () => {
    if (canvasHistory.length <= 1) return;
    const prevHistory = [...canvasHistory];
    prevHistory.pop(); // remove current state
    const prevState = prevHistory[prevHistory.length - 1];
    setCanvasHistory(prevHistory);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = prevState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleCanvasStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawStart({ x, y });

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (paintMode === "pen" || paintMode === "eraser") {
      ctx.strokeStyle = paintMode === "eraser" ? "#ffffff" : paintColor;
      ctx.lineWidth = brushSize;
    } else if (paintMode === "text" && textToDraw.trim()) {
      ctx.fillStyle = paintColor;
      ctx.font = `${brushSize * 3}px sans-serif`;
      ctx.fillText(textToDraw, x, y);
      saveCanvasState();
      setIsDrawing(false);
    }
  };

  const handleCanvasDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (paintMode === "pen" || paintMode === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleCanvasEndDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (paintMode === "rect") {
      ctx.fillStyle = paintColor + "33"; // transparent fill
      ctx.strokeStyle = paintColor;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(drawStart.x, drawStart.y, x - drawStart.x, y - drawStart.y);
      ctx.fillRect(drawStart.x, drawStart.y, x - drawStart.x, y - drawStart.y);
    } else if (paintMode === "circle") {
      ctx.fillStyle = paintColor + "33";
      ctx.strokeStyle = paintColor;
      ctx.lineWidth = brushSize;
      const radius = Math.sqrt(Math.pow(x - drawStart.x, 2) + Math.pow(y - drawStart.y, 2));
      ctx.beginPath();
      ctx.arc(drawStart.x, drawStart.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    } else if (paintMode === "line") {
      ctx.strokeStyle = paintColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(drawStart.x, drawStart.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    saveCanvasState();
  };

  const handleCanvasBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Draw image keeping ratio
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);

        saveCanvasState();
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // --- Downloads / Exports ---
  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportDocument = (format: "txt" | "md" | "html" | "pdf") => {
    const nameWithoutExt = file?.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : "document";
    if (format === "txt") {
      triggerDownload(textContent, `${nameWithoutExt}.txt`, "text/plain");
    } else if (format === "md") {
      triggerDownload(textContent, `${nameWithoutExt}.md`, "text/markdown");
    } else if (format === "html") {
      const htmlOutput = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file?.name || "Document"}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1f2937; }
    h1 { border-b: 1px solid #e5e7eb; padding-bottom: 8px; }
    pre { background: #f3f4f6; padding: 12px; rounded: 8px; overflow-x: auto; }
    code { font-family: monospace; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f9fafb; }
  </style>
</head>
<body>
  ${textContent}
</body>
</html>`;
      triggerDownload(htmlOutput, `${nameWithoutExt}.html`, "text/html");
    } else if (format === "pdf") {
      // Direct printing of preview is the standard high-fidelity client PDF export
      window.print();
    }
  };

  const handleExportCsv = () => {
    const text = csvRows.map(r => r.join(",")).join("\n");
    const nameWithoutExt = file?.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : "dataset";
    triggerDownload(text, `${nameWithoutExt}.csv`, "text/csv");
  };

  const handleExportSvg = () => {
    const nameWithoutExt = file?.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : "diagram";
    triggerDownload(svgXml, `${nameWithoutExt}.svg`, "image/svg+xml");
  };

  const handleExportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const nameWithoutExt = file?.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : "painting";
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${nameWithoutExt}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`bg-card border-l border-border flex flex-col h-full z-30 transition-all duration-300 relative shadow-2xl ${
        isFullscreen ? "fixed inset-0 w-screen z-[100]" : "w-full md:w-[48%] lg:w-[44%] shrink-0"
      }`}
      id="veriqon-media-workshop"
    >
      {/* Workshop Header */}
      <div className="h-14 border-b border-border/80 px-4 flex items-center justify-between shrink-0 bg-surface/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-text uppercase tracking-wider">Veriqon Workshop</span>
            <span className="text-[10px] text-muted -mt-0.5">Interactive Document & Image Studio</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* AI Quick prompt input inside header for smart actions */}
          <div className="hidden lg:flex items-center gap-1.5 border border-border/60 bg-surface/80 rounded-lg pl-2 pr-1 py-1 mr-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <input
              type="text"
              placeholder="Refine file via AI..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiRefine()}
              disabled={isAiLoading}
              className="bg-transparent border-none outline-none text-xs text-text placeholder-muted w-36 focus:w-48 transition-all duration-200"
            />
            <button
              onClick={handleAiRefine}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 hover:text-primary text-muted rounded text-[10px] font-semibold transition-all disabled:opacity-40"
            >
              {isAiLoading ? "..." : "Apply"}
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text rounded-lg transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-error/10 hover:text-error border border-transparent hover:border-error/20 text-muted rounded-lg transition-all"
            title="Close Workshop"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Tabs Selector */}
      <div className="flex items-center justify-between border-b border-border bg-sidebar/40 px-4 py-1.5 text-xs select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("document")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "document" ? "bg-surface text-primary shadow-sm border border-border" : "text-muted hover:text-text"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📝 Document</span>
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "csv" ? "bg-surface text-primary shadow-sm border border-border" : "text-muted hover:text-text"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📊 Table/CSV</span>
          </button>
          <button
            onClick={() => setActiveTab("svg")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "svg" ? "bg-surface text-primary shadow-sm border border-border" : "text-muted hover:text-text"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>🎨 SVG Vector</span>
          </button>
          <button
            onClick={() => setActiveTab("canvas")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "canvas" ? "bg-surface text-primary shadow-sm border border-border" : "text-muted hover:text-text"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🖌️ Painter</span>
          </button>
        </div>

        <span className="text-[10px] text-muted italic truncate max-w-[150px] font-mono">
          {file?.name || "unnamed.txt"}
        </span>
      </div>

      {/* AI Error Alert block */}
      {aiError && (
        <div className="bg-error/10 border-b border-error/25 text-error text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{aiError}</span>
          </div>
          <button onClick={() => setAiError(null)} className="p-1 hover:bg-error/20 rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Studio Body Workspace */}
      <div className="flex-1 overflow-y-auto bg-surface/50 p-4 relative flex flex-col">
        
        {/* TAB 1: DOCUMENT EDITOR */}
        {activeTab === "document" && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
              {/* Left: Input Textarea */}
              <div className="flex flex-col gap-1.5 h-full">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Source Content (MD/HTML/Plain)</span>
                <textarea
                  value={textContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write or edit documents here..."
                  className="flex-1 w-full bg-card border border-border rounded-xl p-3 text-xs font-mono text-text placeholder-muted resize-none focus:outline-none focus:border-primary/50 min-h-[250px] leading-relaxed select-text"
                />
              </div>

              {/* Right: Rich Preview */}
              <div className="flex flex-col gap-1.5 h-full">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Live Rich Print Preview</span>
                <div className="flex-1 bg-card border border-border rounded-xl p-4 overflow-y-auto text-xs leading-relaxed max-h-[500px]">
                  <div className="prose max-w-none text-text select-text prose-sm">
                    {textContent ? (
                      <div dangerouslySetInnerHTML={{ __html: textContent.replace(/\n/g, "<br/>") }} />
                    ) : (
                      <span className="text-muted italic">No content generated. Start drafting...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Export & Actions Row */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3 flex-wrap gap-2">
              <span className="text-[10px] text-muted font-mono">{textContent.length} characters</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportDocument("txt")}
                  className="px-2.5 py-1.5 border border-border bg-card/60 hover:bg-card text-muted hover:text-text rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Plain TXT</span>
                </button>
                <button
                  onClick={() => handleExportDocument("md")}
                  className="px-2.5 py-1.5 border border-border bg-card/60 hover:bg-card text-muted hover:text-text rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Markdown</span>
                </button>
                <button
                  onClick={() => handleExportDocument("html")}
                  className="px-2.5 py-1.5 border border-border bg-card/60 hover:bg-card text-muted hover:text-text rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Styled HTML</span>
                </button>
                <button
                  onClick={() => handleExportDocument("pdf")}
                  className="px-2.5 py-1.5 bg-primary text-bg font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer hover:bg-primary/95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CSV SPREADSHEET GRID */}
        {activeTab === "csv" && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Spreadsheet Editor (Edit cell on click)</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={addCsvRow}
                  className="px-2 py-1 bg-surface border border-border hover:bg-card text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Row</span>
                </button>
                <button
                  onClick={addCsvCol}
                  className="px-2 py-1 bg-surface border border-border hover:bg-card text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>

            {/* Editable grid */}
            <div className="flex-1 border border-border rounded-xl bg-card overflow-auto max-h-[400px]">
              {csvRows.length > 0 ? (
                <table className="w-full text-[11px] border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-surface/80 border-b border-border">
                      <th className="p-2 border-r border-border w-10 text-center text-muted">#</th>
                      {csvRows[0].map((cell, colIdx) => (
                        <th key={colIdx} className="p-2 border-r border-border text-left font-bold text-text bg-surface/50">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCsvCell(0, colIdx, e.target.value)}
                            className="bg-transparent border-none outline-none font-bold text-text w-full focus:bg-card px-1"
                          />
                        </th>
                      ))}
                      <th className="p-2 w-12 text-center text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-border/50 hover:bg-surface/30">
                        <td className="p-2 border-r border-border text-center text-muted font-mono">{rowIdx + 1}</td>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx} className="p-1 border-r border-border">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateCsvCell(rowIdx + 1, colIdx, e.target.value)}
                              className="bg-transparent border-none outline-none text-text w-full focus:bg-card px-1 py-0.5 font-sans"
                            />
                          </td>
                        ))}
                        <td className="p-1 text-center">
                          <button
                            onClick={() => removeCsvRow(rowIdx + 1)}
                            className="p-1 hover:text-error rounded hover:bg-error/10 text-muted"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-muted italic">Spreadsheet is empty. Click Add Row to build data.</div>
              )}
            </div>

            {/* Export spreadsheet */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[10px] text-muted font-mono">{csvRows.length} Rows × {csvRows[0]?.length || 0} Columns</span>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 bg-primary text-bg font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer hover:bg-primary/95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Dataset</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SVG VECTOR IMAGE VIEWER */}
        {activeTab === "svg" && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
              {/* Left: Code editor */}
              <div className="flex flex-col gap-1.5 h-full">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Raw Vector XML Markup</span>
                <textarea
                  value={svgXml}
                  onChange={(e) => handleSvgChange(e.target.value)}
                  placeholder="Paste or write raw SVG XML code here..."
                  className="flex-1 w-full bg-card border border-border rounded-xl p-3 text-xs font-mono text-text placeholder-muted resize-none focus:outline-none focus:border-primary/50 min-h-[250px] leading-relaxed select-text"
                />
              </div>

              {/* Right: SVG Canvas viewer with Pan & Zoom */}
              <div className="flex flex-col gap-1.5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Interactive Vector Canvas</span>
                  <div className="flex items-center gap-1 border border-border/80 rounded-md bg-card p-0.5">
                    <button
                      onClick={() => setSvgZoom(prev => Math.min(prev + 0.2, 5))}
                      className="p-1 text-muted hover:text-text rounded hover:bg-surface"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSvgZoom(prev => Math.max(prev - 0.2, 0.2))}
                      className="p-1 text-muted hover:text-text rounded hover:bg-surface"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSvgZoom(1);
                        setSvgPan({ x: 0, y: 0 });
                      }}
                      className="p-1 text-muted hover:text-text rounded hover:bg-surface"
                      title="Recenter Image"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 bg-card border border-border rounded-xl relative overflow-hidden cursor-move select-none flex items-center justify-center min-h-[250px]"
                  onMouseDown={handleSvgMouseDown}
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={handleSvgMouseUpOrLeave}
                  onMouseLeave={handleSvgMouseUpOrLeave}
                >
                  {/* SVG Code injection */}
                  <div
                    style={{
                      transform: `translate(${svgPan.x}px, ${svgPan.y}px) scale(${svgZoom})`,
                      transformOrigin: "center",
                      transition: isPanning ? "none" : "transform 0.15s ease-out"
                    }}
                    className="w-full h-full flex items-center justify-center p-6"
                    dangerouslySetInnerHTML={{ __html: svgXml }}
                  />
                </div>
              </div>
            </div>

            {/* Export vector graphic */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[10px] text-muted font-mono">{svgXml.length} characters of XML markup</span>
              <button
                onClick={handleExportSvg}
                className="px-3 py-1.5 bg-primary text-bg font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer hover:bg-primary/95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG Artwork</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CREATIVE PAINT CANVAS */}
        {activeTab === "canvas" && (
          <div className="flex-1 flex flex-col gap-4">
            {/* Draw controls bar */}
            <div className="flex items-center justify-between gap-4 bg-sidebar/50 border border-border rounded-xl p-2.5 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Paint brush/eraser modes */}
                <div className="flex items-center gap-0.5 border border-border bg-card/60 p-0.5 rounded-lg select-none">
                  <button
                    onClick={() => setPaintMode("pen")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      paintMode === "pen" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    🖊️ Pen
                  </button>
                  <button
                    onClick={() => setPaintMode("eraser")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      paintMode === "eraser" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    🧽 Eraser
                  </button>
                  <button
                    onClick={() => setPaintMode("text")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      paintMode === "text" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    🔤 Text
                  </button>
                </div>

                {/* Shape modes */}
                <div className="flex items-center gap-0.5 border border-border bg-card/60 p-0.5 rounded-lg select-none">
                  <button
                    onClick={() => setPaintMode("rect")}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      paintMode === "rect" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                    title="Draw Rectangle"
                  >
                    ⬜ Rect
                  </button>
                  <button
                    onClick={() => setPaintMode("circle")}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      paintMode === "circle" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                    title="Draw Circle"
                  >
                    ⚪ Circle
                  </button>
                  <button
                    onClick={() => setPaintMode("line")}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      paintMode === "line" ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                    title="Draw Straight Line"
                  >
                    ➖ Line
                  </button>
                </div>

                {/* Color swatch picker */}
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => setPaintColor(e.target.value)}
                    className="w-6 h-6 rounded-full border border-border/80 cursor-pointer overflow-hidden bg-transparent"
                    title="Custom Color"
                  />
                  <div className="flex items-center gap-1">
                    {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#000000"].map(c => (
                      <button
                        key={c}
                        onClick={() => setPaintColor(c)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          paintColor === c ? "scale-110 border-text shadow" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider for brush size & Text drawer options */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase">
                  <span>Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-20 cursor-pointer accent-primary"
                  />
                  <span className="font-mono w-4">{brushSize}px</span>
                </div>

                {paintMode === "text" && (
                  <input
                    type="text"
                    placeholder="Type words to stamp..."
                    value={textToDraw}
                    onChange={(e) => setTextToDraw(e.target.value)}
                    className="bg-card border border-border rounded px-2 py-1 text-[11px] outline-none text-text focus:border-primary w-32"
                  />
                )}

                {/* Background image uploader */}
                <label className="px-2 py-1 bg-surface hover:bg-card border border-border rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Load Bg Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCanvasBgUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Actual drawing element canvas */}
            <div className="flex-1 bg-card border border-border rounded-xl relative overflow-hidden flex items-center justify-center min-h-[300px]">
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasStartDraw}
                onMouseMove={handleCanvasDrawing}
                onMouseUp={handleCanvasEndDraw}
                onMouseLeave={handleCanvasEndDraw}
                className="shadow-inner cursor-crosshair max-w-full rounded-xl"
              />
            </div>

            {/* Clear, undo, export painting */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3 flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndoCanvas}
                  disabled={canvasHistory.length <= 1}
                  className="px-2.5 py-1.5 border border-border bg-card/60 hover:bg-card disabled:opacity-40 text-muted hover:text-text rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo Stroke</span>
                </button>
                <button
                  onClick={initCanvas}
                  className="px-2.5 py-1.5 border border-border bg-card/60 hover:bg-card text-muted hover:text-text rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-error" />
                  <span>Reset Canvas</span>
                </button>
              </div>
              <button
                onClick={handleExportCanvas}
                className="px-3 py-1.5 bg-primary text-bg font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer hover:bg-primary/95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PNG Drawing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
