# Tests de parcours

Ces tests ne tournent pas encore : le paquet n'est pas installe.

## Mise en route, une seule fois

```
npm i -D @playwright/test
npx playwright install chromium
```

Puis **retirer `"tests-e2e"` et `"playwright.config.ts"` de la liste `exclude` du `tsconfig.json`**, pour que le typage les couvre a nouveau.

## Lancer

```
npm run seed        # les tests supposent le jeu de demonstration en place
npm run test:e2e
```

Playwright construit l'application et demarre `npm run start` tout seul : les tests s'executent contre le **build de production**, pas contre le serveur de developpement, parce que c'est cette version qui sera deployee et qu'elle ne se comporte pas pareil.

Pour voir les tests se derouler dans un navigateur : `npm run test:e2e:ui`.

## Ce que chaque fichier verifie

**`parcours.spec.ts`** vérifie la promesse centrale du dossier : une transaction saisie remonte au tableau de bord. Et la correction en place, en verifiant qu'elle ne cree pas de doublon.

**`cloisonnement.spec.ts`** vérifie la propriete de securite du produit, exercee par le seul chemin qui compte, celui d'un navigateur qui essaie : deux consultants ne voient pas les memes entreprises, l'un ne peut pas ouvrir la fiche de l'autre meme en connaissant son identifiant, et un compte accompagne n'atteint pas les axes qu'il n'a pas achetes.

## A savoir

**Les selecteurs sont a verifier au premier lancement.** Ils ont ete ecrits d'apres le code, sans avoir pu etre executes : les libelles de champs et les intitules de boutons peuvent demander un ajustement. C'est normal et c'est rapide, `--ui` montre exactement ce que Playwright ne trouve pas.

**Ces tests ecrivent en base.** Ils sont serialises pour cette raison, et ils laissent derriere eux quelques transactions horodatees dans le dossier de Marie. Relancer `npm run seed` ne les efface pas : c'est a nettoyer avant le gel du jeu de demonstration.
