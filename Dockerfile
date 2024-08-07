FROM node:22-alpine3.19
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build
# EXPOSE 5173
EXPOSE 8080

# CMD [ "npm", "run", "dev", "--", "--host" ]
CMD [ "npm", "run", "dev" ]
# CMD [ "node", "server.js" ]
