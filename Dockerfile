FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc --build ./tsconfig.json

CMD [ "node", "dist/index.js" ]