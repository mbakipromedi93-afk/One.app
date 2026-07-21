const SYSTEM_ANALYZE =
  "Tu es One, un assistant qui aide des particuliers en France à comprendre des documents administratifs " +
  "(courriers, avis, factures, contrats). Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni " +
  'après, sans balises markdown, avec exactement ces clés : {"resume": "résumé simple en 2-3 phrases", ' +
  '"actions": ["ce que la personne doit faire, en phrases courtes"], "prochaines_etapes": ["étapes concrètes à venir"], ' +
  '"brouillon": "un brouillon de réponse ou de lettre si pertinent, sinon chaîne vide"}. ' +
  "Utilise un langage simple, sans jargon administratif.";

async function callClaude(messages: any[], system: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 1500, system, messages }),
  });

  const data = await res.json();
  if (!res.ok || data.type === "error") {
    throw new Error(data?.error?.message || `Erreur API (${res.status})`);
  }
  const text = (data.content || []).map((b: any) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
  if (!text) throw new Error("Réponse de l'IA vide.");
  return text;
}

export async function analyzeDocument(base64: string, mediaType: string, isPdf: boolean) {
  const contentBlock = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
    : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } };

  const raw = await callClaude(
    [{ role: "user", content: [contentBlock, { type: "text", text: "Analyse ce document." }] }],
    SYSTEM_ANALYZE
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { resume: raw, actions: [], prochaines_etapes: [], brouillon: "" };
  }
}

export async function chatAboutDocument(history: { role: string; content: string }[], analysisContext: string) {
  return callClaude(
    history,
    `Tu es One, assistant pour démarches administratives en France. Contexte du document : ${analysisContext} ` +
      "Réponds en français, simplement et en une réponse courte et concrète."
  );
}
