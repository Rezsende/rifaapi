FROM node:20-alpine3.21
WORKDIR /app

# Instala as dependências necessárias
RUN apk add --no-cache openssl libssl3 libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
COPY src/ ./src/
COPY tsconfig.json ./
COPY .env ./
COPY certificados ./certificados/
RUN rm -rf node_modules
RUN npm install
RUN npx prisma generate
#RUN npx prisma migrate dev --name createdockker

EXPOSE 3000
CMD ["npm", "run", "dev"]