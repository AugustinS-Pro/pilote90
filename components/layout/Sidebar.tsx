'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { peut, type Acces } from '@/lib/habilitations'

type Entree = { href: string; icone: string; libelle: string; acces: Acces }

/**
 * Une seule liste, ordonnee, et c'est l'habilitation qui decide de ce qui
 * s'affiche. Il n'y a plus une liste par role : ajouter une formule ne
 * demandera pas de toucher a ce fichier.
 */
const ENTREES: Entree[] = [
  { href: '/dashboard', icone: '🏠', libelle: 'Tableau de bord', acces: 'TABLEAU_DE_BORD' },
  { href: '/axe1', icone: '🧭', libelle: 'Vision CEO', acces: 'AXE_VISION' },
  { href: '/axe2', icone: '💶', libelle: 'Chiffres & Admin', acces: 'AXE_CHIFFRES' },
  { href: '/axe3', icone: '🎁', libelle: 'Offres & Clients', acces: 'AXE_OFFRES' },
  { href: '/axe4', icone: '📣', libelle: 'Com & Ventes', acces: 'AXE_COMMUNICATION' },
  { href: '/axe5', icone: '⚡', libelle: 'Pilotage 90j', acces: 'AXE_PILOTAGE' },
  { href: '/audit', icone: '📊', libelle: 'Audit & Prévis.', acces: 'AUDIT_PERSONNEL' },
  { href: '/clients', icone: '👥', libelle: 'Mon portefeuille', acces: 'PORTEFEUILLE_CONSULTER' },
  { href: '/historique', icone: '🗂', libelle: 'Historique', acces: 'PAGES_TRANSVERSES' },
  { href: '/decisions', icone: '🧠', libelle: 'Décisions', acces: 'PAGES_TRANSVERSES' },
  { href: '/bibliotheque', icone: '📚', libelle: 'Bibliothèque', acces: 'PAGES_TRANSVERSES' },
  { href: '/parametres', icone: '⚙️', libelle: 'Paramètres', acces: 'PARAMETRES' },
]

export function Sidebar({ role }: { role: 'ADMIN' | 'CLIENT' }) {
  const pathname = usePathname()
  const [ouvertMobile, setOuvertMobile] = useState(false)

  const entrees = ENTREES.filter((entree) => peut({ role }, entree.acces))

  /**
   * Deux comportements pour une seule barre.
   *
   * Au dela de 768 pixels : colonne fixe de 4 rem qui se deplie au survol,
   * comme avant. En dessous : tiroir masque hors ecran, appele par un bouton
   * de la barre du haut. Le survol n'existe pas sur un ecran tactile, ou il
   * se comporte comme un clic qui reste colle.
   */
  const positionMobile = ouvertMobile ? 'translate-x-0' : '-translate-x-full'

  return (
    <>
      {/* Barre du haut, mobile uniquement */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-inverse
                         flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-alt
                          flex items-center justify-center text-on-accent font-bold text-sm">
            P
          </div>
          <span className="text-on-inverse font-bold text-sm">Pilote90</span>
        </div>
        <button
          type="button"
          onClick={() => setOuvertMobile(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={ouvertMobile}
          className="w-10 h-10 -mr-2 rounded-lg flex items-center justify-center
                     text-on-inverse hover:bg-surface/10 transition-colors"
        >
          <span aria-hidden className="text-lg leading-none">☰</span>
        </button>
      </header>

      {/* Voile, pour fermer le tiroir en touchant a cote */}
      {ouvertMobile && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOuvertMobile(false)}
          className="md:hidden fixed inset-0 z-40 bg-inverse/50"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-inverse flex flex-col items-start
                    overflow-hidden transition-all duration-300 group
                    w-64 ${positionMobile}
                    md:w-16 md:hover:w-56 md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-3.5 py-5 w-full">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-alt
                          flex items-center justify-center text-on-accent font-bold text-base flex-shrink-0">
            P
          </div>
          <span className="text-on-inverse font-bold text-sm whitespace-nowrap
                           transition-opacity duration-200
                           md:opacity-0 md:group-hover:opacity-100">
            Pilote90
          </span>
          <button
            type="button"
            onClick={() => setOuvertMobile(false)}
            aria-label="Fermer le menu"
            className="md:hidden ml-auto text-ghost hover:text-on-inverse text-sm px-2"
          >
            ✕
          </button>
        </div>

        {/*
          Les libelles restent dans le flux meme replies, ils ne sont qu'en
          opacite zero, donc le contenu est plus large que les 4 rem de la
          barre repliee. Or des qu'un axe passe en `auto`, l'autre cesse
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
                onClick={() => setOuvertMobile(false)}
                aria-current={actif ? 'page' : undefined}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium
                            transition-all duration-150 ${
                              actif
                                ? 'bg-accent/20 text-accent border-l-2 border-accent'
                                : 'text-ghost hover:text-on-inverse hover:bg-surface/5'
                            }`}
              >
                <span className="text-base flex-shrink-0 w-5 text-center">{item.icone}</span>
                <span className="whitespace-nowrap transition-opacity duration-200
                                 md:opacity-0 md:group-hover:opacity-100">
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
            <span className="whitespace-nowrap transition-opacity duration-200
                             md:opacity-0 md:group-hover:opacity-100">
              Déconnexion
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
