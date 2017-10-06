FROM node:latest

WORKDIR /app
COPY . /app

RUN yarn install && \
    yarn build && \
    yarn install --prod

EXPOSE 3636

CMD ["node", "./dist/server.js"]