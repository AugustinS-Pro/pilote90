/**
 * Squelette de chargement : l'utilisateur voit la structure de la page
 * arriver plutot qu'un ecran fige.
 */
export default function Chargement() {
  return (
    <div className="p-8 w-full animate-pulse space-y-6">
      <div>
        <div className="h-7 w-64 bg-surface-muted rounded-lg" />
        <div className="h-4 w-96 bg-surface-muted rounded mt-3" />
      </div>

      <div className="h-28 bg-surface-muted rounded-2xl" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl border border-subtle p-5">
            <div className="h-3 w-24 bg-surface-muted rounded" />
            <div className="h-7 w-28 bg-surface-muted rounded mt-3" />
            <div className="h-3 w-20 bg-surface-muted rounded mt-3" />
          </div>
        ))}
      </div>

      <div className="h-64 bg-surface rounded-2xl border border-subtle" />
    </div>
  )
}
