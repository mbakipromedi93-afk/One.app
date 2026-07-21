export default function ScoreCard({ score, reasons }: { score: number; reasons: string[] }) {
  const color = score >= 90 ? "#5B7F63" : score >= 60 ? "#C08A28" : "#B54834";
  const emoji = score >= 90 ? "🟢" : score >= 60 ? "🟠" : "🔴";

  return (
    <div
      style={{
        background: "var(--ink)",
        borderRadius: 18,
        padding: 18,
        color: "#F6F1E7",
        marginBottom: 18,
      }}
    >
      <p style={{ fontSize: 12, opacity: 0.7, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Score administratif
      </p>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: 36, margin: "4px 0 10px", color }}>
        {emoji} {score}%
      </p>
      {reasons.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, opacity: 0.85, lineHeight: 1.6 }}>
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 12.5, opacity: 0.85, margin: 0 }}>Tout est en ordre, rien à signaler 👍</p>
      )}
    </div>
  );
}
