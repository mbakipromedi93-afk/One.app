import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { nouveau: "Nouveau", analyse: "Analysé", repondu: "Répondu" };

export default async function HistoryPage() {
  const supabase = createClient();
  const { data: documents } = await supabase.from("documents").select("*").order("created_at", { ascending: false });

  return (
    <>
      <header className="top"><h1>Historique</h1></header>
      {(!documents || documents.length === 0) && (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Vos documents analysés apparaîtront ici.</p>
      )}
      <div className="doc-list">
        {documents?.map((d) => (
          <Link key={d.id} href={`/document/${d.id}`} className="doc-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="doc-name">{d.name}</p>
              <p className="doc-sub">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className="stamp">{STATUS_LABEL[d.status] || d.status}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
