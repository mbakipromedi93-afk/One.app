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
          <p style={{ fontFamily: "
