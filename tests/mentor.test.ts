import { describe, it, expect } from 'vitest'
import { ACCROCHES, appartenancesRessources } from '@/lib/mentor'
import { AXES } from '@/lib/coffre'

describe('ACCROCHES', () => {
  it('couvre les cinq axes, sans trou', () => {
    for (const axe of AXES) {
      expect(ACCROCHES[axe], axe).toBeTruthy()
    }
    expect(Object.keys(ACCROCHES).sort()).toEqual([...AXES].sort())
  })
})

describe('appartenancesRessources', () => {
  const ID = 'u-1'

  it('un entrepreneur voit ses ressources et les ressources communes de son accompagnant', () => {
    const a = appartenancesRessources({
      clientId: 'c-1',
      adminDuClient: 'a-1',
      utilisateurEstConsultant: false,
      utilisateurId: ID,
    })
    expect(a).toEqual([
      { clientId: 'c-1' },
      { clientId: null, adminId: 'a-1' },
    ])
  })

  it('n ouvre jamais les ressources communes d un autre consultant', () => {
    // Le defaut d'origine : une ressource a clientId nul etait lue par tous
    // les locataires. Aucune appartenance ne doit viser clientId nul sans
    // nommer un adminId precis.
    const a = appartenancesRessources({
      clientId: 'c-1',
      adminDuClient: 'a-1',
      utilisateurEstConsultant: false,
      utilisateurId: ID,
    })
    for (const condition of a) {
      if (condition.clientId === null) expect(condition.adminId).toBeTruthy()
    }
  })

  it('un consultant voit ce qu il a lui-meme depose', () => {
    const a = appartenancesRessources({
      clientId: null,
      adminDuClient: null,
      utilisateurEstConsultant: true,
      utilisateurId: ID,
    })
    expect(a).toEqual([{ clientId: null, adminId: ID }])
  })

  it('un consultant qui porte aussi un dossier cumule les trois cas', () => {
    const a = appartenancesRessources({
      clientId: 'c-1',
      adminDuClient: 'a-1',
      utilisateurEstConsultant: true,
      utilisateurId: ID,
    })
    expect(a).toHaveLength(3)
  })

  it('ne rend aucune appartenance a un compte sans dossier ni habilitation', () => {
    // Zero appartenance vaut zero ressource : l'appelant ne doit surtout pas
    // traduire une liste vide par « aucun filtre ».
    expect(
      appartenancesRessources({
        clientId: null,
        adminDuClient: null,
        utilisateurEstConsultant: false,
        utilisateurId: ID,
      }),
    ).toEqual([])
  })

  it('un entrepreneur sans accompagnant ne voit que ses propres ressources', () => {
    expect(
      appartenancesRessources({
        clientId: 'c-1',
        adminDuClient: null,
        utilisateurEstConsultant: false,
        utilisateurId: ID,
      }),
    ).toEqual([{ clientId: 'c-1' }])
  })
})
