import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function RemindersWidget() {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];
  const inTenDays = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: rappels } = await supabase
    .from("rappels")
    .select("*, documents(id)")
    .gte("date_rappel", today)
    .lte("date_rappel", inTenDays)
    .order("date_rappel", { ascending: true });

  if (!rappels || rappels.length === 0) return null;

  return (
    <div style={{ marginBottom: 18 }}>
      {rappels.map((r: any) => (
        <Link
          key={r.id}
          href={`/document/${r.document_id}`}
          style={{
            display: "block",
            background: "#FBF3E3",
            color: "#8A6A1F",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
            textDecoration: "none",
          }}
        >
          📅 {r.message}
        </Link>
      ))}
    </div>
  );
}
