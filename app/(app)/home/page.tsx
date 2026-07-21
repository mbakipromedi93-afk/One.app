import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import UploadButton from "@/components/UploadButton";

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

  return (
    <>
      <header className="top">
        <div>
          <p className="eyebrow">Bonjour</p>
          <h1>{firstName}</h1>
        </div>
      </header>

      <UploadButton />
      <p className="hint">PDF, JPG ou PNG — courrier, avis, facture, contrat…</p>

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
