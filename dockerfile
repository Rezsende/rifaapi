FROM node:20-alpine3.21
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]



