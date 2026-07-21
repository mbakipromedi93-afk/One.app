const TIPS = [
  "📅 Gardez toujours une copie de vos courriers administratifs pendant au moins 5 ans.",
  "⏰ Un courrier avec date limite ? Répondez dans les 48h pour éviter les relances.",
  "📎 Scannez vos documents importants (CNI, RIB, justificatifs) pour les avoir sous la main.",
  "✉️ En cas de doute sur un courrier, mieux vaut appeler l'organisme que d'ignorer le courrier.",
];

export default function Tips() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  return (
    <div
      style={{
        background: "#FBF8F1",
        border: "1px dashed #DDD5C4",
        borderRadius: 14,
        padding: 14,
        fontSize: 13,
        color: "#4A4E57",
        marginTop: 18,
      }}
    >
      {tip}
    </div>
  );
}
