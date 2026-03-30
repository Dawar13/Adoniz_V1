"use client";

interface Props {
  tags: string[];
  dateFrom: string;
  dateTo: string;
  onTagsChange: (tags: string[]) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
}

export function MetadataForm({ tags, dateFrom, dateTo, onTagsChange, onDateFromChange, onDateToChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>From</label>
          <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)}
            style={{ height: "40px", borderRadius: "8px", padding: "0 12px", border: "1.5px solid var(--adoniz-distant-cloud)", fontFamily: "var(--font-sans)", fontSize: "13px", outline: "none" }} />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>To</label>
          <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)}
            style={{ height: "40px", borderRadius: "8px", padding: "0 12px", border: "1.5px solid var(--adoniz-distant-cloud)", fontFamily: "var(--font-sans)", fontSize: "13px", outline: "none" }} />
        </div>
      </div>
    </div>
  );
}
