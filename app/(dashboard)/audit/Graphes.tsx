'use client'

import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { PointMensuel, PointPrevisionnel } from '@/lib/finance'

const EUROS = (v: number) => `${v.toLocaleString('fr-FR')} €`

/** Recharts passe une valeur de type large aux formateurs d'infobulle. */
const EUROS_INFOBULLE = (v: unknown) =>
  typeof v === 'number' ? EUROS(v) : String(v ?? '')

// Les couleurs SVG acceptent les variables CSS : les graphes suivent donc
// le theme au meme titre que le reste de l'interface.
const AXE = { fontSize: 11, fill: 'var(--p90-ink-faint)' }

const INFOBULLE = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid var(--p90-border)',
    fontSize: 12,
    boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
    background: 'var(--p90-surface)',
  },
  labelStyle: { fontWeight: 600, color: 'var(--p90-ink)' },
}

// ---------------------------------------------------------------------------
// CA vs charges sur douze mois glissants
// ---------------------------------------------------------------------------

export function GrapheCaCharges({ points }: { points: PointMensuel[] }) {
  const [fenetre, setFenetre] = useState<6 | 12>(12)
  const donnees = points.slice(-fenetre)

  return (
    <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-ink-soft">Chiffre d&apos;affaires et charges</h2>
          <p className="text-xs text-ghost mt-0.5">
            {fenetre} derniers mois, montants hors taxes
          </p>
        </div>
        <div className="flex gap-1 bg-surface-muted rounded-lg p-0.5">
          {([6, 12] as const).map((valeur) => (
            <button
              key={valeur}
              onClick={() => setFenetre(valeur)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                fenetre === valeur
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-muted hover:text-ink-soft'
              }`}
            >
              {valeur === 6 ? '6 mois' : '1 an'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={donnees} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="degradeCa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--p90-positive)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--p90-positive)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="degradeCharges" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--p90-negative)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--p90-negative)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--p90-border-faint)" vertical={false} />
            <XAxis dataKey="mois" tick={AXE} tickLine={false} axisLine={false} />
            <YAxis tick={AXE} tickLine={false} axisLine={false} width={64} tickFormatter={EUROS} />
            <Tooltip formatter={EUROS_INFOBULLE} {...INFOBULLE} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
            <Area
              type="monotone" dataKey="ca" name="Chiffre d'affaires"
              stroke="var(--p90-positive)" strokeWidth={2} fill="url(#degradeCa)"
            />
            <Area
              type="monotone" dataKey="charges" name="Charges"
              stroke="var(--p90-negative)" strokeWidth={2} fill="url(#degradeCharges)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Previsionnel a six mois, trois scenarios
// ---------------------------------------------------------------------------

export function GraphePrevisionnel({
  points,
  totaux,
  baseCa,
  baseCharges,
}: {
  points: PointPrevisionnel[]
  totaux: { pessimiste: number; realiste: number; optimiste: number }
  baseCa: number
  baseCharges: number
}) {
  const cartes = [
    { cle: 'pessimiste' as const, titre: 'Scenario pessimiste', detail: 'Encaissements -15 %, charges +5 % par mois', couleur: 'text-negative-ink', bord: 'border-negative' },
    { cle: 'realiste' as const, titre: 'Scenario realiste', detail: 'Encaissements et charges stables', couleur: 'text-positive-ink', bord: 'border-positive ring-1 ring-positive/40' },
    { cle: 'optimiste' as const, titre: 'Scenario optimiste', detail: 'Encaissements +12 %, charges +2 % par mois', couleur: 'text-accent-ink', bord: 'border-accent' },
  ]

  return (
    <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-ink-soft">Previsionnel a six mois</h2>
        <p className="text-xs text-ghost mt-0.5">
          Base de calcul : {baseCa.toLocaleString('fr-FR')} € de chiffre d&apos;affaires
          et {baseCharges.toLocaleString('fr-FR')} € de charges en moyenne mensuelle observee
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {cartes.map((c) => (
          <div key={c.cle} className={`rounded-xl border ${c.bord} p-4`}>
            <p className="text-xs text-muted font-semibold uppercase tracking-wide">{c.titre}</p>
            <p className={`text-2xl font-extrabold mt-1 ${c.couleur}`}>
              {totaux[c.cle].toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-ghost mt-1.5 leading-snug">{c.detail}</p>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--p90-border-faint)" vertical={false} />
            <XAxis dataKey="mois" tick={AXE} tickLine={false} axisLine={false} />
            <YAxis tick={AXE} tickLine={false} axisLine={false} width={64} tickFormatter={EUROS} />
            <Tooltip formatter={EUROS_INFOBULLE} {...INFOBULLE} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
            <Line type="monotone" dataKey="pessimiste" name="Pessimiste" stroke="var(--p90-negative)" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            <Line type="monotone" dataKey="realiste" name="Realiste" stroke="var(--p90-positive)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="optimiste" name="Optimiste" stroke="var(--p90-accent)" strokeWidth={2} dot={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-ghost mt-3 leading-relaxed">
        Le previsionnel fait varier deux parametres : le rythme d&apos;encaissement et
        l&apos;evolution des charges. Il ne donne pas une prevision unique et faussement
        precise, mais une fourchette de trajectoires possibles.
      </p>
    </div>
  )
}
