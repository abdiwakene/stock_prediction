FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli && nest build

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]