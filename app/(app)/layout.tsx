import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <div className="content">{children}</div>
      <nav className="bottom-nav">
        <Link href="/home">🏠<span>Accueil</span></Link>
        <Link href="/history">🕒<span>Historique</span></Link>
        <Link href="/profile">👤<span>Profil</span></Link>
      </nav>
    </div>
  );
}
