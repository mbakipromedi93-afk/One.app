import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: documents } = await supabase.from("documents").select("status");

  return (
    <>
      <header className="top"><h1>Profil</h1></header>
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="doc-name">{user?.email}</p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 26, margin: 0 }}>{documents?.length || 0}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>documents analysés</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 26, margin: 0 }}>
            {documents?.filter((d) => d.status === "repondu").length || 0}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>démarches résolues</p>
        </div>
      </div>
    </>
  );
}
