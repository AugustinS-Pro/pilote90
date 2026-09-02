import Link from 'next/link'

export const metadata = {
  title: 'Mentions légales et protection des données — Pilote90',
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface rounded-2xl border border-subtle shadow-sm p-6">
      <h2 className="text-sm font-bold text-ink-soft mb-3">{titre}</h2>
      <div className="text-sm text-muted leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-canvas py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <Link href="/dashboard" className="text-xs text-muted hover:text-ink-soft">
            ← Retour à l&apos;application
          </Link>
          <h1 className="text-2xl font-extrabold text-ink mt-2">
            Mentions légales et protection des données
          </h1>
          <p className="text-sm text-muted mt-1">
            Pilote90 traite des données financières. Voici lesquelles, pourquoi, et ce que vous
            pouvez exiger à leur sujet.
          </p>
        </div>

        <Section titre="Éditeur">
          <p>
            Pilote90 est développé pour <strong>Pilote et Vous</strong>, cabinet de conseil en
            stratégie et organisation pour TPE et solopreneurs, établi à Bois-Grenier (Nord).
          </p>
          <p>Responsable de la publication : Alexis Charlet.</p>
        </Section>

        <Section titre="Données traitées">
          <p>L&apos;application enregistre uniquement ce que vous y saisissez :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>votre compte : nom, adresse électronique, mot de passe (jamais stocké en clair) ;</li>
            <li>votre activité : cycles, priorités, décisions, idées ;</li>
            <li>vos flux financiers : revenus, charges, échéances administratives ;</li>
            <li>vos offres, vos fiches clients, vos prospects et vos contenus.</li>
          </ul>
          <p>
            Aucune donnée n&apos;est collectée à votre insu. Aucun traceur publicitaire,
            aucune revente, aucun transfert à un tiers.
          </p>
        </Section>

        <Section titre="Finalité et base légale">
          <p>
            Ces données servent exclusivement à vous restituer vos propres indicateurs et à permettre
            l&apos;accompagnement par votre consultant. Le traitement repose sur l&apos;exécution du
            contrat d&apos;accompagnement qui vous lie à Pilote et Vous.
          </p>
        </Section>

        <Section titre="Cloisonnement">
          <p>
            L&apos;application est <strong>multi-tenant</strong> : plusieurs entreprises coexistent sur
            une même instance. Chaque enregistrement porte l&apos;identifiant de l&apos;entreprise
            propriétaire, et <strong>chaque requête part de l&apos;identifiant de votre session</strong>,
            jamais d&apos;un paramètre transmis par le navigateur. Un client ne peut donc pas accéder
            aux données d&apos;un autre.
          </p>
          <p>
            Votre consultant accède aux entreprises de son portefeuille, et à elles seules. Un mode
            Confidentialité permet de masquer les noms lors d&apos;une présentation.
          </p>
        </Section>

        <Section titre="Sécurité">
          <p>
            Mots de passe hachés avec bcrypt, sessions signées par jeton JWT, échanges chiffrés en
            HTTPS, hébergement des données en Europe.
          </p>
        </Section>

        <Section titre="Conservation">
          <p>
            Vos données sont conservées pendant la durée de l&apos;accompagnement, puis pendant la
            période de conservation légale applicable aux pièces comptables. Au-delà, elles sont
            supprimées.
          </p>
        </Section>

        <Section titre="Vos droits">
          <p>
            Conformément au règlement général sur la protection des données, vous disposez d&apos;un
            droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition
            et de portabilité de vos données.
          </p>
          <p>
            L&apos;export CSV disponible depuis la page Audit &amp; Prévisionnel constitue une première
            mise en œuvre du droit à la portabilité. Pour toute autre demande, adressez-vous à votre
            consultant. Vous pouvez également introduire une réclamation auprès de la CNIL.
          </p>
        </Section>

        <p className="text-xs text-ghost text-center pt-2">
          Document rédigé dans le cadre du développement de Pilote90. Il devra être revu avec un
          conseil juridique avant la mise en service auprès de clients réels.
        </p>
      </div>
    </main>
  )
}
