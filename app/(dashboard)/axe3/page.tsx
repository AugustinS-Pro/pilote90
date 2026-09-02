import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { euros } from '@/lib/format'
import {
  SectionPersona, SectionOffres, SectionArchitecture, SectionClients, SectionRetours,
  type PersonaVue, type OffreVue, type NiveauVue, type FicheVue, type RetourVue,
} from './Sections'

const dateFr = (v: Date | null) => (v ? new Date(v).toLocaleDateString('fr-FR') : null)

export default async function Axe3Page() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const client =
    utilisateur.role === 'CLIENT'
      ? await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            personas: { orderBy: { createdAt: 'asc' } },
            offers: { orderBy: { createdAt: 'asc' }, include: { persona: { select: { name: true } } } },
            offerLevels: { orderBy: { position: 'asc' } },
            crmClients: { orderBy: { createdAt: 'desc' } },
            purchases: true,
            feedbacks: {
              orderBy: { createdAt: 'desc' },
              include: {
                crmClient: { select: { companyName: true } },
                offer: { select: { name: true } },
              },
            },
          },
        })
      : null

  if (!client) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Offres &amp; Clients</h1>
        <p className="text-sm text-muted">
          Cet axe appartient a l&apos;espace des entrepreneurs accompagnes.
        </p>
      </div>
    )
  }

  // --- Agregations : rien de tout cela n'est stocke -------------------------

  const achatsParOffre = new Map<string, { nombre: number; total: number }>()
  const achatsParClient = new Map<string, { nombre: number; total: number; dernier: Date | null }>()

  for (const a of client.purchases) {
    if (a.offerId) {
      const courant = achatsParOffre.get(a.offerId) ?? { nombre: 0, total: 0 }
      achatsParOffre.set(a.offerId, { nombre: courant.nombre + 1, total: courant.total + a.amountHt })
    }
    const c = achatsParClient.get(a.crmClientId) ?? { nombre: 0, total: 0, dernier: null }
    achatsParClient.set(a.crmClientId, {
      nombre: c.nombre + 1,
      total: c.total + a.amountHt,
      dernier: !c.dernier || a.purchasedAt > c.dernier ? a.purchasedAt : c.dernier,
    })
  }

  const personas: PersonaVue[] = client.personas.map((p) => ({
    id: p.id, name: p.name, dailyLife: p.dailyLife, frustrations: p.frustrations,
    desires: p.desires, objections: p.objections, transformation: p.transformation,
    magicSentence: p.magicSentence,
  }))

  const offres: OffreVue[] = client.offers.map((o) => {
    const agg = achatsParOffre.get(o.id) ?? { nombre: 0, total: 0 }
    return {
      id: o.id, name: o.name, promise: o.promise, priceHt: o.priceHt,
      format: o.format, status: o.status,
      personaNom: o.persona?.name ?? null,
      ventes: agg.nombre, caGenere: agg.total,
    }
  })

  const niveaux: NiveauVue[] = client.offerLevels.map((n) => ({
    id: n.id, level: n.level, offerName: n.offerName, price: n.price, goal: n.goal,
  }))

  const fiches: FicheVue[] = client.crmClients.map((f) => {
    const agg = achatsParClient.get(f.id) ?? { nombre: 0, total: 0, dernier: null }
    return {
      id: f.id, companyName: f.companyName, contactName: f.contactName,
      email: f.email, phone: f.phone, status: f.status, notes: f.notes,
      totalAchats: agg.total, nombreAchats: agg.nombre, dernierAchat: dateFr(agg.dernier),
    }
  })

  const retours: RetourVue[] = client.feedbacks.map((r) => ({
    id: r.id, rating: r.rating, comment: r.comment,
    createdAt: new Date(r.createdAt).toLocaleDateString('fr-FR'),
    clientNom: r.crmClient?.companyName ?? null,
    offreNom: r.offer?.name ?? null,
  }))

  const moyenne =
    client.feedbacks.length > 0
      ? client.feedbacks.reduce((s, f) => s + f.rating, 0) / client.feedbacks.length
      : null

  const offresActives = client.offers.filter((o) => o.status === 'ACTIF').length
  const caCatalogue = client.purchases.reduce((s, a) => s + a.amountHt, 0)
  const clientsActifs = client.crmClients.filter((f) => f.status === 'ACTIF').length

  const kpis = [
    { titre: 'Offres actives', valeur: String(offresActives), detail: `sur ${client.offers.length} au catalogue`, couleur: 'text-accent-ink' },
    { titre: 'Clients actifs', valeur: String(clientsActifs), detail: `sur ${client.crmClients.length} fiches`, couleur: 'text-positive' },
    { titre: 'CA du catalogue', valeur: euros(caCatalogue), detail: `${client.purchases.length} achat${client.purchases.length > 1 ? 's' : ''} enregistre${client.purchases.length > 1 ? 's' : ''}`, couleur: 'text-accent-ink' },
    { titre: 'Satisfaction', valeur: moyenne !== null ? `${moyenne.toFixed(1)} / 5` : '—', detail: `${client.feedbacks.length} retour${client.feedbacks.length > 1 ? 's' : ''}`, couleur: 'text-warning' },
  ]

  return (
    <div className="p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Offres &amp; Clients</h1>
        <p className="text-muted text-sm mt-1">
          Votre catalogue, vos clients et ce que chaque offre rapporte reellement
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titre} className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">{k.titre}</p>
            <p className={`text-2xl font-extrabold ${k.couleur}`}>{k.valeur}</p>
            <p className="text-[11px] text-ghost mt-1.5">{k.detail}</p>
          </div>
        ))}
      </div>

      <SectionPersona personas={personas} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SectionOffres offres={offres} personas={personas} />
        <SectionArchitecture niveaux={niveaux} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SectionClients fiches={fiches} offres={offres} />
        <SectionRetours retours={retours} fiches={fiches} offres={offres} moyenne={moyenne} />
      </div>
    </div>
  )
}
