import Link from 'next/link'

export default function Introuvable() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <p className="text-4xl font-extrabold text-indigo-500 mb-3">404</p>
        <h1 className="text-lg font-extrabold text-slate-900 mb-2">Cette page n&apos;existe pas</h1>
        <p className="text-sm text-slate-500 mb-6">
          Le lien est peut-être ancien, ou la page a été déplacée.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white text-sm
                     font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  )
}
