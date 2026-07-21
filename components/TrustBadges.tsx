export default function TrustBadges() {
  const items = [
    { icon: "🔒", label: "Documents chiffrés" },
    { icon: "🔐", label: "Données protégées" },
    { icon: "🛡️", label: "Hébergement sécurisé" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
      {items.map((it) => (
        <span
          key={it.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--sage)",
            background: "#EAF0EC",
            border: "1px solid #D8E4DA",
            borderRadius: 20,
            padding: "5px 10px",
          }}
        >
          <span>{it.icon}</span>
          {it.label}
        </span>
      ))}
    </div>
  );
}
