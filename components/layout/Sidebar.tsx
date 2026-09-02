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
  { href: '/parametres', icone: '⚙️', libelle: 'Paramètres' },
]

export function Sidebar({ role }: { role: 'ADMIN' | 'CLIENT' }) {
  const pathname = usePathname()

  const entrees =
    role === 'ADMIN'
      ? [...ENTREES_ADMIN, ...ENTREES_COMMUNES]
      : [...ENTREES_CLIENT, ...ENTREES_COMMUNES]

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-16 hover:w-56 bg-inverse flex flex-col
                 items-start overflow-hidden transition-all duration-300 z-50 group"
    >
      <div className="flex items-center gap-3 px-3.5 py-5 w-full">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-alt
                        flex items-center justify-center text-on-accent font-bold text-base flex-shrink-0">
          P
        </div>
        <span className="text-on-inverse font-bold text-sm opacity-0 group-hover:opacity-100
                         transition-opacity duration-200 whitespace-nowrap">
          Pilote90
        </span>
      </div>

      {/*
        Les libelles restent dans le flux meme replies — ils ne sont
        qu'en opacite zero — donc le contenu est plus large que les 4 rem de
        la barre repliee. Or des qu'un axe passe en `auto`, l'autre cesse
        d'etre `visible` : sans `overflow-x-hidden`, une barre de defilement
        horizontale apparaissait en bas de la barre laterale.
      */}
      <nav className="flex-1 w-full px-2 space-y-0.5 overflow-y-auto overflow-x-hidden barre-discrete">
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
                              ? 'bg-accent/20 text-accent border-l-2 border-accent'
                              : 'text-ghost hover:text-on-inverse hover:bg-surface/5'
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
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full text-ghost
                     hover:text-on-inverse hover:bg-surface/5 text-sm font-medium transition-all duration-150"
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
