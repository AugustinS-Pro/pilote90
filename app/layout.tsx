import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { affichageActif } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pilote90 · Pilotage stratégique",
  description: "Pilotez votre activité par cycles de 90 jours. Vision, chiffres, offres, communication et plan d'action en un seul endroit.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Les reglages d'affichage sont resolus cote serveur : la page arrive deja
  // dans les bonnes couleurs et a la bonne taille, sans le clignotement d'un
  // basculement apres hydratation.
  const { theme, echelle } = await affichageActif();

  return (
    <html
      lang="fr"
      data-theme={theme}
      data-echelle={String(echelle)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
