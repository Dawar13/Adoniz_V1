"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import type { Source, BatchStatus } from "@/types/conversation"
import { SOURCE_OPTIONS } from "@/lib/product-constants"

// Pipeline stages in order
const STAGES: { key: string; label: string }[] = [
  { key: "parsing",           label: "Parsing" },
  { key: "sanitizing",        label: "Sanitizing PII" },
  { key: "analyzing",         label: "Analyzing" },
  { key: "embedding",         label: "Embedding" },
  { key: "extracting_themes", label: "Extracting Themes" },
  { key: "completed",         label: "Done" },
]

const STATUS_ORDER = ["uploading", "parsing", "sanitizing", "analyzing", "embedding", "extracting_themes", "completed"]

interface BatchStatusData {
  id: string
  status: BatchStatus
  total_conversations: number
  processed_count: number
  error_message?: string
  created_at: string
  completed_at?: string
}

interface PreviousBatch {
  id: string
  source: Source
  file_name?: string
  status: BatchStatus
  total_conversations: number
  created_at: string
}

const BTN: React.CSSProperties = {
  background: "#003D31",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  fontWeight: 600,
  fontSize: "15px",
  height: "48px",
  borderRadius: "8px",
  padding: "0 24px",
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(hrs / 24)
  if (hrs < 1) return "Just now"
  if (hrs < 24) return `${hrs}h ago`
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

export default function IngestPage() {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file")
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [source, setSource] = useState<Source>("intercom")
  const [isDragging, setIsDragging] = useState(false)
  const [pageState, setPageState] = useState<"idle" | "uploading" | "processing" | "completed" | "failed">("idle")
  const [batchStatus, setBatchStatus] = useState<BatchStatusData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previousBatches, setPreviousBatches] = useState<PreviousBatch[]>([])
  const [btnHover, setBtnHover] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadBatches = useCallback(async () => {
    try {
      const res = await fetch("/api/ingest/batches")
      if (res.ok) {
        const data = await res.json()
        setPreviousBatches(data.batches ?? [])
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { loadBatches() }, [loadBatches])

  const startPolling = useCallback((id: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/ingest/batch/${id}`)
        if (!res.ok) { pollRef.current = setTimeout(poll, 2000); return }
        const data: BatchStatusData = await res.json()
        setBatchStatus(data)
        if (data.status === "completed") {
          setPageState("completed")
          loadBatches()
        } else if (data.status === "failed") {
          setPageState("failed")
          setError(data.error_message ?? "Processing failed")
        } else {
          pollRef.current = setTimeout(poll, 2000)
        }
      } catch {
        pollRef.current = setTimeout(poll, 2000)
      }
    }
    poll()
  }, [loadBatches])

  useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current) }, [])

  const handleSubmit = async () => {
    if (activeTab === "file" && !file) { setError("Please select a file"); return }
    if (activeTab === "text" && !text.trim()) { setError("Please paste some text"); return }
    setPageState("uploading")
    setError(null)

    try {
      const formData = new FormData()
      if (activeTab === "file" && file) formData.append("file", file)
      if (activeTab === "text") formData.append("text", text)
      formData.append("source", source)

      const ingestRes = await fetch("/api/ingest", { method: "POST", body: formData })
      if (!ingestRes.ok) {
        const err = await ingestRes.json()
        throw new Error(err.error ?? "Upload failed")
      }

      const { batchId, conversationCount } = await ingestRes.json()
      setBatchStatus({ id: batchId, status: "parsing", total_conversations: conversationCount, processed_count: 0, created_at: new Date().toISOString() })
      setPageState("processing")

      // Fire-and-forget — start the pipeline
      fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId }),
      }).catch(console.error)

      startPolling(batchId)
    } catch (err) {
      setPageState("failed")
      setError(err instanceof Error ? err.message : "Upload failed")
    }
  }

  const reset = () => {
    setPageState("idle")
    setFile(null)
    setText("")
    setBatchStatus(null)
    setError(null)
    if (pollRef.current) clearTimeout(pollRef.current)
  }

  const stageIndex = batchStatus ? STATUS_ORDER.indexOf(batchStatus.status) : 0
  const progress = batchStatus && batchStatus.total_conversations > 0
    ? Math.round((batchStatus.processed_count / batchStatus.total_conversations) * 100)
    : 0

  // ── Processing / Completed / Failed view ───────────────────────────────────
  if (pageState === "processing" || pageState === "completed" || pageState === "failed") {
    return (
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, color: "#003D31", marginBottom: 6 }}>
          Ingest Data
        </h1>

        <div className="rounded-2xl p-6 mt-6" style={{ background: "#fff", border: "1px solid #E5EAE6" }}>
          {pageState === "failed" ? (
            <>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#EF4444", marginBottom: 20 }}>
                ✗ {error ?? "Processing failed"}
              </p>
              <button onClick={reset} style={BTN}>Try Again</button>
            </>
          ) : pageState === "completed" ? (
            <>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "#16A34A", marginBottom: 6 }}>
                ✓ {batchStatus?.total_conversations ?? 0} conversations processed successfully
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
                Sentiment, categories, summaries and themes have been extracted.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard" style={{ ...BTN, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                  View Dashboard →
                </Link>
                <button onClick={reset}
                  style={{ ...BTN, background: "transparent", color: "#003D31", border: "1px solid #E5EAE6" }}>
                  Upload More
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "#003D31", marginBottom: 20 }}>
                Processing {batchStatus?.total_conversations ?? "..."} conversations
              </p>

              {/* Stage list */}
              <div className="flex flex-col gap-2.5 mb-6">
                {STAGES.map((stage, i) => {
                  const done = stageIndex > i
                  const active = stageIndex === i
                  return (
                    <div key={stage.key} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: done ? "#003D31" : active ? "#F0FF3D" : "#E5EAE6" }}>
                        {done && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                        {active && <span style={{ fontSize: 8, color: "#003D31" }}>●</span>}
                      </div>
                      <span style={{
                        fontFamily: "var(--font-sans)", fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        color: done || active ? "#003D31" : "#9CA3AF",
                      }}>
                        {stage.label}{active ? "..." : ""}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="rounded-full overflow-hidden" style={{ height: 8, background: "#E5EAE6", marginBottom: 8 }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, progress)}%`, background: "#003D31" }} />
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9CA3AF" }}>
                {batchStatus?.processed_count ?? 0} / {batchStatus?.total_conversations ?? 0} analyzed
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Idle / Uploading form view ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, color: "#003D31", marginBottom: 6 }}>
        Ingest Data
      </h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#6B7280", marginBottom: 24 }}>
        Upload customer conversations to analyze
      </p>

      <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #E5EAE6" }}>
        {/* Tab toggle */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#F8FAF9", width: "fit-content" }}>
          {(["file", "text"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "#003D31" : "#9CA3AF",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>
              {tab === "file" ? "Upload File" : "Paste Text"}
            </button>
          ))}
        </div>

        {/* File upload zone */}
        {activeTab === "file" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setIsDragging(false)
              const f = e.dataTransfer.files[0]; if (f) setFile(f)
            }}
            style={{
              border: `2px dashed ${isDragging ? "#003D31" : file ? "#22C55E" : "#E5EAE6"}`,
              borderRadius: 12, padding: "48px 24px", textAlign: "center",
              cursor: "pointer", background: isDragging ? "rgba(0,61,49,0.03)" : "#FAFAFA",
              marginBottom: 16, transition: "all 0.15s",
            }}>
            <input ref={fileInputRef} type="file" accept=".csv,.json,.txt,.pdf"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
            {file ? (
              <>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "#003D31", marginBottom: 4 }}>
                  {file.name}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9CA3AF" }}>
                  {(file.size / 1024).toFixed(1)} KB · Click to change
                </p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#374151", marginBottom: 4 }}>
                  Drag and drop a file here, or click to browse
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9CA3AF" }}>
                  Supports CSV, JSON, TXT, PDF — Max 10MB
                </p>
              </>
            )}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Paste your conversation data here...\n\nSeparate conversations with --- or blank lines"}
            style={{
              width: "100%", height: 300, padding: 16,
              fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.6,
              border: "1px solid #E5EAE6", borderRadius: 8, resize: "vertical",
              outline: "none", color: "#1A1A1A", background: "#FAFAFA",
              boxSizing: "border-box", marginBottom: 16,
            }}
          />
        )}

        {/* Source selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
            Data Source
          </label>
          <select value={source} onChange={(e) => setSource(e.target.value as Source)}
            style={{
              width: "100%", height: 44, padding: "0 12px", borderRadius: 8,
              border: "1px solid #E5EAE6", fontFamily: "var(--font-sans)", fontSize: 14,
              color: "#1A1A1A", background: "#fff", cursor: "pointer", outline: "none",
            }}>
            {SOURCE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#EF4444", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={pageState === "uploading"}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            ...BTN,
            width: "100%",
            background: btnHover ? "#005840" : "#003D31",
            opacity: pageState === "uploading" ? 0.5 : 1,
            cursor: pageState === "uploading" ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}>
          {pageState === "uploading" ? "Uploading..." : "Start Processing"}
        </button>
      </div>

      {/* Previous Uploads */}
      {previousBatches.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: "#1A1A1A", marginBottom: 16 }}>
            Previous Uploads
          </h2>
          <div className="flex flex-col gap-3">
            {previousBatches.map(batch => (
              <div key={batch.id} className="rounded-xl flex items-center justify-between p-4"
                style={{ background: "#fff", border: "1px solid #E5EAE6" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>
                    {batch.file_name ?? "Pasted text"} · {batch.source}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9CA3AF" }}>
                    {batch.total_conversations} conversations · {formatRelative(batch.created_at)}
                  </p>
                </div>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 20,
                  background: batch.status === "completed" ? "#DCFCE7" : batch.status === "failed" ? "#FEE2E2" : "#FEF3C7",
                  color: batch.status === "completed" ? "#166534" : batch.status === "failed" ? "#991B1B" : "#92400E",
                }}>
                  {batch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
