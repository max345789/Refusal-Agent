# Refusal Bot - Production API
FROM node:20-alpine

WORKDIR /app

# Prisma and dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
