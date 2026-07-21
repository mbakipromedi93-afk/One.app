import "./globals.css";

export const metadata = {
  title: "One — Assistant démarches",
  description: "Votre assistant IA pour comprendre vos documents administratifs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
