import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatAboutDocument } from "@/lib/anthropic";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { documentId, message } = await request.json();

  const { data: doc } = await supabase.from("documents").select("*").eq("id", documentId).single();
  if (!doc) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });

  await supabase.from("messages").insert({ document_id: documentId, role: "user", content: message });

  const { data: pastMessages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  const context = doc.analysis
    ? `Résumé du document déjà analysé : ${doc.analysis.resume}. Actions : ${(doc.analysis.actions || []).join("; ")}.`
    : "Aucune analyse disponible.";

  try {
    const reply = await chatAboutDocument(pastMessages || [], context);
    await supabase.from("messages").insert({ document_id: documentId, role: "assistant", content: reply });
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
