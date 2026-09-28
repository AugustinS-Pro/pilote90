import { describe, it, expect } from 'vitest'
import { deflateSync } from 'node:zlib'
import { lireFacturX, extraireXmlFacturX, estNomDeFactureAttendu } from '@/lib/factur-x'

/** XML d'une facture Factur-X, profil BASIC, reduit aux champs lus. */
function facture({
  numero = 'FA-2026-0142',
  typeCode = '380',
  date = '20260915',
  vendeur = 'Atelier Claire',
  acheteur = 'Pilote et Vous',
  ht = '1250.00',
  ttc = '1500.00',
  devise = 'EUR',
}: Partial<Record<string, string>> = {}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
    xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
    xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
    xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocument>
    <ram:ID>${numero}</ram:ID>
    <ram:TypeCode>${typeCode}</ram:TypeCode>
    <ram:IssueDateTime><udt:DateTimeString format="102">${date}</udt:DateTimeString></ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty><ram:Name>${vendeur}</ram:Name></ram:SellerTradeParty>
      <ram:BuyerTradeParty><ram:Name>${acheteur}</ram:Name></ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>${devise}</ram:InvoiceCurrencyCode>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:TaxBasisTotalAmount>${ht}</ram:TaxBasisTotalAmount>
        <ram:GrandTotalAmount currencyID="${devise}">${ttc}</ram:GrandTotalAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`
}

describe('lireFacturX', () => {
  it('lit les champs d une facture complete', () => {
    const lu = lireFacturX(facture())
    expect(lu.ok).toBe(true)
    if (!lu.ok) return
    expect(lu.facture.numero).toBe('FA-2026-0142')
    expect(lu.facture.typeDocument).toBe('Facture')
    expect(lu.facture.deduction).toBe(false)
    expect(lu.facture.vendeur).toBe('Atelier Claire')
    expect(lu.facture.acheteur).toBe('Pilote et Vous')
    expect(lu.facture.devise).toBe('EUR')
  })

  it('rend les montants en centimes, comme le reste de l application', () => {
    const lu = lireFacturX(facture({ ht: '1250.00', ttc: '1500.00' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.montantHt).toBe(125000)
    expect(lu.facture.montantTtc).toBe(150000)
  })

  it('arrondit au centime sans deriver', () => {
    const lu = lireFacturX(facture({ ht: '33.33', ttc: '39.996' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.montantHt).toBe(3333)
    expect(lu.facture.montantTtc).toBe(4000)
  })

  it('accepte la virgule decimale', () => {
    const lu = lireFacturX(facture({ ht: '1250,50' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.montantHt).toBe(125050)
  })

  it('lit la date au format 102 sans decalage de jour', () => {
    const lu = lireFacturX(facture({ date: '20260915' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.dateEmission.toISOString().slice(0, 10)).toBe('2026-09-15')
  })

  it('accepte aussi une date ecrite en ISO', () => {
    const lu = lireFacturX(facture({ date: '2026-09-15T00:00:00' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.dateEmission.toISOString().slice(0, 10)).toBe('2026-09-15')
  })

  it('signale un avoir comme venant en deduction', () => {
    const lu = lireFacturX(facture({ typeCode: '381' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.typeDocument).toBe('Avoir')
    expect(lu.facture.deduction).toBe(true)
    // Le XML d'un avoir porte un montant positif : c'est le code de type qui
    // dit le sens, jamais le signe.
    expect(lu.facture.montantHt).toBeGreaterThan(0)
  })

  it('reconnait une facture rectificative', () => {
    const lu = lireFacturX(facture({ typeCode: '384' }))
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.typeDocument).toBe('Facture rectificative')
    expect(lu.facture.deduction).toBe(false)
  })

  it('refuse un type de document inconnu en le nommant', () => {
    const lu = lireFacturX(facture({ typeCode: '220' }))
    expect(lu.ok).toBe(false)
    if (lu.ok) return
    expect(lu.raison).toContain('220')
  })

  it('refuse un XML dont la racine n est pas une facture', () => {
    const lu = lireFacturX('<Autre><ID>1</ID></Autre>')
    expect(lu.ok).toBe(false)
    if (lu.ok) return
    expect(lu.raison).toContain('CrossIndustryInvoice')
  })

  it('refuse un fichier qui n est pas du XML', () => {
    expect(lireFacturX('facture du 15 septembre').ok).toBe(false)
  })

  it('refuse une facture sans numero, pour ne pas creer de doublon', () => {
    const lu = lireFacturX(facture().replace(/<ram:ID>[^<]*<\/ram:ID>/, '<ram:ID></ram:ID>'))
    expect(lu.ok).toBe(false)
    if (lu.ok) return
    expect(lu.raison).toContain('doublon')
  })

  it('refuse une facture sans total hors taxes', () => {
    const lu = lireFacturX(facture().replace(/<ram:TaxBasisTotalAmount>[^<]*<\/ram:TaxBasisTotalAmount>/, ''))
    expect(lu.ok).toBe(false)
    if (lu.ok) return
    expect(lu.raison).toContain('hors taxes')
  })

  it('se rabat sur le total des lignes quand la base taxable manque', () => {
    const source = facture()
      .replace('<ram:TaxBasisTotalAmount>1250.00</ram:TaxBasisTotalAmount>',
               '<ram:LineTotalAmount>1250.00</ram:LineTotalAmount>')
    const lu = lireFacturX(source)
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.montantHt).toBe(125000)
  })

  it('refuse une facture sans date d emission', () => {
    const lu = lireFacturX(facture({ date: 'le 15 septembre' }))
    expect(lu.ok).toBe(false)
    if (lu.ok) return
    expect(lu.raison).toContain('emission')
  })

  it('tolere l absence de nom de partie sans refuser la facture', () => {
    const source = facture().replace('<ram:Name>Atelier Claire</ram:Name>', '')
    const lu = lireFacturX(source)
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.vendeur).toBeNull()
    expect(lu.facture.montantHt).toBe(125000)
  })

  it('retient la devise declaree, euro par defaut', () => {
    const suisse = lireFacturX(facture({ devise: 'CHF' }))
    if (!suisse.ok) throw new Error(suisse.raison)
    expect(suisse.facture.devise).toBe('CHF')

    const sansDevise = lireFacturX(
      facture().replace(/<ram:InvoiceCurrencyCode>[^<]*<\/ram:InvoiceCurrencyCode>/, ''),
    )
    if (!sansDevise.ok) throw new Error(sansDevise.raison)
    expect(sansDevise.facture.devise).toBe('EUR')
  })
})

/** Assemble un PDF minimal portant le XML en piece jointe compressee. */
function pdfAvecPieceJointe(xml: string, compresse = true): Uint8Array {
  const flux = compresse ? deflateSync(Buffer.from(xml, 'utf8')) : Buffer.from(xml, 'utf8')
  const morceaux = [
    Buffer.from('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n2 0 obj\n<< /Length ', 'latin1'),
    Buffer.from(`${flux.length} ${compresse ? '/Filter /FlateDecode ' : ''}>>\nstream\n`, 'latin1'),
    flux,
    Buffer.from('\nendstream\nendobj\n%%EOF\n', 'latin1'),
  ]
  return new Uint8Array(Buffer.concat(morceaux))
}

describe('extraireXmlFacturX', () => {
  it('retrouve le XML d un flux compresse', () => {
    const xml = extraireXmlFacturX(pdfAvecPieceJointe(facture()))
    expect(xml).not.toBeNull()
    const lu = lireFacturX(xml!)
    if (!lu.ok) throw new Error(lu.raison)
    expect(lu.facture.numero).toBe('FA-2026-0142')
  })

  it('retrouve le XML d un flux non compresse', () => {
    const xml = extraireXmlFacturX(pdfAvecPieceJointe(facture(), false))
    expect(xml).not.toBeNull()
    expect(lireFacturX(xml!).ok).toBe(true)
  })

  it('rend null sur un PDF sans piece jointe de facture', () => {
    const sansFacture = pdfAvecPieceJointe('<?xml version="1.0"?><autre>rien</autre>')
    expect(extraireXmlFacturX(sansFacture)).toBeNull()
  })

  it('rend null sur un fichier qui n est pas un PDF', () => {
    expect(extraireXmlFacturX(new Uint8Array(Buffer.from('PK\u0003\u0004 un zip')))).toBeNull()
  })

  it('rend null sur un fichier vide', () => {
    expect(extraireXmlFacturX(new Uint8Array())).toBeNull()
  })
})

describe('estNomDeFactureAttendu', () => {
  it('reconnait les noms normalises, quelle que soit la casse', () => {
    expect(estNomDeFactureAttendu('factur-x.xml')).toBe(true)
    expect(estNomDeFactureAttendu('ZUGFeRD-invoice.xml')).toBe(true)
    expect(estNomDeFactureAttendu(' factur-x.xml ')).toBe(true)
  })

  it('ecarte un autre fichier joint', () => {
    expect(estNomDeFactureAttendu('conditions.pdf')).toBe(false)
  })
})
