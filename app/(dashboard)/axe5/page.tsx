import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
import {
  SectionCycle, SectionPlanMensuel, SectionSemaines, SectionTaches,
  type CycleVue, type PlanMoisVue, type SemaineVue, type TacheVue, type PrioriteVue,
} from './Sections'

const JOUR = 86400000
const dateFr = (v: Date | null) => (v ? new Date(v).toLocaleDateString('fr-FR') : null)

export default async function Axe5Page() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  // Sans l'habilitation, l'URL n'est pas la sienne : on le ramene chez lui
  // plutot que de lui afficher une page vide.
  if (!peut(utilisateur, 'AXE_PILOTAGE')) redirect(pageAccueil(utilisateur))

  const client = await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            cycles: {
              where: { status: 'ACTIVE' },
              take: 1,
              include: {
                weeks: { orderBy: { weekNumber: 'asc' }, include: { review: true } },
                objectives: { orderBy: { rank: 'asc' } },
                monthlyPlans: { orderBy: { monthNumber: 'asc' } },
              },
            },
            transactions: { where: { type: 'REVENUE' } },
            tasks: { orderBy: [{ done: 'asc' }, { position: 'asc' }], include: { objective: { select: { title: true } } } },
          },
        })

  if (!client) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Pilotage 90 jours</h1>
        <p className="text-sm text-muted">
          Cet axe appartient a l&apos;espace des entrepreneurs accompagnes.
        </p>
      </div>
    )
  }

  const cycle = client.cycles[0] ?? null
  const aujourdhui = new Date()

  let vueCycle: CycleVue | null = null
  let semaines: SemaineVue[] = []
  let plans: PlanMoisVue[] = []
  let priorites: PrioriteVue[] = []

  if (cycle) {
    const debut = new Date(cycle.startDate)
    const fin = new Date(cycle.endDate)

    const semaineCourante = Math.min(
      12,
      Math.max(1, Math.ceil((aujourdhui.getTime() - debut.getTime()) / (7 * JOUR))),
    )

    // CA realise : somme des revenus tombant dans la fenetre du cycle.
    const caRealise = client.transactions
      .filter((t) => {
        const d = new Date(t.transactionDate)
        return d >= debut && d <= fin
      })
      .reduce((s, t) => s + t.amountHt, 0)

    vueCycle = {
      id: cycle.id,
      cycleNumber: cycle.cycleNumber,
      name: cycle.name,
      mainObjective: cycle.mainObjective,
      caTargetMonthly: cycle.caTargetMonthly,
      caRealise,
      debut: debut.toLocaleDateString('fr-FR'),
      fin: fin.toLocaleDateString('fr-FR'),
      semaineCourante,
      status: cycle.status,
    }

    semaines = cycle.weeks.map((w) => ({
      id: w.id,
      weekNumber: w.weekNumber,
      debut: dateFr(w.startDate),
      focusTitle: w.focusTitle,
      revue: w.review
        ? { whatWorks: w.review.whatWorks, whatBlocks: w.review.whatBlocks, adjustments: w.review.adjustments }
        : null,
      estCourante: w.weekNumber === semaineCourante,
    }))

    plans = [1, 2, 3].map((n) => {
      const p = cycle.monthlyPlans.find((m) => m.monthNumber === n)
      return {
        monthNumber: n,
        theme: p?.theme ?? null,
        caTargetHt: p?.caTargetHt ?? 0,
        notes: p?.notes ?? null,
      }
    })

    priorites = cycle.objectives.map((o) => ({
      id: o.id, title: o.title, progressPct: o.progressPct, rank: o.rank,
    }))
  }

  const taches: TacheVue[] = client.tasks.map((t) => ({
    id: t.id,
    label: t.label,
    tag: t.tag,
    done: t.done,
    echeance: dateFr(t.dueDate),
    prioriteTitre: t.objective?.title ?? null,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Pilotage 90 jours</h1>
        <p className="text-muted text-sm mt-1">
          Le cockpit : du cap trimestriel jusqu&apos;a la tache du jour
        </p>
      </div>

      <SectionCycle cycle={vueCycle} />

      <SectionTaches taches={taches} priorites={priorites} />

      {vueCycle && (
        <>
          <SectionPlanMensuel cycleId={vueCycle.id} plans={plans} />
          <SectionSemaines semaines={semaines} />
        </>
      )}
    </div>
  )
}
