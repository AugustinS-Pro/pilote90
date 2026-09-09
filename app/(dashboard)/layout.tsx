import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { getCurrentUser } from '@/lib/session'
import { accesDe } from '@/lib/habilitations'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  return (
    <div className="flex min-h-screen bg-canvas">
      {/*
        Lien d'evitement : premier element focalisable de la page, invisible
        jusqu'a ce qu'il recoive le focus. Sans lui, une navigation au clavier
        traverse les douze entrees du menu avant d'atteindre le contenu, sur
        chaque page.
      */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]
                   focus:px-4 focus:py-2 focus:rounded-lg focus:bg-inverse focus:text-on-inverse
                   focus:text-sm focus:font-semibold"
      >
        Aller au contenu
      </a>
      <Sidebar acces={accesDe(utilisateur)} />
      {/* Marge a gauche sur grand ecran, sous la barre du haut sur mobile. */}
      <main id="contenu" tabIndex={-1} className="flex-1 min-w-0 pt-14 md:pt-0 md:ml-16">{children}</main>
    </div>
  )
}
