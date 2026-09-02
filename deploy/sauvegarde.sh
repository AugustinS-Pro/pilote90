#!/usr/bin/env bash
# =============================================================================
# Sauvegarde horodatee de la base PostgreSQL de Pilote90.
#
# Le code applicatif est deja versionne sur GitHub, donc reconstructible a
# l'identique : seule la base a besoin d'etre sauvegardee.
#
# Installation :
#   chmod +x /opt/pilote90/deploy/sauvegarde.sh
#   crontab -e
#   0 3 * * * /opt/pilote90/deploy/sauvegarde.sh >> /var/log/pilote90-sauvegarde.log 2>&1
# =============================================================================

set -euo pipefail

DESTINATION="/var/backups/pilote90"
RETENTION_JOURS=14
HORODATAGE="$(date +%Y-%m-%d_%Hh%M)"
FICHIER="${DESTINATION}/pilote90_${HORODATAGE}.sql.gz"

# DIRECT_URL pointe la connexion directe : les dumps ne passent pas
# par le pooler de connexions.
source /opt/pilote90/.env.production

mkdir -p "${DESTINATION}"

echo "[$(date '+%F %T')] Sauvegarde vers ${FICHIER}"

pg_dump --no-owner --no-privileges --format=plain "${DIRECT_URL}" | gzip -9 > "${FICHIER}"

TAILLE=$(stat -c %s "${FICHIER}")
if [ "${TAILLE}" -lt 10000 ]; then
  echo "ERREUR : sauvegarde suspecte (${TAILLE} octets). Fichier conserve pour analyse."
  exit 1
fi

echo "[$(date '+%F %T')] Sauvegarde reussie : $(numfmt --to=iec "${TAILLE}")"

# Rotation : on ne conserve que les quatorze derniers jours.
find "${DESTINATION}" -name 'pilote90_*.sql.gz' -mtime "+${RETENTION_JOURS}" -delete

echo "[$(date '+%F %T')] Sauvegardes conservees : $(ls -1 "${DESTINATION}" | wc -l)"
