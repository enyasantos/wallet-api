FROM node:latest

WORKDIR /api

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD yarn run migration:run && yarn start