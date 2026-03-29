"use client";

export function GradientBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Blob 1 — electric lime, top-left drift */}
      <div
        className="blob-1 absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, rgba(209, 248, 67, 0.13) 0%, transparent 70%)",
          filter: "blur(80px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Blob 2 — cloudy teal, center-right drift */}
      <div
        className="blob-2 absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          top: "20%",
          right: "-8%",
          background: "radial-gradient(circle, rgba(192, 216, 215, 0.18) 0%, transparent 70%)",
          filter: "blur(100px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Blob 3 — fluorescent, bottom-center drift */}
      <div
        className="blob-3 absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          bottom: "5%",
          left: "35%",
          background: "radial-gradient(circle, rgba(240, 255, 61, 0.09) 0%, transparent 70%)",
          filter: "blur(90px)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
