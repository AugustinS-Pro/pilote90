# Tests de parcours

Cinq parcours, executes contre le **build de production** et non contre le serveur de developpement : c'est cette version qui sera deployee, et elle ne se comporte pas pareil. Playwright construit l'application et demarre le serveur lui-meme.

## Lancer

```
npm run seed        # les tests supposent le jeu de demonstration en place
npm run test:e2e
```

Pour les voir se derouler dans un navigateur : `npm run test:e2e:ui`.

## Ce que chaque fichier verifie

**`parcours.spec.ts`** verifie la promesse centrale du dossier : une transaction saisie remonte au tableau de bord. Puis la correction en place, en verifiant qu'elle ne cree pas de doublon.

**`cloisonnement.spec.ts`** verifie la propriete de securite du produit, exercee par le seul chemin qui compte, celui d'un navigateur qui essaie : deux consultants ne voient pas les memes entreprises, l'un ne peut pas ouvrir la fiche de l'autre meme en connaissant son identifiant, et un compte accompagne n'atteint pas les axes qu'il n'a pas achetes.

## Deux points ou l'ecriture du test demandait une correction

Ces deux corrections ne changent rien a l'application. Elles corrigent ce que le test observait.

**Le cloisonnement s'assure sur le contenu, pas sur le statut HTTP.** La premiere version attendait un code 404 et recevait 200. La garde de `app/(dashboard)/clients/[id]/page.tsx` fait pourtant bien son travail : elle filtre sur `{ id, adminId: utilisateur.id }` puis appelle `notFound()`. Mais `app/(dashboard)/loading.tsx` rend la route streamee, donc Next envoie l'en-tete de reponse avec le squelette de chargement **avant** d'executer la requete. Quand `notFound()` s'execute, l'en-tete 200 est deja parti. Ce que voit l'utilisateur, et ce que le test verifie desormais, c'est la page « Cette page n'existe pas » et l'absence de toute donnee de l'autre consultant.

**La correction en place a besoin de son propre delai.** Le test echouait une execution sur deux. Le succes de l'action referme le formulaire immediatement, cote client, mais la ligne n'affiche le nouveau libelle qu'une fois la revalidation du cache serveur revenue : la liste est rendue depuis les donnees du serveur. Ce trajet a depasse les huit secondes du delai par defaut. Le test attend donc deux choses distinctes : la fermeture du formulaire, puis le nouveau libelle, avec un delai propre.

## A savoir

**Les selecteurs ont ete repasses ligne a ligne contre le code le 11 septembre**, apres que les libelles de connexion et l'intitule du bouton de deconnexion ont change. Quatre ne pouvaient plus trouver leur cible :

- `/deconnexion/i` ne matchait plus le bouton, dont le nom accessible est desormais accentue ;
- les deux formulaires de l'axe 2 etaient filtres sur « Enregistrer un revenu » et « Enregistrer une charge », qui sont des `<h2>` places **hors** du `<form>` : ils sont maintenant designes par leur champ cache `type`, `REVENUE` ou `EXPENSE` ;
- le crayon de correction etait cherche dans `locator('div').last()`, qui tombe sur le bloc interne du libelle, lequel ne contient pas le bouton : il est maintenant vise directement par son nom accessible, unique dans la page.

**Ces tests ecrivent en base.** Ils sont serialises pour cette raison, et ils laissent derriere eux quelques transactions horodatees dans le dossier de Marie. Relancer `npm run seed` ne les efface pas : **c'est a nettoyer avant le gel du jeu de demonstration.**
