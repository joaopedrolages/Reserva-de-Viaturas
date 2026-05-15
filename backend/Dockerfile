FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json eslint.config.js ./
COPY src ./src
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run start"]
