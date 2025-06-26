FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

#stage - 2

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

EXPOSE 3030

CMD [ "sh", "-c", "until nc -z mysql 3306; do echo 'Waiting for mysql...'; sleep 2; done; node /app/dist/server.js" ]