"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    </>
  );
}
