# Mise en production sur le VPS : procédure

Tout ce qui suit est de **l'exécution** : les fichiers de configuration sont déjà écrits et versionnés dans le dépôt, sous `deploy/`, plus `Dockerfile` et `docker-compose.yml` à la racine.

Comptez une demi-journée si tout se passe bien, une journée avec les imprévus habituels.

---

## Avant de commencer : trois vérifications

```bash
# 1. Le build de production passe
npm run build

# 2. Les tests passent
npm test

# 3. Un nom de domaine pointe bien sur l'IP du VPS
dig +short pilote90.exemple.fr
```

Si le premier point échoue, arrêtez-vous là : inutile de préparer un déploiement pour une application qui ne se construit pas.

---

## Étape 1 : Préparer le serveur

Connecté en root une dernière fois :

```bash
# Utilisateur applicatif, distinct de root
adduser --disabled-password --gecos "" pilote
usermod -aG sudo pilote

# Votre clé publique pour cet utilisateur
mkdir -p /home/pilote/.ssh
cp ~/.ssh/authorized_keys /home/pilote/.ssh/
chown -R pilote:pilote /home/pilote/.ssh
chmod 700 /home/pilote/.ssh && chmod 600 /home/pilote/.ssh/authorized_keys
```

**Vérifiez que vous pouvez vous connecter en `pilote` depuis une seconde session avant de continuer.** Se verrouiller dehors de son propre serveur est un grand classique.

### Durcissement SSH

Dans `/etc/ssh/sshd_config` :

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
systemctl restart ssh
```

### Pare-feu : politique de refus par défaut

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

Trois ports ouverts, pas un de plus. C'est le principe de moindre privilège appliqué à la surface réseau.

### fail2ban

```bash
apt install -y fail2ban
systemctl enable --now fail2ban
fail2ban-client status sshd
```

Il bannit automatiquement les adresses qui multiplient les tentatives de connexion. Sur un serveur exposé, c'est du trafic quotidien.

---

## Étape 2 : Docker

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker pilote
```

Reconnectez-vous en `pilote` pour que l'appartenance au groupe prenne effet.

---

## Étape 3 : Récupérer le code

```bash
sudo mkdir -p /opt/pilote90 && sudo chown pilote:pilote /opt/pilote90
git clone https://github.com/AugustinS-Pro/pilote90.git /opt/pilote90
cd /opt/pilote90
git checkout main                   # le déploiement se fait toujours depuis main
```

---

## Étape 4 : Les variables d'environnement

```bash
cp .env.production.example .env.production
nano .env.production
chmod 600 .env.production
```

