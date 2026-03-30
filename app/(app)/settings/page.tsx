export const metadata = { title: "Settings — Adoniz" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
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
          Settings
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>
          Manage your account and workspace preferences
        </p>
      </div>
      {/* TODO: AccountForm, OrgForm, DangerZone */}
    </div>
  );
}
