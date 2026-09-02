import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import {
  calculerIndicateurs, serieDouzeMois, calculerPrevisionnel,
  auditerFinances, messageDeSituation,
} from '@/lib/finance'
import { GrapheCaCharges, GraphePrevisionnel } from './Graphes'
import { FormulairesTransaction } from '../axe2/FormulairesTransaction'

const euros = (centimes: number) =>
  `${(centimes / 100).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`

const STYLE_NIVEAU = {
  ALERTE: { pastille: 'bg-red-500', fond: 'bg-red-50 border-red-200', texte: 'text-red-800', libelle: 'Alerte' },
  ATTENTION: { pastille: 'bg-amber-500', fond: 'bg-amber-50 border-amber-200', texte: 'text-amber-800', libelle: 'Attention' },
  ANALYSE: { pastille: 'bg-indigo-500', fond: 'bg-indigo-50 border-indigo-200', texte: 'text-indigo-800', libelle: 'Analyse' },
} as const

export default async function AuditPage() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const client =
    utilisateur.role === 'CLIENT'
      ? await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            transactions: { orderBy: { transactionDate: 'desc' } },
            cycles: { where: { status: 'ACTIVE' }, take: 1 },
          },
        })
      : null

  if (!client) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Audit &amp; Previsionnel</h1>
        <p className="text-sm text-slate-500">
          Cet espace est celui des entrepreneurs accompagnes. Depuis un compte administrateur,
          ouvrez l&apos;audit d&apos;un client depuis votre portefeuille.
        </p>
      </div>
    )
  }

  const transactions = client.transactions
  const cycle = client.cycles[0]

  const indicateurs = calculerIndicateurs(transactions, cycle?.caTargetMonthly ?? 0)
  const historique = serieDouzeMois(transactions)
  const previsionnel = calculerPrevisionnel(transactions)
  const constats = auditerFinances(indicateurs, previsionnel, transactions.length)
  const situation = messageDeSituation(constats)

  const bandeau =
    situation.ton === 'ALERTE'
      ? 'bg-red-50 border-red-200 text-red-800'
      : situation.ton === 'ATTENTION'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-teal-50 border-teal-200 text-teal-800'

  const kpis = [
    { titre: 'Tresorerie', valeur: euros(indicateurs.tresorerie), formule: 'Encaissements moins decaissements depuis le debut', couleur: indicateurs.tresorerie >= 0 ? 'text-teal-600' : 'text-red-500' },
    { titre: 'CA du mois', valeur: euros(indicateurs.caDuMois), formule: 'Somme des revenus rattaches au mois en cours', couleur: 'text-teal-600' },
    { titre: 'Charges du mois', valeur: euros(indicateurs.chargesDuMois), formule: `Somme des charges du mois — ratio ${indicateurs.ratioCharges} % du CA`, couleur: 'text-red-500' },
    { titre: 'Resultat net', valeur: euros(indicateurs.resultatNet), formule: 'CA du mois moins charges du mois', couleur: indicateurs.resultatNet >= 0 ? 'text-indigo-600' : 'text-red-500' },
  ]

  return (
    <div className="p-8 w-full space-y-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Audit &amp; Previsionnel</h1>
          <p className="text-slate-500 text-sm mt-1">
            {client.companyName} — support de travail des seances d&apos;accompagnement
          </p>
        </div>
        <a
          href="/audit/export"
          className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200
                     bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          Exporter pour le comptable (CSV)
        </a>
      </div>

      <div className={`rounded-2xl border px-5 py-4 ${bandeau}`}>
        <p className="font-semibold text-sm">{situation.texte}</p>
        <p className="text-xs mt-0.5 opacity-80">
          {constats.length} constat{constats.length > 1 ? 's' : ''} issu
          {constats.length > 1 ? 's' : ''} de l&apos;audit automatique
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titre} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">{k.titre}</p>
            <p className={`text-2xl font-extrabold ${k.couleur}`}>{k.valeur}</p>
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">{k.formule}</p>
          </div>
        ))}
      </div>

      <GrapheCaCharges points={historique} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormulairesTransaction />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-1">Audit financier automatique</h2>
          <p className="text-xs text-slate-400 mb-4">
            Chaque constat indique la regle qui l&apos;a declenche.
          </p>

          {constats.length > 0 ? (
            <div className="space-y-2.5">
              {constats.map((c, i) => {
                const s = STYLE_NIVEAU[c.niveau]
                return (
                  <div key={i} className={`rounded-xl border ${s.fond} px-4 py-3`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.pastille}`} />
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${s.texte}`}>
                        {s.libelle}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${s.texte}`}>{c.titre}</p>
                    <p className={`text-sm ${s.texte} opacity-90`}>{c.valeur}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{c.regle}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              Aucun signal a signaler sur la periode.
            </p>
          )}
        </div>
      </div>

      <GraphePrevisionnel
        points={previsionnel.points}
        totaux={previsionnel.totaux}
        baseCa={previsionnel.baseCa}
        baseCharges={previsionnel.baseCharges}
      />
    </div>
  )
}
