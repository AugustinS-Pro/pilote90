'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard',    icon: '🏠', label: 'Dashboard'         },
  { href: '/axe1',         icon: '🧭', label: 'Vision CEO'        },
  { href: '/axe2',         icon: '💶', label: 'Chiffres & Admin'  },
  { href: '/axe3',         icon: '🎁', label: 'Offres & Clients'  },
  { href: '/axe4',         icon: '📣', label: 'Com & Ventes'      },
  { href: '/axe5',         icon: '⚡', label: 'Pilotage 90j'      },
  { href: '/audit',        icon: '📊', label: 'Audit & Prévis.'   },
  { href: '/historique',   icon: '🗂', label: 'Historique'        },
  { href: '/decisions',    icon: '🧠', label: 'Décisions'         },
  { href: '/bibliotheque', icon: '📚', label: 'Bibliothèque'      },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-16 hover:w-52
                      bg-slate-900 flex flex-col items-start
                      overflow-hidden transition-all duration-300 z-50 group">

      {/* Logo */}
      <div className="flex items-center gap-3 px-3.5 py-5 w-full">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500
                        to-purple-500 flex items-center justify-center
                        text-white font-bold text-base flex-shrink-0">
          P
        </div>
        <span className="text-white font-bold text-sm opacity-0
                         group-hover:opacity-100 transition-opacity
                         duration-200 whitespace-nowrap">
          Pilote90
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full px-2 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg
                          text-sm font-medium transition-all duration-150
                          ${active
                            ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
            >
              <span className="text-base flex-shrink-0 w-5 text-center">
                {item.icon}
              </span>
              <span className="opacity-0 group-hover:opacity-100
                               transition-opacity duration-200 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div className="w-full px-2 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full
                     text-slate-400 hover:text-slate-200 hover:bg-white/5
                     text-sm font-medium transition-all duration-150"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🚪</span>
          <span className="opacity-0 group-hover:opacity-100
                           transition-opacity duration-200 whitespace-nowrap">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  )
}