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
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <Sidebar role={utilisateur.role} />
      <main className="flex-1 ml-16 min-w-0">{children}</main>
    </div>
  )
}
