FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json .
RUN npm install

RUN npm install -g prisma
COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .
RUN npm run build

ENTRYPOINT ["/bin/sh", "-c", "npm run prisma:push && npm run start:prod"]
