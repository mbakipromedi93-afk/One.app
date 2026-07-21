import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askGeneral } from "@/lib/anthropic";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { message } = await request.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message vide." }, { status: 400 });

  try {
    const reply = await askGeneral([{ role: "user", content: message }]);
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
