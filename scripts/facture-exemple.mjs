/**
 * Fabrique une facture Factur-X d'exemple, pour essayer la lecture.
 *
 *   node scripts/facture-exemple.mjs
 *       ecrit facture-exemple.pdf dans le repertoire courant
 *
 *   node scripts/facture-exemple.mjs avoir
 *       ecrit un avoir, pour verifier l'inversion du sens
 *
 * Le fichier produit est un vrai PDF : il s'ouvre dans un lecteur, et il porte
 * en piece jointe le XML que l'application lit. Il sert a essayer la
 * fonctionnalite sans attendre qu'un vrai fournisseur en envoie une.
 *
 * Ce script ne fait pas partie de l'application : il ne sert qu'a l'essai.
 */

import { writeFileSync } from 'node:fs'
import { PDFDocument, StandardFonts } from 'pdf-lib'

const avoir = process.argv[2] === 'avoir'

const donnees = {
  numero: avoir ? 'AV-2026-0007' : 'FA-2026-0142',
  typeCode: avoir ? '381' : '380',
  date: '20260915',
  vendeur: 'Atelier Claire',
  acheteur: 'Pilote et Vous',
  ht: '1250.00',
  tva: '250.00',
  ttc: '1500.00',
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
    xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
    xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
    xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:factur-x.eu:1p0:basic</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${donnees.numero}</ram:ID>
    <ram:TypeCode>${donnees.typeCode}</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${donnees.date}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${donnees.vendeur}</ram:Name>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${donnees.acheteur}</ram:Name>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery/>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${donnees.ht}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${donnees.ht}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${donnees.tva}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount currencyID="EUR">${donnees.ttc}</ram:GrandTotalAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`

const pdf = await PDFDocument.create()
const police = await pdf.embedFont(StandardFonts.Helvetica)
const gras = await pdf.embedFont(StandardFonts.HelveticaBold)
const page = pdf.addPage([595, 842])

let y = 780
const ecrire = (texte, taille = 11, fonte = police) => {
  page.drawText(texte, { x: 56, y, size: taille, font: fonte })
  y -= taille + 8
}

ecrire(avoir ? 'AVOIR' : 'FACTURE', 22, gras)
y -= 10
ecrire(`${avoir ? 'Avoir' : 'Facture'} n° ${donnees.numero}`, 12, gras)
ecrire(`Émise le 15/09/2026`)
y -= 14
ecrire('Émetteur', 11, gras)
ecrire(donnees.vendeur)
y -= 8
ecrire('Destinataire', 11, gras)
ecrire(donnees.acheteur)
y -= 20
ecrire(`Total HT      ${donnees.ht} EUR`, 12, gras)
ecrire(`TVA 20 %      ${donnees.tva} EUR`)
ecrire(`Total TTC     ${donnees.ttc} EUR`, 12, gras)
y -= 26
ecrire('Facture électronique au format Factur-X : les montants ci-dessus', 9)
ecrire('sont également portés par le fichier de données joint à ce PDF.', 9)

await pdf.attach(Buffer.from(xml, 'utf8'), 'factur-x.xml', {
  mimeType: 'text/xml',
  description: 'Factur-X invoice data',
})

const nom = avoir ? 'avoir-exemple.pdf' : 'facture-exemple.pdf'
writeFileSync(nom, await pdf.save())
console.log(`${nom} écrit.`)
