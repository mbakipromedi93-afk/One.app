import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeDocument } from "@/lib/anthropic";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });

  const isPdf = file.type === "application/pdf";
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const storagePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, arrayBuffer, {
    contentType: file.type,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({ user_id: user.id, name: file.name, storage_path: storagePath, media_type: file.type, status: "nouveau" })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  try {
    const analysis = await analyzeDocument(base64, file.type, isPdf);
    await supabase.from("documents").update({ analysis, status: "analyse" }).eq("id", doc.id);
  } catch (err: any) {
    await supabase.from("documents").update({ error: err.message, status: "nouveau" }).eq("id", doc.id);
  }

  return NextResponse.json({ id: doc.id });
}
