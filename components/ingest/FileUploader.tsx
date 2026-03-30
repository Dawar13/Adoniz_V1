"use client";

import { useState, useRef } from "react";

export function FileUploader() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer"
      style={{
        minHeight: "200px", padding: "32px",
        border: `2px dashed ${dragging ? "var(--adoniz-electric-lime)" : "var(--adoniz-distant-cloud)"}`,
        background: dragging ? "rgba(209,248,67,0.04)" : "#fff",
        transition: "all 0.2s",
      }}
    >
      <input ref={inputRef} type="file" accept=".csv,.json,.txt,.pdf" hidden
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {file ? (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--adoniz-pine)" }}>
          {file.name}
        </p>
      ) : (
        <>
          <span style={{ fontSize: "28px" }}>↑</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--adoniz-pine)" }}>
            Drop a file or click to browse
          </p>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-sans)" }}>
            CSV, JSON, TXT, PDF supported
          </p>
        </>
      )}
    </div>
  );
}
