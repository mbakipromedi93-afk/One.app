import { createClient } from "@/lib/supabase/server";
import DraftEditor from "@/components/DraftEditor";
import ChatThread from "@/components/ChatThread";
import { notFound } from "next/navigation";

const STATUS_LABEL: Record<string, string> = { nouveau: "Nouveau", analyse: "Analysé", repondu: "Répondu" };

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: doc } = await supabase.from("documents").select("*").eq("id", params.id).single();
  if (!doc) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("document_id", params.id)
    .order("created_at", { ascending: true });

  return (
    <>
      <header className="top">
        <div>
          <p className="doc-name">{doc.name}</p>
          <span className="stamp">{STATUS_LABEL[doc.status] || doc.status}</span>
        </div>
      </header>

      {doc.error && <p className="error-text">Impossible d'analyser ce document : {doc.error}</p>}

      {doc.analysis?.urgent && (
        <div
          style={{
            background: "#F4DED8",
            color: "#8A3A24",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          ⚠️ Urgent — action requise rapidement
        </div>
      )}

      {doc.analysis?.date_limite && (
        <div
          style={{
            background: "#FBF3E3",
            color: "#8A6A1F",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          📅 Date limite : {doc.analysis.date_limite}
        </div>
      )}

      {doc.analysis && (
        <div className="analysis-card">
          <p className="analysis-label">✦ Ce que dit le document</p>
          <p>{doc.analysis.resume}</p>
          {doc.analysis.actions?.length > 0 && (
            <>
              <p className="analysis-label">Ce que vous devez faire</p>
              <ul>{doc.analysis.actions.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
            </>
          )}
          {doc.analysis.prochaines_etapes?.length > 0 && (
            <>
              <p className="analysis-label">Prochaines étapes</p>
              <ul>{doc.analysis.prochaines_etapes.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
            </>
          )}
          {doc.analysis.brouillon && (
            <>
              <p className="analysis-label">Brouillon de réponse (modifiable)</p>
              <DraftEditor documentId={doc.id} initialDraft={doc.analysis.brouillon} analysis={doc.analysis} />
            </>
          )}
        </div>
      )}

      <ChatThread documentId={doc.id} initialMessages={messages || []} initialStatus={doc.status} />
    </>
  );
}
