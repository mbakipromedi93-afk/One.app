import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { nouveau: "Nouveau", analyse: "Analysé", repondu: "Répondu" };

const CATEGORIE_ICON: Record<string, string> = {
  CAF: "📄",
  Banque: "🏦",
  Santé: "🏥",
  Assurance: "🚗",
  Logement: "🏠",
  Études: "📚",
  Contrats: "📑",
  Autre: "📁",
};

export default async function HistoryPage({ searchParams }: { searchParams: { categorie?: string } }) {
  const supabase = createClient();
  const activeCategorie = searchParams?.categorie;

  let query = supabase.from("documents").select("*").order("created_at", { ascending: false });
  if (activeCategorie) query = query.eq("categorie", activeCategorie);
  const { data: documents } = await query;

  const { data: allDocuments } = await supabase.from("documents").select("categorie");
  const categories = Array.from(new Set((allDocuments || []).map((d) => d.categorie || "Autre")));

  return (
    <>
      <header className="top"><h1>Historique</h1></header>

      {categories.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <Link
            href="/history"
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 20,
              border: "1px solid #DDD5C4",
              background: !activeCategorie ? "var(--ink)" : "#FBF8F1",
              color: !activeCategorie ? "#fff" : "#4A4E57",
              textDecoration: "none",
            }}
          >
            Tout
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/history?categorie=${encodeURIComponent(cat)}`}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid #DDD5C4",
                background: activeCategorie === cat ? "var(--ink)" : "#FBF8F1",
                color: activeCategorie === cat ? "#fff" : "#4A4E57",
                textDecoration: "none",
              }}
            >
              {CATEGORIE_ICON[cat] || "📁"} {cat}
            </Link>
          ))}
        </div>
      )}

      {(!documents || documents.length === 0) && (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Vos documents analysés apparaîtront ici.</p>
      )}
      <div className="doc-list">
        {documents?.map((d) => (
          <Link key={d.id} href={`/document/${d.id}`} className="doc-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="doc-name">
                {CATEGORIE_ICON[d.categorie] || "📁"} {d.name}
              </p>
              <p className="doc-sub">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className="stamp">{STATUS_LABEL[d.status] || d.status}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
