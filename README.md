# Pilote90

**Pilote90** est une application web de pilotage stratégique conçue pour les entrepreneurs indépendants et les dirigeants de petites structures. Elle centralise en un seul endroit tout ce qui permet de piloter une activité : vision, finances, clients, communication et plan d'action, organisés autour de cycles de 90 jours.

Développée en partenariat avec **Pilote et Vous**, cabinet de conseil en stratégie et organisation pour TPE et solopreneurs.

---

## Le principe

> Ce qui peut se calculer ne se saisit pas.

Le total des charges, le chiffre d'affaires nécessaire pour atteindre un revenu net, le nombre de clients à signer, la trésorerie, le résultat net, le chiffre d'affaires généré par offre, le taux de conversion, la progression d'une priorité stratégique : **aucune de ces valeurs n'existe en base de données.** Toutes se déduisent des données saisies, et l'interface affiche la formule à côté du chiffre.

Un dirigeant doit pouvoir comprendre d'où sort un nombre pour lui accorder sa confiance.

---

## Les cinq axes

**Vision CEO.** Vision, mission, grand pourquoi et objectif annuel. Les trois priorités du cycle. Le parking d'idées, relu à la clôture. Le journal des décisions.

**Chiffres & Administratif.** Saisie des revenus et des charges. Structure administrative, taux de charges, simulateur « combien dois-je générer pour vivre », échéances avec alerte.

**Offres & Clients.** Client idéal, catalogue d'offres, architecture de gamme, mini-CRM avec historique d'achats, retours de satisfaction.

**Communication & Ventes.** Problèmes du persona, thématiques, calendrier éditorial, pipeline commercial à quatre étapes.

**Pilotage 90 jours.** Création et clôture de cycles, plan mensuel, douze semaines avec focus et revue, cockpit du jour.

**L'interconnexion** est ce qui distingue Pilote90 d'un empilement de modules : une action quotidienne se rattache à une priorité stratégique, et cocher l'action fait progresser la priorité.

---

## Module Audit & Prévisionnel

Support de travail partagé entre le consultant et ses clients : quatre indicateurs avec leur formule, graphe chiffre d'affaires / charges sur douze mois glissants, prévisionnel à six mois en trois scénarios, audit automatique à trois niveaux (Alerte, Attention, Analyse) où chaque constat nomme la règle qui l'a déclenché, et export CSV pour le comptable.

Le consultant accède à l'audit de chaque client de son portefeuille, avec un **mode Confidentialité** qui masque les noms en présentation publique.

---

## Stack technique

- **Framework** : Next.js 15 (App Router) + React 19
- **Langage** : TypeScript, sans aucun `any`
- **Base de données** : PostgreSQL via Supabase
- **ORM** : Prisma 6, 28 modèles et 22 énumérations
- **Authentification** : NextAuth.js, stratégie JWT, mots de passe hachés avec bcrypt
- **Validation** : Zod, côté serveur, sur toutes les écritures
- **Interface** : Tailwind CSS 4, Recharts
- **Tests** : Vitest
- **Intégration continue** : GitHub Actions

## Sécurité et cloisonnement

L'architecture est **multi-tenant** : plusieurs entreprises coexistent sur une seule instance. Hors la table des comptes, chaque enregistrement porte l'identifiant de l'entreprise propriétaire, et **chaque requête part de l'identifiant de session**, jamais d'un paramètre transmis par le navigateur. La règle est centralisée dans `lib/session.ts`.

---

## Démarrer

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

Variables d'environnement attendues dans `.env.local` : `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm test` | Tests unitaires (Vitest) |
| `npm run typecheck` | Vérification du typage |
| `npm run lint` | Vérification du style |
| `npm run seed` | Jeu de démonstration, en dates glissantes et idempotent |

---

## Organisation du code

```
app/
  (auth)/login            Connexion
  (dashboard)/            Toutes les pages authentifiées, avec la barre latérale
    dashboard  axe1..axe5  audit  clients  decisions  historique  bibliotheque
  api/auth                NextAuth
components/
  ui/                     Bibliothèque de composants partagés
  layout/                 Barre latérale
lib/
  session.ts              Cloisonnement multi-tenant, point d'entrée unique
  finance.ts              Calculs du module Audit, fonctions pures
  charges.ts              Formules de l'axe 2, fonctions pures
  validation.ts           Schémas Zod
prisma/
  schema.prisma           28 modèles
  seed.ts                 Jeu de démonstration
tests/                    Tests unitaires des calculs financiers
```

Les fonctions de calcul sont isolées dans `lib/finance.ts` et `lib/charges.ts`, sans accès à la base : c'est ce qui les rend testables sans environnement.

---

## État du projet

Le cœur applicatif est en place : les cinq axes, le module décisionnel, l'espace consultant et les pages système. Restent en chantier la mise en production sur serveur dédié, les tests de parcours automatisés, l'automatisation des imports comptables et l'audit d'accessibilité.

## Licence

Projet privé, tous droits réservés.
