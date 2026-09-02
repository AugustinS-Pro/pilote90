# =============================================================================
# Pilote90 — image de production
#
# Trois etapes pour une image finale minimale : les dependances de build et les
# sources ne se retrouvent pas dans l'image livree.
# =============================================================================

# --- 1. Dependances ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# openssl est requis par les moteurs Prisma sur Alpine.
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
RUN npm ci


# --- 2. Construction ---------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Le client Prisma doit etre genere avant le build : les pages l'importent.
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# --- 3. Execution ------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utilisateur sans privilege : le conteneur ne tourne jamais en root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Sortie autonome produite par `output: 'standalone'`.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma : schema, migrations et moteurs, necessaires pour appliquer les
# migrations au demarrage et pour executer les requetes.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs
EXPOSE 3000

# Sonde de vie : le conteneur est declare sain quand l'application repond.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/login').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
