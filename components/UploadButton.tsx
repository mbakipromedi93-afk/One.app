"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      router.push(`/document/${data.id}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Échec de l'envoi du document.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data.reply);
    } catch (e: any) {
      setAnswer(`Erreur : ${e.message}`);
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <button className="upload-cta" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? "Analyse en cours…" : "📤 Envoyer un document"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleAsk} style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="💬 Poser une question à l'IA…"
          style={{ flex: 1, borderRadius: 20 }}
        />
        <button
          type="submit"
          disabled={asking}
          style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40 }}
        >
          {asking ? "…" : "➤"}
        </button>
      </form>
      {answer && (
        <div className="analysis-card" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{answer}</p>
        </div>
      )}
    </>
  );
}
