'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Entree = { href: string; icone: string; libelle: string }

const ENTREES_CLIENT: Entree[] = [
  { href: '/dashboard', icone: '🏠', libelle: 'Tableau de bord' },
  { href: '/axe1', icone: '🧭', libelle: 'Vision CEO' },
  { href: '/axe2', icone: '💶', libelle: 'Chiffres & Admin' },
  { href: '/axe3', icone: '🎁', libelle: 'Offres & Clients' },
  { href: '/axe4', icone: '📣', libelle: 'Com & Ventes' },
  { href: '/axe5', icone: '⚡', libelle: 'Pilotage 90j' },
  { href: '/audit', icone: '📊', libelle: 'Audit & Prévis.' },
]

const ENTREES_ADMIN: Entree[] = [
  { href: '/clients', icone: '👥', libelle: 'Mon portefeuille' },
]

const ENTREES_COMMUNES: Entree[] = [
  { href: '/historique', icone: '🗂', libelle: 'Historique' },
  { href: '/decisions', icone: '🧠', libelle: 'Décisions' },
  { href: '/bibliotheque', icone: '📚', libelle: 'Bibliothèque' },
]

export function Sidebar({ role }: { role: 'ADMIN' | 'CLIENT' }) {
  const pathname = usePathname()

  const entrees =
    role === 'ADMIN'
      ? [...ENTREES_ADMIN, ...ENTREES_COMMUNES]
      : [...ENTREES_CLIENT, ...ENTREES_COMMUNES]

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-16 hover:w-56 bg-slate-900 flex flex-col
                 items-start overflow-hidden transition-all duration-300 z-50 group"
    >
      <div className="flex items-center gap-3 px-3.5 py-5 w-full">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500
                        flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          P
        </div>
        <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100
                         transition-opacity duration-200 whitespace-nowrap">
          Pilote90
        </span>
      </div>

      <nav className="flex-1 w-full px-2 space-y-0.5 overflow-y-auto">
        {entrees.map((item) => {
          const actif = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={actif ? 'page' : undefined}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium
                          transition-all duration-150 ${
                            actif
                              ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
            >
              <span className="text-base flex-shrink-0 w-5 text-center">{item.icone}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.libelle}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="w-full px-2 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full text-slate-400
                     hover:text-slate-200 hover:bg-white/5 text-sm font-medium transition-all duration-150"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🚪</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  )
}
