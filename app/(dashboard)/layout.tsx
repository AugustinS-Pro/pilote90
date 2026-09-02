import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { getCurrentUser } from '@/lib/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar role={utilisateur.role} />
      {/* Marge a gauche sur grand ecran, sous la barre du haut sur mobile. */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0 md:ml-16">{children}</main>
    </div>
  )
}
