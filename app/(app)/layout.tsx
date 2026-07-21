"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, HistoryIcon, ProfileIcon } from "@/components/Icons";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <div className="shell">
      <div className="content">{children}</div>
      <nav className="bottom-nav">
        <Link href="/home" className={isActive("/home") ? "active" : ""}>
          <HomeIcon />
          <span>Accueil</span>
        </Link>
        <Link href="/history" className={isActive("/history") ? "active" : ""}>
          <HistoryIcon />
          <span>Historique</span>
        </Link>
        <Link href="/profile" className={isActive("/profile") ? "active" : ""}>
          <ProfileIcon />
          <span>Profil</span>
        </Link>
      </nav>
    </div>
  );
}
