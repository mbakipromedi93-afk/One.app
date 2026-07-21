import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import UploadButton from "@/components/UploadButton";
import Logo from "@/components/Logo";
import TrustBadges from "@/components/TrustBadges";
import Tips from "@/components/Tips";
import ScoreCard from "@/components/ScoreCard";

const STATUS_LABEL: Record<string, string> = { nouveau: "Nouveau", analyse: "Analysé", repondu: "Répondu" };

function computeScore(documents: any[]) {
  let score = 100;
  const reasons: string[] = [];

  const unresolved = documents.filter((d) => d.status !== "repondu");
  const urgent = documents.filter((d) => d.analysis?.urgent && d.status !== "repondu");
  const failed = documents.filter((d) => d.error);

  if (urgent.length > 0) {
    score -= urgent.length * 15;
    reasons.push(`${urgent.length} document${urgent.length > 1 ? "s" : ""} urgent${urgent.length > 1 ? "s" : ""} en attente`);
  }
  const nonUrgentUnresolved = unresolved.length - urgent.length;
  if (nonUrgentUnresolved > 0) {
    score -= nonUrgentUnresolved * 6;
    reasons.push(`${nonUrgentUnresolved} document${nonUrgentUnresolved > 1 ? "s" : ""} à traiter`);
  }
  if (failed.length > 0) {
    score -= failed.length * 4;
    reasons.push(`${failed.length} document${failed.length > 1 ? "s" : ""} non analysé${failed.length > 1 ? "s" : ""}`);
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reasons };
}

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: allDocuments } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  const documents = allDocuments?.slice(0, 3) ?? [];
  const firstName = user?.email?.split("@")[0] ?? "";
  const total = allDocuments?.length ?? 0;
  const resolved = allDocuments?.filter((d) => d.status === "repondu").length ?? 0;
  const { score, reasons } = computeScore(allDocuments ?? []);

  return (
    <>
      <header className="top">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={30} />
          <div>
            <p className="eyebrow">👋 Bonjour, {firstName}</p>
            <h1 style={{ fontSize: 20 }}>Comment puis-je vous aider ?</h1>
          </div>
        </div>
      </header>

      <ScoreCard score={score} reasons={reasons} />

      <UploadButton />
      <p className="hint">PDF, JPG ou PNG — courrier, avis, facture, contrat…</p>
      <TrustBadges />
      <Tips />

      <div style={{ display: "flex", gap: 12, margin: "22px 0" }}>
        <div className="card" style={{ flex: 1, textAlign: "center", padding: 14 }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: 0, color: "var(--ink)" }}>{total}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>documents analysés</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center", padding: 14 }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: 0, color: "var(--ink)" }}>{resolved}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>démarches résolues</p>
        </div>
      </div>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Derniers documents</h2>
        {(!documents || documents.length === 0) && (
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            Aucun document pour l'instant. Envoyez votre premier courrier pour voir comment One vous aide.
          </p>
        )}
        <div className="doc-list">
          {documents?.map((d) => (
            <Link key={d.id} href={`/document/${d.id}`} className="doc-card">
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="doc-name">{d.name}</p>
                <p className="doc-sub">{d.analysis?.resume?.slice(0, 60) || "Analyse en cours…"}</p>
              </div>
              <span className="stamp">{STATUS_LABEL[d.status] || d.status}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

