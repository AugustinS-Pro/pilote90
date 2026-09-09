import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
import { euros } from '@/lib/format'
import {
  SectionProblemes, SectionThematiques, SectionCalendrier, SectionPipeline,
  type ProblemeVue, type ThematiqueVue, type IdeeVue, type ProspectVue,
} from './Sections'

export default async function Axe4Page() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  // Sans l'habilitation, l'URL n'est pas la sienne : on le ramene chez lui
  // plutot que de lui afficher une page vide.
  if (!peut(utilisateur, 'AXE_COMMUNICATION')) redirect(pageAccueil(utilisateur))

  const client = await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            clientProblems: { orderBy: { position: 'asc' } },
            contentThemes: { orderBy: { position: 'asc' }, include: { _count: { select: { ideas: true } } } },
            contentIdeas: {
              orderBy: { createdAt: 'asc' },
              include: { theme: { select: { label: true } } },
            },
            prospects: { orderBy: { updatedAt: 'desc' } },
          },
        })

  if (!client) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Communication &amp; Ventes</h1>
        <p className="text-sm text-muted">
          Cet axe appartient a l&apos;espace des entrepreneurs accompagnes.
        </p>
      </div>
    )
  }

  const problemes: ProblemeVue[] = client.clientProblems.map((p) => ({
    id: p.id, problem: p.problem, question: p.question,
    understanding: p.understanding, topic: p.topic, angle: p.angle,
  }))

  const thematiques: ThematiqueVue[] = client.contentThemes.map((t) => ({
    id: t.id, label: t.label, whyImportant: t.whyImportant,
    linkToOffer: t.linkToOffer, nombreIdees: t._count.ideas,
  }))

  const idees: IdeeVue[] = client.contentIdeas.map((i) => ({
    id: i.id, subject: i.subject, themeLabel: i.theme?.label ?? null,
    contentType: i.contentType, format: i.format, platform: i.platform,
    marketingGoal: i.marketingGoal, weekNumber: i.weekNumber, status: i.status,
  }))

  const prospects: ProspectVue[] = client.prospects.map((p) => ({
    id: p.id, companyName: p.companyName, contactName: p.contactName,
    estimatedHt: p.estimatedHt, source: p.source, stage: p.stage,
    echeance: p.expectedCloseDate ? new Date(p.expectedCloseDate).toLocaleDateString('fr-FR') : null,
    notes: p.notes,
  }))

  // --- Indicateurs, tous calcules ------------------------------------------

  const enCours = client.prospects.filter((p) => p.stage !== 'SIGNE')
  const signes = client.prospects.filter((p) => p.stage === 'SIGNE')

  const caPotentiel = enCours.reduce((s, p) => s + p.estimatedHt, 0)
  const tauxConversion =
    client.prospects.length > 0 ? Math.round((signes.length / client.prospects.length) * 100) : 0

  const debutDuMois = new Date()
  debutDuMois.setDate(1)
  debutDuMois.setHours(0, 0, 0, 0)
  const signesDuMois = signes.filter((p) => new Date(p.updatedAt) >= debutDuMois).length

  const kpis = [
    { titre: 'Prospects actifs', valeur: String(enCours.length), detail: 'dans le pipeline', couleur: 'text-accent-ink' },
    { titre: 'Taux de conversion', valeur: `${tauxConversion} %`, detail: `${signes.length} signe${signes.length > 1 ? 's' : ''} sur ${client.prospects.length}`, couleur: 'text-positive' },
    { titre: 'CA potentiel', valeur: euros(caPotentiel), detail: 'en cours de vente', couleur: 'text-accent-ink' },
    { titre: 'Signatures ce mois', valeur: String(signesDuMois), detail: 'nouvelles missions', couleur: 'text-warning' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Communication &amp; Ventes</h1>
        <p className="text-muted text-sm mt-1">
          Ce que vous dites, a qui, et ou en sont vos opportunites
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titre} className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">{k.titre}</p>
            <p className={`text-2xl font-extrabold ${k.couleur}`}>{k.valeur}</p>
            <p className="text-[11px] text-ghost mt-1.5">{k.detail}</p>
          </div>
        ))}
      </div>

      <SectionPipeline prospects={prospects} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SectionProblemes problemes={problemes} />
        <SectionThematiques thematiques={thematiques} />
      </div>

      <SectionCalendrier idees={idees} thematiques={thematiques} />
    </div>
  )
}
