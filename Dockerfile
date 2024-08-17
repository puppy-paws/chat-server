#############################################
FROM node:18 As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache --only=production && yarn cache clean --force

COPY --chown=node:node . .

RUN yarn build

USER node

#############################################
FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env ./.env

CMD [ "node", "dist/main.js" ]