À renseigner : `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL` (l'URL publique, en HTTPS), et `NEXTAUTH_SECRET` généré par :

```bash
openssl rand -base64 32
```

> **Ne réutilisez pas le secret de développement.** Un secret partagé entre deux environnements permet de forger un jeton valide en production depuis la machine de développement.

---

## Étape 5 : Le certificat TLS

Adaptez d'abord le nom de domaine dans `deploy/nginx/pilote90.conf` : il y apparaît trois fois.

Premier certificat, avant de lancer Nginx :

```bash
docker run --rm \
  -v pilote90_certbot-conf:/etc/letsencrypt \
  -v pilote90_certbot-www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d pilote90.exemple.fr \
  --email votre@email.fr --agree-tos --no-eff-email
```

Le renouvellement est ensuite automatique : le conteneur `certbot` du compose tente un renouvellement toutes les douze heures et n'agit qu'à moins de trente jours de l'expiration.

Copiez aussi la zone de limitation de débit là où Nginx l'attend :

```bash
docker cp deploy/nginx/limites.conf pilote90-nginx:/etc/nginx/conf.d/limites.conf
docker cp deploy/nginx/proxy-commun.inc pilote90-nginx:/etc/nginx/conf.d/proxy-commun.inc
```

---

## Étape 6 : Migrer la base, puis démarrer

```bash
# Les migrations s'appliquent avant le premier démarrage
docker compose run --rm app npx prisma migrate deploy

# Puis on lance
docker compose up -d --build
docker compose ps
docker compose logs -f app
```

---

## Étape 7 : Les comptes de démonstration

**Impératif, et à ne pas repousser.**

Le jeu de démonstration contient des mots de passe en clair : `pilote90`, `marie2026`, `thomas2026`. Ils ne doivent jamais exister sur un serveur public.

Deux options :

- **ne pas exécuter le seed en production**, et créer les comptes réels à la main ;
- ou l'exécuter, puis **changer immédiatement les trois mots de passe**.

Si vous gardez des comptes de démonstration pour la soutenance, donnez-leur des mots de passe forts et propres à la production.

---

## Étape 8 : Sauvegarde et supervision

```bash
chmod +x deploy/*.sh

crontab -e
```

```cron
# Sauvegarde quotidienne à 3 h
0 3 * * * /opt/pilote90/deploy/sauvegarde.sh >> /var/log/pilote90-sauvegarde.log 2>&1

# Supervision toutes les dix minutes
*/10 * * * * /opt/pilote90/deploy/supervision.sh >> /var/log/pilote90-supervision.log 2>&1
```

### Puis testez la restauration. Vraiment.

```bash
./deploy/sauvegarde.sh
./deploy/restauration.sh /var/backups/pilote90/pilote90_<horodatage>.sql.gz
```

*« J'ai des sauvegardes »* et *« j'ai restauré une sauvegarde »* ne sont pas la même phrase devant un jury. La seconde se dit une fois qu'on l'a faite.

---

## Étape 9 : Vérification

| # | À vérifier | Attendu |
|---|---|---|
| 1 | `https://votre-domaine` | L'écran de connexion, cadenas fermé |
| 2 | `http://votre-domaine` | Redirection automatique vers HTTPS |
| 3 | Connexion, puis parcours des onze pages | Aucune erreur |
| 4 | Saisie d'une transaction | Propagation au tableau de bord |
| 5 | Export CSV | Le fichier se télécharge |
| 6 | `docker compose logs app` | Aucune erreur récurrente |
| 7 | `ufw status` | Trois ports, pas davantage |
| 8 | `curl -I https://votre-domaine` | En-tête `Strict-Transport-Security` présent |
| 9 | `systemctl reboot`, puis attendre | Les conteneurs redémarrent seuls (`restart: unless-stopped`) |

Le point 9 est celui qu'on oublie et qui se paye le jour où le serveur redémarre tout seul.

---

## Mettre à jour, ensuite

```bash
cd /opt/pilote90
git pull
docker compose run --rm app npx prisma migrate deploy
docker compose up -d --build
```

Une fois la chaîne de déploiement continu en place, ces trois commandes se déclencheront à chaque fusion sur la branche principale.

---

## Ce que ce déploiement démontre, bloc par bloc

À savoir dire, parce que c'est exactement ce que le référentiel attend.

| Élément | Compétence couverte |
|---|---|
| Passage de Vercel (PaaS) à un VPS administré (IaaS) | **Décision d'infrastructure argumentée**, bloc 5 |
| UFW en refus par défaut, trois ports | Moindre privilège |
| SSH par clés, root désactivé, fail2ban | Durcissement des accès |
| Nginx en point d'entrée unique, TLS Let's Encrypt | Défense en profondeur, chiffrement de bout en bout |
| Conteneur sans privilège, utilisateur dédié | Réduction de la surface d'attaque |
| HSTS et en-têtes de sécurité | Bonnes pratiques OWASP |
| Sauvegarde automatisée **et restauration testée** | Continuité d'activité |
| Supervision à seuils, alertes ciblées | Maintien en condition opérationnelle |
| Hébergement européen | Conformité RGPD |

**Le type de migration retenu**, que le référentiel demande de nommer : il s'agit d'un ***lift and reshape***. L'application n'est pas transportée telle quelle, puisqu'elle est conteneurisée et placée derrière un reverse proxy, mais son architecture n'est pas repensée. Le *re-architecturing* aurait signifié découper en services distincts, ce qui n'a aucun sens à cette échelle.

---

## Si quelque chose casse

| Symptôme | Piste |
|---|---|
| Le build échoue dans Docker | Vérifiez que `npx prisma generate` passe bien avant `npm run build` |
| `PrismaClientInitializationError` | `DATABASE_URL` absente de `.env.production`, ou pooler injoignable |
| Erreur de certificat | Le DNS ne pointe pas encore, ou le port 80 était occupé pendant l'émission |
| Redirection infinie | `NEXTAUTH_URL` en `http://` au lieu de `https://` |
| Déconnexion à chaque navigation | `NEXTAUTH_SECRET` absente ou différente entre deux redémarrages |
| 502 Bad Gateway | Le conteneur `app` n'a pas démarré : `docker compose logs app` |
