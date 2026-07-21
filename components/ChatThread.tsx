"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = { role: string; content: string };

export default function ChatThread({
  documentId,
  initialMessages,
  initialStatus,
}: {
  documentId: string;
  initialMessages: Message[];
  initialStatus: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Erreur : ${err.message}` }]);
    } finally {
      setSending(false);
    }
  }

  async function markResolved() {
    const supabase = createClient();
    await supabase.from("documents").update({ status: "repondu" }).eq("id", documentId);
    setStatus("repondu");
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {messages.map((m, i) => (
        <div key={i} className={`bubble ${m.role === "user" ? "user" : "ai"}`}>{m.content}</div>
      ))}
      {sending && <div className="bubble ai">One réfléchit…</div>}

      {status !== "repondu" && (
        <button className="btn-ghost" onClick={markResolved} style={{ marginTop: 8 }}>✓ Marquer répondu</button>
      )}

      <div className="chat-input-row">
        <form className="chat-input" onSubmit={sendMessage}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Poser une question sur ce document…" />
          <button type="submit">➤</button>
        </form>
      </div>
    </div>
  );
}
