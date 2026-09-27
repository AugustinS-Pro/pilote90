import { describe, it, expect } from 'vitest'
import { modelePour, actionsAProposer } from '@/lib/modeles-taches'

describe('modelePour', () => {
  it('reconnait un objectif de chiffre d affaires', () => {
    expect(modelePour('Atteindre 5 000 € de CA mensuel').cle).toBe('chiffre')
    expect(modelePour('Augmenter mon revenu').cle).toBe('chiffre')
  })

  it('reconnait un objectif de nouveaux clients', () => {
    expect(modelePour('Signer 3 nouveaux clients').cle).toBe('clients')
    expect(modelePour('Relancer la prospection').cle).toBe('clients')
  })

  it('reconnait un lancement d offre', () => {
    expect(modelePour("Lancer l'offre Pilote90").cle).toBe('offre')
  })

  it('reconnait un objectif de visibilite et d organisation', () => {
    expect(modelePour('Publier deux contenus par semaine').cle).toBe('visibilite')
    expect(modelePour('Organiser ma comptabilité').cle).toBe('organisation')
  })

  it('ignore les accents et la casse', () => {
    expect(modelePour('VISIBILITÉ sur LinkedIn').cle).toBe('visibilite')
  })

  // L'ordre de la liste tranche : le chiffre porte le resultat.
  it('fait passer le chiffre avant les clients quand les deux sont cites', () => {
    expect(modelePour('Atteindre 5 000 € de CA avec trois clients').cle).toBe('chiffre')
  })

  it('retombe sur un modele general quand l intitule ne dit rien', () => {
    expect(modelePour('Projet Alpha').cle).toBe('general')
    expect(modelePour('').cle).toBe('general')
  })

  it('propose toujours au moins deux actions', () => {
    for (const titre of ['CA', 'clients', 'offre', 'publier', 'organiser', 'zzz']) {
      expect(modelePour(titre).actions.length).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('actionsAProposer', () => {
  it('propose toutes les actions du modele quand rien n existe', () => {
    const actions = actionsAProposer('Signer 3 nouveaux clients')
    expect(actions.length).toBe(modelePour('Signer 3 nouveaux clients').actions.length)
  })

  // Reproposer une action deja presente creerait un doublon a chaque clic.
  it('ecarte une action deja presente, accents et casse ignores', () => {
    const modele = modelePour('Signer 3 nouveaux clients')
    const deja = [modele.actions[0].label.toUpperCase()]
    const actions = actionsAProposer('Signer 3 nouveaux clients', deja)
    expect(actions).toHaveLength(modele.actions.length - 1)
    expect(actions.some((a) => a.label === modele.actions[0].label)).toBe(false)
  })

  it('ne propose plus rien quand tout existe deja', () => {
    const modele = modelePour('Publier deux contenus par semaine')
    const deja = modele.actions.map((a) => a.label)
    expect(actionsAProposer('Publier deux contenus par semaine', deja)).toEqual([])
  })
})
