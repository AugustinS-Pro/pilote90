# En-tetes de securite, dans un include parce qu'ils doivent etre repetes.
#
# Piege nginx : add_header dans un bloc location ANNULE tous ceux herites du
# bloc parent. Le cache des fichiers statiques posait son Cache-Control et
# perdait du meme coup les cinq en-tetes de securite du serveur. D'ou cet
# include, a rappeler dans chaque location qui ajoute un en-tete a elle.

# HSTS : le navigateur refusera toute connexion non chiffree pendant un an.
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options    "nosniff" always;
add_header X-Frame-Options           "SAMEORIGIN" always;
add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()" always;

# Sixieme en-tete, en mode rapport seulement pour commencer.
#
# Une politique trop stricte casse l'application sans rien afficher : le
# navigateur refuse les scripts en silence. En Report-Only il sert la page
# normalement et signale seulement ce qu'il aurait bloque. On lit les
# signalements quelques jours, puis on bascule sur Content-Security-Policy.
#
# unsafe-inline sur les scripts est provisoire, et c'est tout l'enjeu de la
# bascule : Next.js pose des scripts en ligne pour l'hydratation, s'en passer
# demande de leur attacher un nonce genere a chaque reponse.
add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" always;
