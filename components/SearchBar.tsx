"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setNotFound(false);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.found && data.id) {
        router.push(`/document/${data.id}`);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setNotFound(false);
          }}
          placeholder="🔍 Retrouve mon bail, ma facture…"
          style={{ flex: 1, borderRadius: 20 }}
        />
        <button
          type="submit"
          disabled={searching}
          style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40 }}
        >
          {searching ? "…" : "➤"}
        </button>
      </form>
      {notFound && (
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
          Aucun document trouvé pour cette recherche.
        </p>
      )}
    </div>
  );
}
