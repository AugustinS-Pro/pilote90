'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14
                          rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500
                          text-white font-bold text-2xl mb-4">
            P
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Pilote90</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Pilotez votre activité par cycles de 90 jours
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-slate-500
                                uppercase tracking-wide mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200
                           bg-[#FAF9F6] text-slate-900 text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white
                           transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500
                                uppercase tracking-wide mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200
                           bg-[#FAF9F6] text-slate-900 text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white
                           transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200
                            rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60
                         text-white font-semibold py-2.5 rounded-xl text-sm
                         transition-all duration-200 hover:-translate-y-0.5
                         hover:shadow-lg hover:shadow-indigo-200"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Pilote et Vous — Accès réservé
        </p>
      </div>
    </main>
  )
}