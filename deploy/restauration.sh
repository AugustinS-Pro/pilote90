#!/usr/bin/env bash
# =============================================================================
# Restauration d'une sauvegarde Pilote90.
#
# A tester au moins une fois : une sauvegarde jamais restauree n'est pas une
# sauvegarde, c'est une hypothese.
#
#   ./restauration.sh /var/backups/pilote90/pilote90_2026-09-10_03h00.sql.gz
# =============================================================================

set -euo pipefail

ARCHIVE="${1:?Usage : restauration.sh <fichier.sql.gz>}"
[ -f "${ARCHIVE}" ] || { echo "Fichier introuvable : ${ARCHIVE}"; exit 1; }

source /opt/pilote90/.env.production

echo "ATTENTION : cette operation ecrase le contenu actuel de la base."
echo "Archive : ${ARCHIVE}"
read -r -p "Taper RESTAURER pour confirmer : " reponse
[ "${reponse}" = "RESTAURER" ] || { echo "Annule."; exit 1; }

echo "[$(date '+%F %T')] Restauration en cours..."
gunzip -c "${ARCHIVE}" | psql "${DIRECT_URL}"
echo "[$(date '+%F %T')] Restauration terminee."
