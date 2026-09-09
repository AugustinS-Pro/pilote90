#!/usr/bin/env bash
# =============================================================================
# Supervision proportionnee — pour une TPE, pas pour un datacenter.
#
# Trois indicateurs suffisent a detecter une derive avant qu'elle ne devienne
# un incident : la disponibilite du service, l'espace disque, la charge.
#
#   */10 * * * * /opt/pilote90/deploy/supervision.sh >> /var/log/pilote90-supervision.log 2>&1
# =============================================================================

set -uo pipefail

URL="${PILOTE90_URL:-https://pilote90.exemple.fr/login}"
SEUIL_DISQUE=85
SEUIL_CHARGE=4.0
DESTINATAIRE="${PILOTE90_ALERTE_MAIL:-}"

alerter() {
  echo "[$(date '+%F %T')] ALERTE : $1"
  if [ -n "${DESTINATAIRE}" ] && command -v mail >/dev/null 2>&1; then
    echo "$1" | mail -s "[Pilote90] Alerte supervision" "${DESTINATAIRE}"
  fi
}

# 1. Disponibilite du service
CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "${URL}" || echo "000")
if [ "${CODE}" != "200" ]; then
  alerter "L'application ne repond pas (code HTTP ${CODE}) sur ${URL}"
else
  echo "[$(date '+%F %T')] Service disponible (${CODE})"
fi

# 2. Espace disque
DISQUE=$(df / | awk 'NR==2 {gsub("%","",$5); print $5}')
if [ "${DISQUE}" -ge "${SEUIL_DISQUE}" ]; then
  alerter "Espace disque a ${DISQUE} % (seuil ${SEUIL_DISQUE} %)"
fi

# 3. Charge moyenne sur une minute
CHARGE=$(awk '{print $1}' /proc/loadavg)
if awk -v c="${CHARGE}" -v s="${SEUIL_CHARGE}" 'BEGIN {exit !(c > s)}'; then
  alerter "Charge systeme a ${CHARGE} (seuil ${SEUIL_CHARGE})"
fi

# 4. Etat des conteneurs
for conteneur in pilote90-app pilote90-nginx; do
  ETAT=$(docker inspect -f '{{.State.Status}}' "${conteneur}" 2>/dev/null || echo "absent")
  [ "${ETAT}" = "running" ] || alerter "Conteneur ${conteneur} : etat ${ETAT}"
done
