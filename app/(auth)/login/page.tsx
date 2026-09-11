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

    // La racine aiguille selon les habilitations : un consultant va a son
    // portefeuille, un entrepreneur a son espace.
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14
                          rounded-2xl bg-gradient-to-br from-accent to-accent-alt
                          text-on-accent font-bold text-2xl mb-4">
            P
          </div>
          <h1 className="text-3xl font-extrabold text-ink">Pilote90</h1>
          <p className="text-muted mt-1 text-sm">
            Pilotez votre activité par cycles de 90 jours
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-surface rounded-2xl border border-subtle
                        shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-muted
                                uppercase tracking-wide mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-subtle
                           bg-canvas text-ink text-sm
                           focus:outline-none focus:border-accent focus:bg-surface
                           transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-muted
                                uppercase tracking-wide mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-subtle
                           bg-canvas text-ink text-sm
                           focus:outline-none focus:border-accent focus:bg-surface
                           transition-colors"
              />
            </div>

            {error && (
              <p className="text-negative-ink text-sm bg-negative-soft border border-negative
                            rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-strong disabled:opacity-60
                         text-on-accent font-semibold py-2.5 rounded-xl text-sm
                         transition-all duration-200 hover:-translate-y-0.5
                         hover:shadow-lg hover:shadow-accent-soft"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-ghost mt-6">
          Pilote et Vous · Accès réservé
        </p>
        <p className="text-center text-xs text-ghost mt-2">
          <a href="/mentions-legales" className="hover:text-muted underline underline-offset-2">
            Mentions légales et protection des données
          </a>
        </p>
      </div>
    </main>
  )
}