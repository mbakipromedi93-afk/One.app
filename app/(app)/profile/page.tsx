"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || "");
      const { data: documents } = await supabase.from("documents").select("status");
      setTotal(documents?.length || 0);
      setResolved(documents?.filter((d) => d.status === "repondu").length || 0);
    }
    load();
  }, []);

  async function handleClearHistory() {
    setDeleting(true);
    try {
      const res = await fetch("/api/documents", { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression.");
      router.refresh();
      router.push("/home");
    } catch (e) {
      alert("Une erreur est survenue lors de la suppression.");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <>
      <header className="top"><h1>Profil</h1></header>
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="doc-name">{email}</p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 26, margin: 0 }}>{total}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>documents analysés</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 26, margin: 0 }}>{resolved}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>démarches résolues</p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              width: "100%",
              background: "none",
              border: "1px solid #E0B4A8",
              color: "var(--clay)",
              borderRadius: 12,
              padding: 13,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            🗑️ Effacer tout l'historique
          </button>
        ) : (
          <div className="card" style={{ borderColor: "var(--clay)" }}>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Cette action supprimera définitivement tous vos documents et analyses. Êtes-vous sûr ?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleClearHistory}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: "var(--clay)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: 11,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {deleting ? "Suppression…" : "Oui, tout effacer"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{ flex: 1, background: "none", border: "1px solid #DDD5C4", borderRadius: 10, padding: 11, fontSize: 13 }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
