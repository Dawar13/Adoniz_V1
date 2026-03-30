import { FileUploader } from "@/components/ingest/FileUploader";
import { TextPaster } from "@/components/ingest/TextPaster";
import { BatchHistory } from "@/components/ingest/BatchHistory";

export const metadata = { title: "Ingest Data — Adoniz" };

export default function IngestPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "22px",
            color: "var(--adoniz-pine)",
            marginBottom: "4px",
          }}
        >
          Ingest Data
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>
          Upload conversations from any source. Supports CSV, JSON, TXT, and PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUploader />
        <TextPaster />
      </div>

      <BatchHistory />
    </div>
  );
}
