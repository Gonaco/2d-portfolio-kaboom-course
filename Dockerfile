FROM node:22-alpine3.19
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm run build
COPY . .
EXPOSE 3000
# CMD [ "node", "server.js" ]
CMD [ "npm", "run", "dev"]
