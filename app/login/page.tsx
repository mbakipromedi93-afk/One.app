"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { error } = mode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <div className="shell" style={{ justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32 }}>One</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Votre assistant pour les démarches administratives.</p>
      </div>
      <form className="card" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </button>
        {error && <p className="error-text">{error}</p>}
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            style={{ background: "none", border: "none", color: "var(--ink)", textDecoration: "underline" }}
          >
            {mode === "signup" ? "J'ai déjà un compte" : "Créer un compte"}
          </button>
        </p>
      </form>
    </div>
  );
}
