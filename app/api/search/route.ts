import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function callClaude(messages: any[], system: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 200, system, messages }),
  });
  const data = await res.json();
  if (!res.ok || data.type === "error") throw new Error(data?.error?.message || `Erreur API (${res.status})`);
  return (data.content || []).map((b: any) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { query } = await request.json();
  if (!query?.trim()) return NextResponse.json({ error: "Recherche vide." }, { status: 400 });

  const { data: documents } = await supabase
    .from("documents")
    .select("id, name, categorie, analysis")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!documents || documents.length === 0) {
    return NextResponse.json({ found: false });
  }

  const list = documents
    .map((d, i) => `${i}. id=${d.id} | nom=${d.name} | catégorie=${d.categorie} | résumé=${d.analysis?.resume || ""}`)
    .join("\n");

  const raw = await callClaude(
    [{ role: "user", content: `Recherche de l'utilisateur : "${query}"\n\nDocuments disponibles :\n${list}` }],
    "Tu dois trouver le document qui correspond le mieux à la recherche de l'utilisateur. " +
      "Réponds UNIQUEMENT avec un objet JSON, sans texte autour : {\"id\": \"l'id du document trouvé\"} " +
      "ou {\"id\": null} si aucun document ne correspond clairement."
  );

  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    if (parsed.id) return NextResponse.json({ found: true, id: parsed.id });
    return NextResponse.json({ found: false });
  } catch {
    return NextResponse.json({ found: false });
  }
}
