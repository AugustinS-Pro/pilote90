import Link from 'next/link'

export default function Introuvable() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-subtle shadow-sm p-8 text-center">
        <p className="text-4xl font-extrabold text-accent mb-3">404</p>
        <h1 className="text-lg font-extrabold text-ink mb-2">Cette page n&apos;existe pas</h1>
        <p className="text-sm text-muted mb-6">
          Le lien est peut-être ancien, ou la page a été déplacée.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-accent hover:bg-accent-strong text-on-accent text-sm
                     font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  )
}
