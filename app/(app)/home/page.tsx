import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import UploadButton from "@/components/UploadButton";
import Logo from "@/components/Logo";
import TrustBadges from "@/components/TrustBadges";

const STATUS_LABEL: Record<string, string> = { nouveau: "Nouveau", analyse: "Analysé", repondu: "Répondu" };

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const firstName = user?.email?.split("@")[0] ?? "";
  const total = documents?.length ?? 0;
  const resolved = documents?.filter((d) => d.status === "repondu").length ?? 0;

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

      <UploadButton />
      <p className="hint">PDF, JPG ou PNG — courrier, avis, facture, contrat…</p>
      <TrustBadges />

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
