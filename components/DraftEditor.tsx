"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DraftEditor({
  documentId,
  initialDraft,
  analysis,
}: {
  documentId: string;
  initialDraft: string;
  analysis: any;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.from("documents").update({ analysis: { ...analysis, brouillon: draft } }).eq("id", documentId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDownload() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(draft, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lines, 20, 20);
    doc.save("reponse-one.pdf");
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={8}
        style={{
          width: "100%",
          borderRadius: 10,
          border: "1px solid #DDD5C4",
          padding: 12,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 12.5,
          lineHeight: 1.6,
          background: "#fff",
        }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={handleSave} disabled={saving} className="btn-ghost">
          {saving ? "Sauvegarde…" : saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
        <button onClick={handleDownload} className="btn-ghost">⬇ Télécharger en PDF</button>
      </div>
    </div>
  );
}
